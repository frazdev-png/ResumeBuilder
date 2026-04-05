"""
Main application entry point.

This file initializes the FastAPI application, configures middleware,
sets up database connections, and includes all API routes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import get_settings
from app.database import connect_db, close_db, check_db_health
from app.routes import resume_routes, auth_routes, ai_routes
from app.models import HealthResponse


# Lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handle application lifespan events.
    
    - Startup: Connect to MongoDB
    - Shutdown: Close database connection
    
    This replaces the deprecated @app.on_event() decorators.
    """
    # Startup
    print("🚀 Starting up...")
    await connect_db()
    yield
    # Shutdown
    print("🛑 Shutting down...")
    await close_db()


# Create FastAPI application instance
app = FastAPI(
    title="AI Resume Builder API",
    description="Backend API for AI-powered resume builder application",
    version="1.0.0",
    lifespan=lifespan,
)


# Configure CORS (Cross-Origin Resource Sharing)
# This allows the frontend to make requests to the backend
settings = get_settings()

# Parse comma-separated origins or use default
origins = ["*"]
if settings.frontend_url and settings.frontend_url != "*":
    origins = [url.strip() for url in settings.frontend_url.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Include API routes
app.include_router(resume_routes.router)
app.include_router(auth_routes.router)
app.include_router(ai_routes.router)


# Root endpoint - health check
@app.get("/", response_model=HealthResponse)
async def root():
    """
    API health check endpoint.
    
    Returns status of API and database connection.
    Useful for monitoring and deployment health checks.
    """
    db_health = await check_db_health()
    
    return HealthResponse(
        status="healthy" if db_health["status"] == "connected" else "unhealthy",
        database=db_health
    )


# Additional health endpoint for load balancers
@app.get("/health")
async def health_check():
    """Simple health check for load balancers."""
    db_health = await check_db_health()
    
    if db_health["status"] != "connected":
        return {
            "status": "unhealthy",
            "database": db_health
        }
    
    return {
        "status": "healthy",
        "database": db_health
    }
