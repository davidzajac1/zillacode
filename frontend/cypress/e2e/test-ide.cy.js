describe("Test IDE works", () => {
  it("All languages should run", () => {
    cy.visit("http://localhost:5173");
    cy.contains("Zillacode");

    cy.visit("http://localhost:5173/ide");

    cy.contains("Streaming Platform");

    cy.contains("span", "pass").clear();

    cy.get(".cm-line").type(
      "from pyspark.sql import SparkSession\nfrom pyspark.sql import functions as F\nfrom pyspark.sql import Window as W\nimport pyspark\nimport datetime\nimport json\n\nspark = SparkSession.builder.appName('run-pyspark-code').getOrCreate()\n\ndef etl(input_df):\n    return input_df",
    );

    cy.contains("button", "Run Code").click();

    cy.contains("INCORRECT");

    cy.contains("span", "return").clear();

    cy.get(".cm-line").type(
      'from pyspark.sql import SparkSession\nfrom pyspark.sql import functions as F\nfrom pyspark.sql import Window as W\nimport pyspark\nimport datetime\nimport json\n\nspark = SparkSession.builder.appName(\'run-pyspark-code\').getOrCreate()\n\ndef etl(input_df):\n    current_year = datetime.datetime.now().year\n    filtered_df = input_df.where((F.col("view_count") > 1000000) & (F.col("release_year") >= current_year - 5))\n    return filtered_df',
    );

    cy.contains("button", "Run Code").click();

    cy.contains("Problem Correct!");

    cy.contains("button", "Language").click();

    cy.contains("div", "PySpark").click();

    cy.contains("li", "Scala Spark").click();

    cy.contains("button", "Ok").click();

    cy.contains("span", "}").clear();

    cy.get(".cm-line").type(
      'import org.apache.spark.sql.SparkSession\nimport org.apache.spark.sql.DataFrame\nimport org.apache.spark.sql.functions._\nimport org.apache.spark.sql.expressions.Window\nimport org.apache.spark\nimport java.time._\n\nval spark = SparkSession.builder().appName("run-spark-code").getOrCreate()\n\nimport spark.implicits._\n\ndef etl(input_df: DataFrame): DataFrame = {\n  val currentYear = Year.now().getValue\n  val filtered_df = input_df.filter($"view_count" > 1000000 && $"release_year" >= currentYear - 5)\n  filtered_df\n',
    );

    cy.contains("button", "Run Code").click();

    cy.wait(15000);

    cy.contains("Problem Correct!");

    cy.contains("button", "Language").click();

    cy.contains("div", "Scala Spark").click();

    cy.contains("li", "Pandas").click();

    cy.contains("button", "Ok").click();

    cy.contains("span", "pass").clear();

    cy.get(".cm-line").type(
      "import pandas as pd\nimport numpy as np\nimport datetime\nimport json\nimport math\nimport re\n\ndef etl(input_df):\n    current_year = datetime.datetime.now().year\n    filtered_df = input_df[(input_df['view_count'] > 1000000) & (input_df['release_year'] >= current_year - 5)]\n    return filtered_df",
    );

    cy.contains("button", "Run Code").click();

    cy.contains("Problem Correct!");

    cy.contains("button", " Next ").click();

    cy.contains("CRM SAAS Company");

    cy.contains("span", "pass").clear();

    cy.get(".cm-line").type(
      "from pyspark.sql import SparkSession\nfrom pyspark.sql import functions as F\nfrom pyspark.sql import Window as W\nimport pyspark\nimport datetime\nimport json\n\nspark = SparkSession.builder.appName('run-pyspark-code').getOrCreate()\n\ndef etl(customers, orders, products):\n    return customers",
    );

    cy.contains("button", "Run Code").click();

    cy.contains("INCORRECT");

    cy.contains("button", " Next ").click();

    cy.contains("Property Management Company");

    cy.contains("button", " Next ").click();

    cy.contains("Property Management Company");

    cy.contains("span", "pass").clear();

    cy.get(".cm-line").type(
      "from pyspark.sql import SparkSession\nfrom pyspark.sql import functions as F\nfrom pyspark.sql import Window as W\nimport pyspark\nimport datetime\nimport json\n\nspark = SparkSession.builder.appName('run-pyspark-code').getOrCreate()\n\ndef etl(properties_df, landlords_df):\n    return properties_df",
    );

    cy.contains("button", "Run Code").click();

    cy.contains("INCORRECT");
  });
});
