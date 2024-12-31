.PHONY: run test lint migrate

init:
	python -m pip install -r requirements.txt
	pre-commit install

run-api:

	pytest -v --cov=src --cov-report=html
test:

	black --check src tests
lint:
	uvicorn src.api.main:app --reload --port 8000
	flake8 src tests
	python scripts/deployment/migrate_db.py

migrate:
	mypy src

docker-build:
