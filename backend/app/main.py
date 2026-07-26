from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base
from app.api.endpoints import auth, profile, scheme, upload, eligibility

# Ensure database tables exist purely for fallback setup
# (Can be removed if strictly using Alembic migrations off-app)
def create_tables():
    Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc" # Swagger is enabled by default at /docs!
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    """
    On-startup execution logic.
    For local prototype consistency, this enforces missing SQL table creation.
    """
    create_tables()

@app.get("/")
def health_check():
    """
    Basic health check API root.
    """
    return {"status": "ok", "message": f"Welcome to {settings.PROJECT_NAME}"}

# Connect our API routers
app.include_router(auth.router, prefix=f"{settings.API_V1_PREFIX}/auth", tags=["Authentication"])
app.include_router(profile.router, prefix=f"{settings.API_V1_PREFIX}", tags=["Profile"])
app.include_router(scheme.router, prefix=f"{settings.API_V1_PREFIX}", tags=["Schemes"])
app.include_router(upload.router, prefix=f"{settings.API_V1_PREFIX}", tags=["Documents"])
app.include_router(eligibility.router, prefix=f"{settings.API_V1_PREFIX}", tags=["Eligibility"])
