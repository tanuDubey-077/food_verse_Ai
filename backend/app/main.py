import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.core.config import settings
from app.database.session import Base, engine
from app.api.v1 import api_router

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=f"{settings.PROJECT_SUBTITLE} — Unified Multimodal AI Platform",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
allowed_origins = settings.ALLOWED_ORIGINS
if isinstance(allowed_origins, str):
    allowed_origins = [origin.strip() for origin in allowed_origins.split(",") if origin.strip()]
else:
    allowed_origins = [origin.strip() for origin in allowed_origins if origin.strip()]

allowed_origins = [origin.rstrip("/") for origin in allowed_origins if origin]

render_frontend_origin = "https://foodverseai-1.onrender.com"
if render_frontend_origin not in allowed_origins:
    allowed_origins.append(render_frontend_origin)

# Keep localhost development origins usable while allowing the deployed frontend origin in production.
dev_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
for origin in dev_origins:
    if origin not in allowed_origins:
        allowed_origins.append(origin)

cors_origins = list(dict.fromkeys(allowed_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists and mount for private local media serving
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/api/v1/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Mount production frontend build if available
frontend_dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
frontend_dist_assets = os.path.join(frontend_dist_dir, "assets")
frontend_dist_index = os.path.join(frontend_dist_dir, "index.html")

if os.path.exists(frontend_dist_assets):
    app.mount("/assets", StaticFiles(directory=frontend_dist_assets), name="frontend_assets")

# Include versioned API router
app.include_router(api_router)


@app.get("/", tags=["Root"])
def root():
    # If production static build exists, serve it
    if os.path.exists(frontend_dist_index):
        return FileResponse(frontend_dist_index)

    return {
        "project": settings.PROJECT_NAME,
        "subtitle": settings.PROJECT_SUBTITLE,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "documentation": "/docs",
        "api_v1": "/api/v1",
        "status": "online"
    }
