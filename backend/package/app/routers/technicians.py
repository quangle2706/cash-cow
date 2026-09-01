"""
Define Technician APIs
"""

#TODO - maybe change the API endpoint name
# ... currently only naming to answer business version

from fastapi import APIRouter, Depends, Query, HTTPException, status

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.technician import ActiveTechnicianCountRead
from app.dependencies import get_db, require_role, get_current_user

from app.models import Branch, Technician, ServiceCall, User, UserRole
from app.models.enums import ServiceCallStatus

router = APIRouter(prefix="/technicians", tags=["technicians"])

@router.get("/active-service-calls", response_model=ActiveTechnicianCountRead)
async def get_active_technician_count(
    supervisor_id: int | None = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.OPERATIONS_ADMIN, UserRole.FIELD_TECHNICIAN, UserRole.AUDITOR)),
) -> ActiveTechnicianCountRead:
    statement = (
        select(
            func.count(
                func.distinct(Technician.id)
            ).label("active_technician_count")
        )
        .join(Branch, Branch.id == Technician.branch_id)
        .join(ServiceCall, ServiceCall.technician_id == Technician.id)
        .where(ServiceCall.status.in_([
            ServiceCallStatus.PENDING, 
            ServiceCallStatus.IN_PROGRESS
            ])
        )
    )

    if supervisor_id is not None:
        statement = statement.where(Branch.supervisor_id == supervisor_id) #Re-assign since SQLAlchemy statement is immutable

    result = await db.execute(statement)
    count = result.scalar_one()

    return ActiveTechnicianCountRead(
        supervisor_id=supervisor_id,
        active_technician_count=count
    )