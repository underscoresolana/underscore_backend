.PHONY: run test lint migrate

init:
	python -m pip install -r requirements.txt

	black --check src tests
run-api:
	pre-commit install
	uvicorn src.api.main:app --reload --port 8000
test:
	pytest -v --cov=src --cov-report=html

lint:

	flake8 src tests
	python scripts/deployment/migrate_db.py

migrate:
	mypy src
