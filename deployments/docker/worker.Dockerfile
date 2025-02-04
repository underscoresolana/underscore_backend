FROM python:3.11-slim-bullseye

WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .

ENV PATH=/root/.local/bin:$PATH \
    CELERY_BROKER_URL=redis://redis:6379/0 \
    CELERY_RESULT_BACKEND=redis://redis:6379/1

CMD ["celery", "-A", "src.jobs.celery_config.app", "worker", "-P", "gevent", "-Q", "analysis,training"]
