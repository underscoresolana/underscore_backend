.PHONY: run test lint migrate

init:
	python -m pip install -r requirements.txt
	pre-commit install

run-api:
	uvicorn src.api.main:app --reload --port 8000

test:
	pytest -v --cov=src --cov-report=html

lint:
	flake8 src tests
	mypy src
	black --check src tests

migrate:
	python scripts/deployment/migrate_db.py

docker-build:
	docker-compose build --parallel

deploy-prod:
	terraform -chdir=deployments/terraform apply -var-file=prod.tfvars
