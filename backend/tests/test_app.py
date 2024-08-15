import boto3


def test_get_problem(app, client):

    response = client.post("/get_problem", json={"problem": "1"})

    assert response.status_code == 200


def test_run_code(app, client):

    response = client.post(
        "/run_code",
        json={
            "problem": "1",
            "to_run": "from pyspark.sql import SparkSession\nfrom pyspark.sql import functions as F\nfrom pyspark.sql import Window as W\nimport pyspark\nimport datetime\nimport json\n\nspark = SparkSession.builder.appName('run-pyspark-code').getOrCreate()\n\ndef etl(df_customers, df_orders):\n\tdf = df_customers.join(df_orders, df_customers.id ==  df_orders.customerId, 'left')\n\n\tdf = df.filter(df.customerId.isNull())\n\n\treturn df.select(['name'])",
            "language": "pyspark",
        },
    )

    assert response.status_code == 200

    assert response.json["response"] == "Problem Correct!"
