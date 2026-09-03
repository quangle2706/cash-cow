"""
Provide ServiceCall APIs including
- /service-calls/discrepancies
- /service-calls/{service_call_id}/status
- /service-calls -> get list
"""

from fastapi import APIRouter, Depends, Query, HTTPException, status

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.service_call import DiscrepancyRead, ServiceCallRead, ServiceCallStatusUpdate, ServiceCallRatioRead
from app.dependencies import get_db, require_role

from app.models import ServiceCall, ATM, Technician, User, UserRole
from app.models.enums import ServiceCallStatus, ServiceCallPriority

router = APIRouter(prefix="/service-calls", tags=["service-calls"])

@router.get("/discrepancies", response_model=list[DiscrepancyRead])
async def list_colocation_discrepancies(
    #to set filter by priority, status
    priority: ServiceCallPriority | None = Query(
        default=None,
        description="Only return discrepancies for service calls of this priority"
    ),
    status: ServiceCallStatus | None = Query(
        default=None,
        description="Only return discrepancies for service calls of this status"
    ),
    db: AsyncSession=Depends(get_db),
    #add role to use this API
    _: User = Depends(require_role(UserRole.OPERATIONS_ADMIN, UserRole.FIELD_TECHNICIAN))
):
    """ Answer business question #2 """
    statement = (
        select(
            ServiceCall.id.label("service_call_id"),
            ServiceCall.title,
            ATM.branch_id.label("atm_branch_id"),
            Technician.branch_id.label("technician_branch_id")
        )
        .join(ATM, ATM.id == ServiceCall.atm_id)
        .join(Technician, Technician.id == ServiceCall.technician_id)
        .where(ATM.branch_id != Technician.branch_id)
    )

    #use the query parameter
    if priority is not None:
        statement = statement.where(ServiceCall.priority == priority)

    if status is not None:
        statement = statement.where(ServiceCall.status == status)

    statement = statement.order_by(ServiceCall.id) # follow the order to statement in SQL -> order_by is the last
    result = await db.execute(statement)
    return [dict(row) for row in result.mappings().all()]


@router.patch("/{service_call_id}/status", response_model=ServiceCallRead)
async def update_service_call_status(
    service_call_id: int, 
    payload: ServiceCallStatusUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.OPERATIONS_ADMIN, UserRole.FIELD_TECHNICIAN))
) -> ServiceCall:
    service_call = await db.get(ServiceCall, service_call_id)
    if service_call is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service call '{service_call_id}' not found"
        )

    if payload.status == ServiceCallStatus.COMPLETED:
        service_call.mark_completed()
    elif payload.status == ServiceCallStatus.FAILED:
        service_call.mark_failed()
    else:
        service_call.status = payload.status

    await db.commit()
    await db.refresh(service_call)
    return service_call

#get service call completion/failure ratio by ATM models
@router.get("/completion-failure-ratio", response_model=list[ServiceCallRatioRead])
async def get_completion_failure_ratio(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.OPERATIONS_ADMIN, UserRole.FIELD_TECHNICIAN, UserRole.AUDITOR))
) -> list[ServiceCallRatioRead]:
    statement = (
        select(
            ATM.model.label("atm_model"),
            func.count().label("total_count"),
            func.count().filter(ServiceCall.status == ServiceCallStatus.COMPLETED)
                .label("completed_count"),
            func.count().filter(ServiceCall.status == ServiceCallStatus.FAILED)
                .label("failed_count")
        )
        .join(ServiceCall, ServiceCall.atm_id == ATM.id)
        .group_by(ATM.model)
    )

    result = await db.execute(statement)
    rows = result.mappings().all()

    #response list servicecall with ratio info
    return [
        ServiceCallRatioRead(
            atm_model=row["atm_model"],
            total_count=row["total_count"],
            completed_count=row["completed_count"],
            failed_count=row["failed_count"],
            completion_failure_ratio=(
                row["completed_count"] / row["failed_count"] if row["failed_count"] > 0 else None
            )
        ) for row in rows
    ]

