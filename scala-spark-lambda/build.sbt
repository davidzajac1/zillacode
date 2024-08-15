import Dependencies._

ThisBuild / scalaVersion     := "2.13.5"
ThisBuild / version          := "0.1.0"

lazy val root = (project in file("."))
  .settings(
    name := "scala-spark-lambda",
    libraryDependencies ++= Seq(
      lambdaRuntimeInterfaceClient,
      "org.apache.spark" %% "spark-sql" % "3.2.3",
      "org.apache.spark" %% "spark-core" % "3.2.3",
      "org.scala-lang" % "scala-compiler" % scalaVersion.value
    )
  ).settings(
    assembly / assemblyOutputPath := file("target/function.jar")
  )

assemblyMergeStrategy in assembly := {
 case PathList("META-INF", _*) => MergeStrategy.discard
 case _                        => MergeStrategy.first
}