FROM public.ecr.aws/lambda/python:3.9

RUN pip install pandas numpy tabulate

COPY lambda_function.py ${LAMBDA_TASK_ROOT}

CMD [ "lambda_function.lambda_handler" ]