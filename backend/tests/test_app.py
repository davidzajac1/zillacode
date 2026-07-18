import boto3
from constants import problems, theory_problems


def test_get_problem(app, client):

    response = client.post("/get_problem", json={"problem": "1"})

    assert response.status_code == 200


def test_run_code(app, client):

    response = client.post(
        "/run_code",
        json={
            "problem": "1",
            "to_run": problems["1"]["language"]["pyspark"]["solution"],
            "language": "pyspark",
        },
    )

    assert response.status_code == 200

    assert response.json["response"] == "Problem Correct!"


def test_run_code_sql(app, client):

    response = client.post(
        "/run_code",
        json={
            "problem": "61",
            "to_run": problems["61"]["language"]["sql"]["solution"],
            "language": "sql",
        },
    )

    assert response.status_code == 200

    assert response.json["response"] == "Problem Correct!"


def test_get_theory_problems(app, client):

    response = client.post("/get_theory_problems", json={})

    assert response.status_code == 200

    listing = response.json["response"]

    assert len(listing) == len(theory_problems)

    assert {"id", "title", "type", "topic", "subtopic", "difficulty", "tags"} <= set(listing[0].keys())


def test_get_theory_problem(app, client):

    theory_id = next(iter(theory_problems))

    response = client.post("/get_theory_problem", json={"problem": theory_id})

    assert response.status_code == 200

    assert response.json["response"]["title"] == theory_problems[theory_id]["title"]
