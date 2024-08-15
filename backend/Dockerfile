FROM python:3.9-slim

RUN pip install pipenv

ENV PROJECT_DIR /app

COPY . /${PROJECT_DIR}

WORKDIR ${PROJECT_DIR}

RUN pipenv install --system --deploy --dev

EXPOSE 5000

ENTRYPOINT ["python", "app.py"]
