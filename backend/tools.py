import datetime
import json
import re
import time
import boto3
import pandas as pd
import requests
import decimal
import sys
from sqlalchemy import create_engine, text
from constants import (
    SNOWFLAKE_USERNAME,
    SNOWFLAKE_PASSWORD,
    SNOWFLAKE_ACCOUNT,
    SNOWFLAKE_WAREHOUSE,
    FLASK_ENV,
    TESTING,
    problems,
)
from jinja2 import Template


def logger(x):
    print(x, file=sys.stderr)


def to_int(dicts):
    def is_integer_num(n):
        if isinstance(n, int):
            return True
        if isinstance(n, float):
            return n.is_integer()
        return False

    if dicts:
        columns = {}
        for column in dicts[0].keys():
            columns[column] = True

        for row in dicts:
            for column in row:
                if not is_integer_num(row[column]) and row[column] != None:
                    columns[column] = False

        for row in dicts:
            for column in row:
                if columns[column] and row[column] != None:
                    row[column] = int(row[column])
        return dicts
    else:
        return []


def sort_dict(dicts):
    if isinstance(dicts, list) and len(dicts):
        for item in dicts:
            if type(item) != dict:
                return dicts

        lower_dicts = []
        for d in dicts:
            new_dict = {}
            for key, value in d.items():
                new_key = key.lower()
                new_dict[new_key] = value
            lower_dicts.append(new_dict)

        result = []
        for d in lower_dicts:
            row = {}
            for key in sorted(d):
                if isinstance(d[key], datetime.datetime):
                    if d[key].hour == 0 and d[key].minute == 0 and d[key].second == 0:
                        row[key] = d[key].strftime("%Y-%m-%d")
                    else:
                        row[key] = d[key].strftime("%Y-%m-%d %H:%M:%S")
                elif str(d[key]).lower() in ["null", "none", "n/a", "nan"]:
                    row[key] = None
                elif isinstance(d[key], float):
                    row[key] = float(f"{d[key]:.5f}")
                else:
                    row[key] = d[key]
            result.append(row)
        return to_int([json.loads(sd) for sd in sorted(json.dumps(d) for d in result)])
    return dicts


def to_markdown(dfs, multi):
    if multi:
        return "\n\n".join([f"{df}\n{pd.DataFrame(dfs[df]).to_markdown(index=False, tablefmt='outline')}" for df in dfs])
    else:
        return pd.DataFrame(dfs).to_markdown(index=False, tablefmt="outline")


def _make_cte(test, query, engine):
    def _process_snowflake_rows(rows):
        new_rows = []
        for row in rows:
            new_row = ""
            for column in row:
                if isinstance(row[column], str):
                    new_row += "'" + row[column].replace("'", "\\'") + "', "
                elif row[column] == None:
                    new_row += "NULL, "
                else:
                    new_row += str(row[column]) + ", "
            new_rows.append("\t\t(" + new_row[:-2] + ")")

        return new_rows

    def _process_output_snowflake_rows(rows):
        new_rows = []
        for row in rows:
            new_row = {}
            for column in row:
                if isinstance(row[column], decimal.Decimal):
                    new_row[column] = float(row[column])
                elif isinstance(row[column], str) and row[column].lower() in ["null", "none", "n/a", "nan", "'null'", '"null"']:
                    new_row[column] = None
                else:
                    new_row[column] = row[column]
            new_rows.append(new_row)

        return new_rows

    cte_blocks = []
    for df in test:
        columns = list(test[df][0].keys())

        columns_formatted = []
        for col_num in range(len(columns)):
            columns_formatted.append(f"\t\tcolumn{col_num + 1} AS {columns[col_num]}")
            col_num += 1

        columns_formatted = ",\n".join(columns_formatted)

        values_formatted = ",\n".join(_process_snowflake_rows(test[df]))

        cte_blocks.append(f"__{df} AS (\n\tSELECT\n{columns_formatted}\nFROM\n\tVALUES\n{values_formatted}),")

    cte_blocks = "\n".join(cte_blocks)

    beginning = "WITH " + cte_blocks + "\n__submission AS (\n"

    ending = "\n) SELECT * FROM __submission"

    query_to_run = beginning + Template(query).render(ref=lambda model: f"__{model}").replace(";", "") + ending

    with engine.connect() as connection:
        try:
            result = connection.execute(text(query_to_run))
            return _process_output_snowflake_rows([dict(row) for row in result])
        except Exception as e:
            lines_to_skip = beginning.count("\n")

            def _increment_error_line(match_obj):
                return f"error line {int(match_obj.group(1)) - lines_to_skip}"

            return re.sub(r"error line (\d+)", _increment_error_line, e.args[0]).replace(beginning, "").replace(ending, "")


def send_code(to_run, language, problem_num):

    if language == "snowflake":

        engine = create_engine(f"snowflake://{SNOWFLAKE_USERNAME}:{SNOWFLAKE_PASSWORD}@{SNOWFLAKE_ACCOUNT}?warehouse={SNOWFLAKE_WAREHOUSE}")

        for test in to_run["tests"]:
            result = sort_dict(_make_cte(test["input"], to_run["to_run"], engine))

            if isinstance(result, str):
                engine.dispose()
                return {"result": str(result)}

            input_ = test["input"]
            expected_output = sort_dict(test["expected_output"])

            if result != expected_output:
                engine.dispose()
                return {
                    "result": f"INCORRECT\n\nINPUT:\n{to_markdown(input_, True)}\n\nOUPUT:\n{to_markdown(result, False)}\n\nEXPECTED OUTPUT:\n{to_markdown(expected_output, False)}"
                }

        engine.dispose()

        return {"result": "Problem Correct!"}

    elif language == "pandas":

        if TESTING:

            response = requests.post(
                "http://10.8.0.6:8080/2015-03-31/functions/function/invocations",
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                data=json.dumps(to_run),
            )

            return json.loads(response.content)

        else:

            response = boto3.client("lambda").invoke(FunctionName=f"db-lambda-{FLASK_ENV}", InvocationType="RequestResponse", Payload=json.dumps(to_run))

            if "Lambda is initializing your function" in str(response):
                return {"errorMessage": "Server timeout, this often happens when running Spark solutions, please try again in 30 seconds."}

            return json.loads(response["Payload"].read())

    elif language == "pyspark":

        if TESTING:

            response = requests.post(
                "http://10.5.0.6:8080/2015-03-31/functions/function/invocations",
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                data=json.dumps(to_run),
            )

            return json.loads(response.content)

        else:

            response = boto3.client("lambda").invoke(FunctionName=f"spark-lambda-{FLASK_ENV}", InvocationType="RequestResponse", Payload=json.dumps(to_run))

            if "Lambda is initializing your function" in str(response):
                return {"errorMessage": "Server timeout, this often happens when running Spark solutions, please try again in 30 seconds."}

            return json.loads(response["Payload"].read())

    elif language == "scala":

        for test in to_run["tests"]:

            to_function = {"to_run": _create_scala_code(to_run["to_run"], test).replace(": None", ": null")}

            if TESTING:

                time.sleep(5)

                response = json.loads(
                    requests.post(
                        "http://10.4.0.6:8080/2015-03-31/functions/function/invocations",
                        headers={"Content-Type": "application/x-www-form-urlencoded"},
                        data=json.dumps(to_function),
                    ).content
                )

            else:
                response = boto3.client("lambda").invoke(
                    FunctionName=f"scala-spark-lambda-{FLASK_ENV}", InvocationType="RequestResponse", Payload=json.dumps(to_function)
                )

                response = json.loads(response["Payload"].read())

                if "Lambda is initializing your function" in str(response):
                    return {"errorMessage": "Server timeout, this often happens when running Spark solutions, please try again in 30 seconds."}

            if response == "Empty":
                result = []
            elif isinstance(response, dict):
                if response.get("errorMessage"):
                    return {"result": response["errorMessage"]}
                else:
                    return {"result": str(response)}
            else:
                split_up = []
                for line in response.split("}, "):
                    line = line.strip()
                    if line:
                        if line[-1] != "}":
                            line = line + "}"

                        as_dict = json.loads(line)

                        added_nulls = {}
                        for column in as_dict:
                            if as_dict[column] in ("ToBeNull", 21435465):
                                added_nulls[column] = None
                            else:
                                added_nulls[column] = as_dict[column]

                        split_up.append(added_nulls)

                result = sort_dict(split_up)
                expected_output = sort_dict(test["expected_output"])

                if result != expected_output:
                    return {
                        "result": f"INCORRECT\n\nINPUT:\n{to_markdown(test['input'], True)}\n\nOUPUT:\n{to_markdown(result, False)}\n\nEXPECTED OUTPUT:\n{to_markdown(expected_output, False)}"
                    }

        return {"result": "Problem Correct!"}


def extract_function(code, problem_start, problem_num):

    if code.replace("\n", "")[: len(problem_start.replace("\n", ""))] != problem_start.replace("\n", ""):

        return {"Error": "Error: Please do not edit the commented section or add code outside of the etl function."}

    just_function = []
    function_started = False
    data_split = code.split("\n")
    for line in data_split:
        if function_started and line and line[0] not in (" ", "\t", "}"):
            return {"Error": "Error: Please do not edit the commented section or add code outside of the etl function."}

        if line[:7] == "def etl":
            function_started = True
        if function_started:
            just_function.append(line)

    just_function = "\n".join(just_function).replace("\t", "    ")

    test_num_starting_lines = len(problems[str(problem_num)]["tests"])

    for line_num in range(len(data_split)):
        if data_split[line_num][:7] == "def etl":
            function_starting_line_num = line_num + 1
            break

    return {"just_function": just_function, "test_num_starting_lines": test_num_starting_lines, "function_starting_line_num": function_starting_line_num}


def _create_scala_code(function, test):

    code = """import org.apache.spark.sql.SparkSession\nimport org.apache.spark.sql.DataFrame\nimport org.apache.spark.sql.functions._\nimport org.apache.spark.sql.expressions.Window\nimport org.apache.spark\nimport java.time._\n\nval spark = SparkSession.builder().appName("run-spark-code").config("spark.master", "local").config("spark.driver.bindAddress", "127.0.0.1").getOrCreate()\n\nimport spark.implicits._\n\ndef run_tests: String = {"""
    code += "\n" + "\n".join(["\t" + line for line in function.split("\n")]) + "\n\n"
    var = "var "
    for df in test["input"]:
        code += f"""\t{var} {df} = spark.read.json(Seq(\"\"\"{test['input'][df]}\"\"\").toDS())\n\n"""

    code += f"""\t{var} returnedfunc = etl({', '.join(test['input'].keys())}).na.fill(21435465).na.fill("ToBeNull")\n\n"""

    code += f"""\t{var} res = if (returnedfunc.rdd.isEmpty() == true) "Empty" else returnedfunc.toJSON.collect().mkString(", ")\n\n"""

    code += "\tres"

    code += """\n}\n\nrun_tests"""

    return code


def format_pyspark_error(error_message, function_starting_line_num, test_num_starting_lines):

    payload_split = error_message.replace("line", "Line").split("Line")
    if len(payload_split) > 1:
        payload_split_formatted = [payload_split[0]]
        for line in payload_split[1:]:
            if line[0] == " ":
                line_num = ""
                for char in line[1:]:
                    if not char.isdigit():
                        break
                    else:
                        line_num += char
            payload_split_formatted.append(
                f"line{line}".replace(
                    f"line {line_num}",
                    f"line {str(int(line_num) + function_starting_line_num - test_num_starting_lines - 1)}",
                )
            )

        error_message = "".join(payload_split_formatted)

    return error_message
