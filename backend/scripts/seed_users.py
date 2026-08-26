"""
CashCow Command Center
Seeds one demo user per RBAC role, bypassing POST /auth/register entirely
(which requires the operations_admin role to call it)

Run from the /backend directory with .venv active:
    python -m scripts.seed_users

Note: before run seed -> always check if models/new_models.py has created
-> also run create_tables scripts to create all sqlalchemy models tables
"""

import asyncio

from app.database import AsyncSessionLocal
from app.models import User, UserRole
from app.security import hash_password

async def seed_users() -> None:
    async with AsyncSessionLocal() as session:
        session.add_all([
            User(username="admin", hashed_password=hash_password("AdminPass123!"), role=UserRole.OPERATIONS_ADMIN),
            User(username="technician", hashed_password=hash_password("TechnicianPass123!"), role=UserRole.FIELD_TECHNICIAN),
            User(username="auditor", hashed_password=hash_password("AuditorPass123!"), role=UserRole.AUDITOR),
        ])
        await session.commit()

if __name__ == "__main__":
    asyncio.run(seed_users())