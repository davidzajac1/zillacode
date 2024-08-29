.PHONY: help

help:
	$(info ${HELP_MESSAGE})
	@exit 0

up:
	docker-compose -f docker-compose.dev.yaml up

lint:
	pre-commit install & pre-commit run --all-files

add:
	( cd frontend && yarn add ${package} )

up-backend:
	docker-compose -f docker-compose.dev.yaml up -d backend spark scala-spark db-lambda

serve-frontend:
	( cd frontend && yarn install && yarn test )

down:
	docker-compose -f docker-compose.dev.yaml down

rebuild:
	docker-compose -f docker-compose.dev.yaml up -d --no-deps --build ${container}

test-frontend:
	( cd frontend && yarn cypress run )

test-backend:
	docker exec zillacode-backend-1 python -m pytest

push-images:
	@echo "Building and pushing backend to Docker Hub"
	docker build --platform linux/arm64 -t davidzajac1/zillacode-backend:arm64 .
	docker push davidzajac1/zillacode-backend:arm64
	docker build --platform linux/amd64 -t davidzajac1/zillacode-backend:amd64 .
	docker push davidzajac1/zillacode-backend:amd64
	docker manifest create davidzajac1/zillacode-backend:latest \
		--amend davidzajac1/zillacode-backend:amd64 \
		--amend davidzajac1/zillacode-backend:arm64
	docker manifest push davidzajac1/zillacode-backend:latest
	@echo "Building and pushing backend to Docker Hub"
	docker build --platform linux/arm64 -t davidzajac1/zillacode-db-service:arm64 .
	docker push davidzajac1/zillacode-db-service:arm64
	docker build --platform linux/amd64 -t davidzajac1/zillacode-db-service:amd64 .
	docker push davidzajac1/zillacode-db-service:amd64
	docker manifest create davidzajac1/zillacode-db-service:latest \
		--amend davidzajac1/zillacode-db-service:amd64 \
		--amend davidzajac1/zillacode-db-service:arm64
	docker manifest push davidzajac1/zillacode-db-service:latest
	@echo "Building and pushing backend to Docker Hub"
	docker build --platform linux/arm64 -t davidzajac1/zillacode-frontend:arm64 .
	docker push davidzajac1/zillacode-frontend:arm64
	docker build --platform linux/amd64 -t davidzajac1/zillacode-frontend:amd64 .
	docker push davidzajac1/zillacode-frontend:amd64
	docker manifest create davidzajac1/zillacode-frontend:latest \
		--amend davidzajac1/zillacode-frontend:amd64 \
		--amend davidzajac1/zillacode-frontend:arm64
	docker manifest push davidzajac1/zillacode-frontend:latest
	@echo "Building and pushing backend to Docker Hub"
	docker build --platform linux/arm64 -t davidzajac1/zillacode-scala-spark:arm64 .
	docker push davidzajac1/zillacode-scala-spark:arm64
	docker build --platform linux/amd64 -t davidzajac1/zillacode-scala-spark:amd64 .
	docker push davidzajac1/zillacode-scala-spark:amd64
	docker manifest create davidzajac1/zillacode-scala-spark:latest \
		--amend davidzajac1/zillacode-scala-spark:amd64 \
		--amend davidzajac1/zillacode-scala-spark:arm64
	docker manifest push davidzajac1/zillacode-scala-spark:latest
	@echo "Building and pushing backend to Docker Hub"
	docker build --platform linux/arm64 -t davidzajac1/zillacode-spark:arm64 .
	docker push davidzajac1/zillacode-spark:arm64
	docker build --platform linux/amd64 -t davidzajac1/zillacode-spark:amd64 .
	docker push davidzajac1/zillacode-spark:amd64
	docker manifest create davidzajac1/zillacode-spark:latest \
		--amend davidzajac1/zillacode-spark:amd64 \
		--amend davidzajac1/zillacode-spark:arm64
	docker manifest push davidzajac1/zillacode-spark:latest


define HELP_MESSAGE
Usage: $ make [TARGETS]

TARGETS
	help                    	Shows this help message
	up                  		Runs docker-compose up to spin up all containers and runs Python file to create tables
	lint                    	Runs all the linters using Pre-Commit
	add                     	Runs yarn add to install a package in frontend, requires a package variable ex. make add package=eslint
	up-backend              	Runs docker-compose up just on the backend, spark, scala-spark and database containers and runs Python file to create tables
	serve-frontend          	Runs yarn test to serve the local version of the frontend on localhost:5173
	down                    	Runs docker-compose down to spin down the application
	rebuild                 	Rebuilds a specific container (backend, frontend, spark, database), requires a container variable ex. make rebuild container=backend
	test-frontend           	Spins up Cypress UI to run frontend tests
	test-backend            	Runs PyTests on backend within the backend container
	push-images             	Pushes the images to the Docker Hub (needs Auth only used by admins)

endef
