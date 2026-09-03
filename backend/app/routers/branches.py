"""
Define the branch APIs
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status

from sqlalchemy import select, func, Float
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user, require_role
from app.models import Branch, ATM, ATMStatus, User, UserRole
from app.schemas.branch import BranchMaintenanceRead, BranchRead, BranchCreate

router = APIRouter(prefix="/branches", tags=["branches"])

@router.get("/maintenance-ratio", response_model=list[BranchMaintenanceRead])
async def get_branches_with_maintenance_ratio(
    threshold: float = Query(
        default=30,
        ge=0,
        le=100
    ),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.OPERATIONS_ADMIN, UserRole.FIELD_TECHNICIAN, UserRole.AUDITOR))
) -> list[BranchMaintenanceRead]:
    """To answer business #3 which branches have more than 30% of their ATMs currently flagged for maintenance"""
    #to make the statement shorter
    total_count = func.count(ATM.id)
    maintenance_count = func.count().filter(ATM.status == ATMStatus.MAINTENANCE)
    maintenance_ratio = maintenance_count.cast(Float) / total_count

    statement = (
        select(
            Branch.id.label("branch_id"),
            Branch.name.label("branch_name"),
            total_count.label("total_atms"),
            maintenance_count.label("total_maintenance_atms")
        )
        .join(ATM, ATM.branch_id == Branch.id)
        .group_by(Branch.id)
        .having(maintenance_ratio >= threshold / 100) #greater than or equal
        .order_by(Branch.id)
    )

    result = await db.execute(statement)
    rows = result.mappings().all()

    return [
        BranchMaintenanceRead(
            branch_id=row["branch_id"],
            branch_name=row["branch_name"],
            total_atms=row["total_atms"],
            total_maintenance_atms=row["total_maintenance_atms"],
            maintenance_ratio=(
                row["total_maintenance_atms"] / row["total_atms"]
            )
        ) for row in rows
    ]

#List all branches
@router.get("", response_model=list[BranchRead])
async def list_branches(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.OPERATIONS_ADMIN, UserRole.FIELD_TECHNICIAN, UserRole.AUDITOR))
) -> list[BranchRead]:
    statement = select(Branch).order_by(Branch.id)
    result = await db.execute(statement)
    branches = result.scalars().all()

    return branches

#Create a new branch
@router.post("", response_model=BranchRead, status_code=status.HTTP_201_CREATED)
async def create_branch(
    payload: BranchCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.OPERATIONS_ADMIN))
) -> BranchRead:
    branch = Branch(**payload.model_dump())
    db.add(branch)
    await db.commit()
    await db.refresh(branch)

    return branch