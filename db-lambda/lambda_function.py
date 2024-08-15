import pandas as pd
import numpy as np
import datetime
import json
import math
import re


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

    ldic = locals()

    code = event["to_run"]
    for test in event["tests"]:
        input_ = test["input"]
        expected_output = sort_dict(test["expected_output"])

        for df in input_:
            code += f"\n\n{df} = pd.DataFrame({input_[df]})"

        code += f"\n\ndf_result = etl({', '.join(input_.keys())})"
        try:
            exec(code, globals(), ldic)

            df_result = ldic["df_result"]
        except Exception as e:
            return {"errorMessage": str(e)}

        if not isinstance(df_result, pd.DataFrame):

            print(f"Returned response: Error etl function must return an object of type pandas.DataFrame not {type(df_result)}.")

            return {"errorMessage": f"Error etl function must return an object of type pandas.DataFrame not {type(df_result)}."}

        result = sort_dict(df_result.to_dict(orient="records"))

        if result != expected_output:

            print(
                f"Returned Response: INCORRECT\n\nINPUT:\n{to_markdown(input_, True)}\n\nOUPUT:\n{to_markdown(result, False)}\n\nEXPECTED OUTPUT:\n{to_markdown(expected_output, False)}"
            )

            return {
                "result": f"INCORRECT\n\nINPUT:\n{to_markdown(input_, True)}\n\nOUPUT:\n{to_markdown(result, False)}\n\nEXPECTED OUTPUT:\n{to_markdown(expected_output, False)}"
            }

    return {"result": "Problem Correct!"}
