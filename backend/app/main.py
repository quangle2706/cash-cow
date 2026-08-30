"""
Day 4 - FastAPI
"""

from fastapi import FastAPI

from app.routers import atms, service_calls, auth, branches

app = FastAPI(
    title="RoboPulse Fleet Command Center",
    description="Fleet Management API for Apex Robotics autonomous inspection rovers and aerial drones",
    version="0.1.0"
)

#Auth routers
app.include_router(auth.router)

# Include our routers in our API
app.include_router(atms.router)

# Register new router
app.include_router(service_calls.router)

# Branch APIs
app.include_router(branches.router)

# Sample health endpoint to validate the application is running correctly
@app.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}