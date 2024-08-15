from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql import Window as W
import pyspark
import datetime
import json
import sys
import os
import pandas as pd


def lambda_handler(event, context):
    def to_markdown(dfs, multi):
        if multi:
            return "\n\n".join([f"{df}\n{pd.DataFrame(dfs[df]).to_markdown(index=False, tablefmt='outline')}" for df in dfs])
        else:
            return pd.DataFrame(dfs).to_markdown(index=False, tablefmt="outline")

    def sort_dict(dicts):
        if isinstance(dicts, list) and len(dicts):
            for item in dicts:
                if type(item) != dict:
                    return dicts
            result = []
            for d in dicts:
                row = {}
                for key in sorted(d):
                    if str(d[key]).lower() in ["null", "none", "n/a", "nan"]:
                        row[key] = None
                    else:
                        row[key] = d[key]
                result.append(row)
            return [json.loads(sd) for sd in sorted(json.dumps(d) for d in result)]
        return dicts

    print(event)
    print()

    spark = SparkSession.builder.appName("run-pyspark-code").config("spark.driver.bindAddress", "127.0.0.1").getOrCreate()

    ldic = locals()

    for test in event["tests"]:
        input_ = test["input"]
        expected_output = sort_dict(test["expected_output"])

        # Making begining DataFrame(s)
        dataframes_string = "\n".join([f"{df} = spark.createDataFrame({str(input_[df])})" for df in input_.keys()])

        # Making result variable with output from running etl function
        result_string = f"df_result = etl({','.join(input_.keys())})"

        to_run = f"{dataframes_string}\n{event['to_run']}\n{result_string}"

        exec(to_run, globals(), ldic)

        df_result = ldic["df_result"]

        if not isinstance(df_result, pyspark.sql.dataframe.DataFrame):

            print(f"Returned response: Error etl function must return an object of type pyspark.sql.dataframe.DataFrame not {type(df_result)}.")

            return {"errorMessage": f"Error etl function must return an object of type pyspark.sql.dataframe.DataFrame not {type(df_result)}."}

        result = sort_dict(df_result.toPandas().to_dict(orient="records"))

        if result != expected_output:

            print(
                f"Returned Response: INCORRECT\n\nINPUT:\n{to_markdown(input_, True)}\n\nOUPUT:\n{to_markdown(result, False)}\n\nEXPECTED OUTPUT:\n{to_markdown(expected_output, False)}"
            )

            return {
                "result": f"INCORRECT\n\nINPUT:\n{to_markdown(input_, True)}\n\nOUPUT:\n{to_markdown(result, False)}\n\nEXPECTED OUTPUT:\n{to_markdown(expected_output, False)}"
            }

    return {"result": "Problem Correct!"}
