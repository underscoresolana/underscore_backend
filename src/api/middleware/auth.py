from fastapi import Request, HTTPException
from fastapi.security import APIKeyHeader
api_key_header = APIKeyHeader(name="X-API-KEY")


async def authenticate_request(request: Request):
    api_key = await api_key_header(request)
    """API key authentication middleware"""
    if api_key != request.app.state.settings.api_key:
        raise HTTPException(
