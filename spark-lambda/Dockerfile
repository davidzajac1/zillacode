FROM public.ecr.aws/lambda/python:3.8

RUN yum -y install java-1.8.0-openjdk wget curl

RUN pip install pyspark pandas tabulate

RUN export JAVA_HOME="$(dirname $(dirname $(readlink -f $(which java))))"
ENV PATH=${PATH}:${JAVA_HOME}/bin
ENV SPARK_HOME="/var/lang/lib/python3.8/site-packages/pyspark"
ENV PATH=$PATH:$SPARK_HOME/bin
ENV PYTHONPATH=$SPARK_HOME/python:$SPARK_HOME/python/lib/py4j-0.10.9-src.zip:$PYTHONPATH
ENV PATH=$SPARK_HOME/python:$PATH

RUN mkdir $SPARK_HOME/conf

RUN echo "SPARK_LOCAL_IP=127.0.0.1" > $SPARK_HOME/conf/spark-env.sh

RUN chmod 777 $SPARK_HOME/conf/spark-env.sh

ARG HADOOP_VERSION=3.2.2
ARG AWS_SDK_VERSION=1.11.887
ARG HADOOP_JAR=https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-aws/${HADOOP_VERSION}/hadoop-aws-${HADOOP_VERSION}.jar
ARG AWS_SDK_JAR=https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-bundle/${AWS_SDK_VERSION}/aws-java-sdk-bundle-${AWS_SDK_VERSION}.jar

ADD $HADOOP_JAR  ${SPARK_HOME}/jars/
ADD $AWS_SDK_JAR ${SPARK_HOME}/jars/

COPY spark-class $SPARK_HOME/bin/spark-class

RUN chmod 777 $SPARK_HOME/bin/spark-class

COPY spark-defaults.conf $SPARK_HOME/conf/spark-defaults.conf
COPY lambda_function.py ${LAMBDA_TASK_ROOT}

CMD [ "lambda_function.lambda_handler" ]