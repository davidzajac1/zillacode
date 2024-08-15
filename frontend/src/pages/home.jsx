import { useNavigate } from "react-router-dom";
import React from "react";
import { Avatar, Card, Typography, Button } from "@material-tailwind/react";
import { PageTitle, Footer } from "@/widgets/layout";
import { FeatureCard } from "@/widgets/cards";
import { featuresData, skillsData } from "@/data";
import { CheckIcon } from "@heroicons/react/24/solid";

export function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="relative flex h-[60vh] content-center items-center justify-center pb-32 pt-16">
        <div className="absolute top-0 h-full w-full bg-[url('/img/blue_laptop.jpg')] bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/75 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography variant="h1" color="white">
                Zillacode
              </Typography>
              <Typography variant="lead" color="white" className="opacity-80">
                The ultimate resource to become a modern Data Engineer.
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <section className="-mt-32 bg-gray-50 px-4 pb-20 pt-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map(({ color, title, icon, description }) => (
              <FeatureCard
                key={title}
                color={color}
                title={title}
                icon={React.createElement(icon, {
                  className: "w-5 h-5 text-white",
                })}
                description={description}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center">
            <div className="mx-auto mt-20 w-full px-4 md:w-1/4">
              <Typography
                variant="h3"
                className="mb-3 font-bold"
                color="blue-gray"
              >
                What is Zillacode
              </Typography>
              <Typography className="mb-8 font-normal text-blue-gray-500">
                Data Engineering specific coding interview questions in the
                languages and frameworks that employers expect you to know.
                <br />
                <br />
                Click the button below to solve a problem.
              </Typography>
              <Button onClick={() => navigate("/ide/1")}>
                Solve A Problem
              </Button>
            </div>
            <div className="mx-auto flex w-full transform justify-center px-4 pt-20 md:w-8/12 lg:mt-0">
              <Card className="overflow-hidden rounded-lg shadow-lg shadow-gray-500/10">
                <img
                  alt="Code Workspace"
                  src="/img/ide.jpg"
                  className="h-full w-full transform object-cover"
                />
              </Card>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 pb-20 pt-20">
        <div className="container mx-auto">
          <PageTitle heading="Supported Frameworks">
            We are always keeping up to date with the industry to help you
            practice the Big Data frameworks and lanuages employeers are asking
            for. See our supported frameworks below!
          </PageTitle>
          <div className="mt-24 grid grid-cols-1 gap-12 gap-x-24 md:grid-cols-2 xl:grid-cols-4">
            <Card color="transparent" shadow={false} className="text-center">
              <Avatar
                src="/img/pyspark_logo.jpg"
                alt="PySpark"
                size="xxl"
                className="h-full w-full shadow-lg shadow-gray-500/25"
              />
              <Typography variant="h5" color="blue-gray" className="mb-1 mt-6">
                PySpark
              </Typography>
              <Typography className="font-normal text-blue-gray-500">
                The Python API for the Apache Spark. The fastest growing Big
                Data framework.
              </Typography>
            </Card>
            <Card color="transparent" shadow={false} className="text-center">
              <Avatar
                src="/img/spark_logo.jpg"
                alt="Spark"
                size="xxl"
                className="h-full w-full shadow-lg shadow-gray-500/25"
              />
              <Typography variant="h5" color="blue-gray" className="mb-1 mt-6">
                Spark
              </Typography>
              <Typography className="font-normal text-blue-gray-500">
                Apache Spark in its original language, Scala, a newer
                alternative to Java.
              </Typography>
            </Card>
            <Card color="transparent" shadow={false} className="text-center">
              <Avatar
                src="/img/pandas_logo.jpg"
                alt="Python Pandas"
                size="xxl"
                className="h-full w-full shadow-lg shadow-gray-500/25"
              />
              <Typography variant="h5" color="blue-gray" className="mb-1 mt-6">
                Python Pandas
              </Typography>
              <Typography className="font-normal text-blue-gray-500">
                The classic Data Engineering Python Library, but still used and
                asked for today.
              </Typography>
            </Card>
            <Card color="transparent" shadow={false} className="text-center">
              <Avatar
                src="/img/dbt_snowflake_logo.jpg"
                alt="Snowflake + DBT"
                size="xxl"
                className="h-full w-full shadow-lg shadow-gray-500/25"
              />
              <Typography variant="h5" color="blue-gray" className="mb-1 mt-6">
                Snowflake + DBT
              </Typography>
              <Typography className="font-normal text-blue-gray-500">
                The fastest growing Data Warehouse and Data Processing
                framework.
              </Typography>
            </Card>
          </div>
        </div>
      </section>
      <section className="bg-blue-gray-50/50 px-4 pb-20 pt-20">
        <div className="container mx-auto">
          <PageTitle heading="Skills Tested">
            We test you on the skills and functions you'll see in interviews.
            <br />
            <br />
          </PageTitle>
          <div className="container">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:grid-cols-4">
              {skillsData.map(({ title }) => (
                <FeatureCard
                  key={title}
                  color="green"
                  title={title}
                  icon={React.createElement(CheckIcon, {
                    className: "w-5 h-5 text-white",
                  })}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 pb-20 pt-20">
        <PageTitle heading="Solutions with Detailed Explanations">
          All Zillacode problems come with a well formatted solution and
          explanation in each supported language.
        </PageTitle>
        <div className="flex flex-wrap items-center">
          <div className="mx-auto flex w-full transform justify-center px-4 pt-5 md:w-5/12 lg:mt-0">
            <Card className="overflow-hidden rounded-lg shadow-lg shadow-gray-500/10">
              <img
                alt="Coding Problem Solution"
                src="/img/solution.jpg"
                className="w-full transform object-cover"
              />
            </Card>
          </div>
          <div className="mx-auto flex w-full transform justify-center px-4 pt-5 md:w-7/12 lg:mt-0">
            <Card className="overflow-hidden rounded-lg shadow-lg shadow-gray-500/10">
              <img
                alt="Coding Problem Explanation"
                src="/img/explanation.jpg"
                className="w-full transform object-cover"
              />
            </Card>
          </div>
        </div>
      </section>
      <section className="bg-blue-gray-50/50 px-4 pb-20 pt-20">
        <PageTitle heading="Big O Notation and Optimization">
          All Zillacode problems have their Space and Time Complexity explained
          and how they might be optimized using Distributed Computing.
        </PageTitle>
        <div className="flex flex-wrap items-center">
          <div className="mx-auto flex w-full transform justify-center px-4 pt-5 md:w-7/12 lg:mt-0">
            <Card className="overflow-hidden rounded-lg shadow-lg shadow-gray-500/10">
              <img
                alt="Coding Problem Solution"
                src="/img/complexity.jpg"
                className="w-full transform object-cover"
              />
            </Card>
          </div>
          <div className="mx-auto flex w-full transform justify-center px-4 pt-5 md:w-5/12 lg:mt-0">
            <Card className="overflow-hidden rounded-lg shadow-lg shadow-gray-500/10">
              <img
                alt="Coding Problem Explanation"
                src="/img/optimization.jpg"
                className="w-full transform object-cover"
              />
            </Card>
          </div>
        </div>
      </section>
      <div className="">
        <Footer />
      </div>
    </>
  );
}

export default Home;
