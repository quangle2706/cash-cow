"""
FastAPI application entry point

This file will control the entry point for our API.
We build the FastAPI object here and register our various 
different routers to it for routing of our requests.

-> Update - Added CORS configuration to connect with the frontend
"""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import atms, service_calls, auth, branches, technicians

FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")

app = FastAPI(
    title="CashCow Command Center",
    description="Management API for Meridian Trust Bank System",
    version="0.1.0"
)

#CORS Configuration
app.add_middleware(
    CORSMiddleware,
    #The endpoint for our frontend, currently provided by the vite dev server
    allow_origins=[FRONTEND_ORIGIN], #Day9
    #This allows us to pass an Authorization header (JWT)
    allow_credentials=True,
    #This allows all methods and header through
    allow_methods=["*"],
    allow_headers=["*"]
)

# Auth routers
app.include_router(auth.router)

# Include our routers in our API
app.include_router(atms.router)

# Register new router
app.include_router(service_calls.router)

# Branch APIs
app.include_router(branches.router)

# Technician APIs
app.include_router(technicians.router)

# Sample health endpoint to validate the application is running correctly
@app.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}

#Endpoint to check the version number
@app.get("/version", tags=["health"])
async def version() -> dict[str, str]:
    return {"version": app.version}