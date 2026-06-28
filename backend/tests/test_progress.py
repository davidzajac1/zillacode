import json
import pytest


CLIENT_ID = "test-client-123"


def test_get_completions_empty(client, db):
    response = client.post("/get_completions", json={"client_id": CLIENT_ID})
    assert response.status_code == 200
    assert response.get_json()["response"] == []


def test_record_and_get_completion(client, db):
    import database
    database.record_completion(CLIENT_ID, "1", "pandas")

    response = client.post("/get_completions", json={"client_id": CLIENT_ID})
    data = response.get_json()["response"]
    assert len(data) == 1
    assert data[0]["problem_number"] == "1"
    assert data[0]["language"] == "pandas"


def test_record_completion_is_idempotent(client, db):
    import database
    database.record_completion(CLIENT_ID, "1", "pandas")
    database.record_completion(CLIENT_ID, "1", "pandas")

    response = client.post("/get_completions", json={"client_id": CLIENT_ID})
    assert len(response.get_json()["response"]) == 1


def test_get_flags_empty(client, db):
    response = client.post("/get_flags", json={"client_id": CLIENT_ID})
    assert response.status_code == 200
    assert response.get_json()["response"] == []


def test_toggle_flag_on(client, db):
    response = client.post("/toggle_flag", json={"client_id": CLIENT_ID, "problem": "2", "language": "pandas"})
    assert response.status_code == 200
    assert response.get_json()["response"] is True


def test_toggle_flag_off(client, db):
    client.post("/toggle_flag", json={"client_id": CLIENT_ID, "problem": "2", "language": "pandas"})
    response = client.post("/toggle_flag", json={"client_id": CLIENT_ID, "problem": "2", "language": "pandas"})
    assert response.get_json()["response"] is False


def test_is_flagged(client, db):
    client.post("/toggle_flag", json={"client_id": CLIENT_ID, "problem": "2", "language": "pandas"})

    response = client.post("/get_flag", json={"client_id": CLIENT_ID, "problem": "2", "language": "pandas"})
    assert response.get_json()["response"] is True


def test_no_client_id_returns_empty(client, db):
    response = client.post("/get_completions", json={"client_id": None})
    assert response.get_json()["response"] == []

    response = client.post("/get_flags", json={"client_id": None})
    assert response.get_json()["response"] == []
