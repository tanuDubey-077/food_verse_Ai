from typing import Dict
from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str
    providers: Dict[str, str]
    database: str


class ReadinessResponse(BaseModel):
    ready: bool
    storage_writable: bool
    database_ready: bool
    models_ready: bool
    details: Dict[str, str]
