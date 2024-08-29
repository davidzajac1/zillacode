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

endef
