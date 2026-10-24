from fastapi import APIRouter
from .health import router as health_router
from .food import router as food_router
from .freshness import router as freshness_router
from .hygiene import router as hygiene_router
from .cooking import router as cooking_router
from .meals import router as meals_router
from .history import router as history_router
from .settings import router as settings_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(health_router)
api_router.include_router(food_router)
api_router.include_router(freshness_router)
api_router.include_router(hygiene_router)
api_router.include_router(cooking_router)
api_router.include_router(meals_router)
api_router.include_router(history_router)
api_router.include_router(settings_router)

__all__ = ["api_router"]
