"""
Define Technician APIs
"""

#TODO - maybe change the API endpoint name
# ... currently only naming to answer business version

from fastapi import APIRouter, Depends, Query, HTTPException, status

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.technician import ActiveTechnicianCountRead, ActiveTechnicianRead
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

@router.get("/active-service-calls-list", response_model=list[ActiveTechnicianRead])
async def get_active_technician_list(
    supervisor_id: int | None = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.OPERATIONS_ADMIN, UserRole.FIELD_TECHNICIAN, UserRole.AUDITOR)),
) -> list[ActiveTechnicianRead]:
    statement = (
        select(
            Branch.supervisor_id.label("supervisor_id"),
            Technician.id.label("technician_id"),
            Technician.name.label("technician_name"),
            Branch.name.label("branch_name"),
            func.count(ServiceCall.id).label("active_calls"),
            func.count(ServiceCall.id).filter(ServiceCall.status == ServiceCallStatus.PENDING)
                .label("pending_calls"),
            func.count(ServiceCall.id).filter(ServiceCall.status == ServiceCallStatus.IN_PROGRESS)
                .label("in_progress_calls")
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
    statement = statement.group_by(
        Branch.supervisor_id,
        Technician.id,
        Technician.name,
        Branch.name,
    )

    result = await db.execute(statement)
    rows = result.mappings().all()

    return [ 
        ActiveTechnicianRead(
            supervisor_id=row["supervisor_id"],
            technician_id=row["technician_id"],
            technician_name=row["technician_name"],
            branch_name=row["branch_name"],
            active_calls=row["active_calls"],
            pending_calls=row["pending_calls"],
            in_progress_calls=row["in_progress_calls"]
        ) for row in rows
    ]