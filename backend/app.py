import json
from constants import (
    FLASK_DEBUG,
    ORIGINS,
    pandas_problem_start,
    problems,
    pyspark_problem_start,
    scala_problem_start,
    theory_problems,
)
from flask import Flask, request
from flask_cors import CORS
from tools import logger, extract_function, format_pyspark_error, send_code
from waitress import serve


app = Flask(__name__)

CORS(app, origins=ORIGINS)


@app.route("/get_problem", methods=["POST"])
def get_problem():
    logger("Start get_problem()")

    data = json.loads(request.data)

    logger(request.headers)

    problem = problems[data["problem"]]

    return {"response": problem}


@app.route("/get_theory_problems", methods=["POST"])
def get_theory_problems():
    logger("Start get_theory_problems()")

    listing = [
        {
            "id": theory_id,
            "title": theory_problem["title"],
            "type": theory_problem["type"],
            "topic": theory_problem["topic"],
            "subtopic": theory_problem["subtopic"],
            "difficulty": theory_problem["difficulty"],
            "tags": theory_problem["tags"],
        }
        for theory_id, theory_problem in theory_problems.items()
    ]

    return {"response": listing}


@app.route("/get_theory_problem", methods=["POST"])
def get_theory_problem():
    logger("Start get_theory_problem()")

    data = json.loads(request.data)

    return {"response": theory_problems[data["problem"]]}


@app.route("/run_code", methods=["POST"])
def run_code():
    logger("Start run_code()")

    data = json.loads(request.data)

    logger(data)

    problem = data["problem"]

    language = data["language"]

    if language == "pyspark":
        problem_start = pyspark_problem_start
    elif language == "scala":
        problem_start = scala_problem_start
    elif language == "pandas":
        problem_start = pandas_problem_start

    if language == "snowflake":

        payload = send_code({"to_run": data["to_run"], "tests": problems[problem]["tests"]}, language, problem)

        return {"response": payload["result"]}

    if language == "sql":

        payload = send_code({"to_run": data["to_run"], "tests": problems[problem]["tests"], "engine": "duckdb"}, language, problem)

        if payload.get("errorMessage"):

            return {"response": {"errorMessage": payload["errorMessage"]}}

        return {"response": payload["result"]}

    parsed_function_dict = extract_function(data["to_run"], problem_start, problem)

    if parsed_function_dict.get("Error"):

        return {"response": {"errorMessage": parsed_function_dict["Error"]}}

    payload = send_code({"to_run": parsed_function_dict["just_function"], "tests": problems[problem]["tests"]}, language, problem)

    if language in ("pyspark", "pandas") and not payload.get("result") and payload.get("result") != []:

        error_message = format_pyspark_error(payload["errorMessage"], parsed_function_dict["function_starting_line_num"], parsed_function_dict["test_num_starting_lines"])

        return {"response": {"errorMessage": error_message}}

    return {"response": payload["result"]}


if __name__ == "__main__":
    if FLASK_DEBUG:
        app.run(debug=True, host="0.0.0.0", port=5001)
    else:
        serve(app, host="0.0.0.0", port=5001)
