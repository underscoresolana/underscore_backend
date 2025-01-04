from fastapi import Request, HTTPException

api_key_header = APIKeyHeader(name="X-API-KEY")
from fastapi.security import APIKeyHeader

async def authenticate_request(request: Request):
    api_key = await api_key_header(request)
