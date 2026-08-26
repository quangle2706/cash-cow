"""
CashCow Command Center
Password hashing and JWT helper functions

SECRET-KEY: It follows the same env-var-with-fallback pattern that we saw on DATABASE_URL.
Note, we will not be committing a real secret key here if this were a real project 
being pushed to production (NOT SECURE)
"""

import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt


SECRET_KEY = os.environ.get("SECRET_KEY", "<replace-with-a-real-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

#takes a plain text password as an input, hashes it using bcrypt, and
#returns the hashed pw as a string
def hash_password(plain_password: str) -> str:
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")

#takes a hashed password and a plain text password as input,
#and check if the plain text password matches the hashed password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

#This function creates a JWT access token with the provided data 
#and an optional expiration time
def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode["exp"] = expire
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

#This function decodes a JWT access token and returns the payload as a dictionary
def decode_access_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])