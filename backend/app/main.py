"""
FastAPI application entry point

This file will control the entry point for our API.
We build the FastAPI object here and register our various 
different routers to it for routing of our requests.

-> Update - Added CORS configuration to connect with the frontend
"""

import os

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from fastapi.middleware.cors import CORSMiddleware

from app.routers import atms, service_calls, auth, branches, technicians, diagnostic_reports
from app.config import settings

FRONTEND_ORIGIN = settings.frontend_origin
#os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")

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

# Diagnostic Report APIs
app.include_router(diagnostic_reports.router)

# Sample health endpoint to validate the application is running correctly
@app.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}

#Endpoint to check the version number
@app.get("/version", tags=["health"])
async def version() -> dict[str, str]:
    return {"version": app.version}

#Day 10
##BEGIN EXCEPTIONS

#This exception handles when our database constraint (specifically, our battery_level not being between 0 and 100)
@app.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError) -> JSONResponse:
    return JSONResponse(
        status_code=409,
        content={"detail": "A database constraint was violated (e.g. a duplicate value)"},
    )

#this is a catch-all exception handler so that ANY unexpected failure (bugs or unknown conditions) returns a 
#constant JSON response
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error has occured."},
    )