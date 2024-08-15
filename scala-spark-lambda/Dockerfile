FROM mozilla/sbt as builder
COPY . /lambda/src/
WORKDIR /lambda/src/
RUN sbt assembly

FROM public.ecr.aws/lambda/java:11
COPY --from=builder /lambda/src/target/function.jar ${LAMBDA_TASK_ROOT}/lib/

CMD ["sparklambda.LambdaHandler::handleRequest"]
