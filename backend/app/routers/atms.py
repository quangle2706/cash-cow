from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.enums import ATMStatus
from app.models.atm import ATM
from app.schemas.atm import ATMCreate, ATMRead

# Every request comes under /atms and has to do with atms
router = APIRouter(prefix="/atms", tags=["atms"])

# This decorator says this goes to "/atms" with nothing else and returns a list of ATMRead objects
@router.get("", response_model=list[ATMRead])
async def list_atms(
    max_cash_level: Decimal | None = Query(
        # This is a query param, used for filtering all of our results
        default = None, # This makes it optional
        ge=0, # greater than or equal ...
        le=100,
        description="Only return atms strictly below this cash level percentage"
    ),
    db: AsyncSession=Depends(get_db)):
    # We need to be able to interact with the DB, so we need our session object to execute those statement
    # We are DEPENDENT on the session object
    # TODO add in optional query parameter for filtering based on power level (Business Question #1)
    
    # Create our statement for the DB
    statement = select(ATM)
    # statement = select(ATM).where(
    #     ATM.status != ATMStatus.OFFLINE,
    #     ATM.status != ATMStatus.MAINTENANCE
    # )

    # Filter results when a cash threshold is provided.
    if max_cash_level is not None:
        statement = statement.where(ATM.cash_level >= max_cash_level)
    statement = statement.order_by(ATM.id)

    result = await db.execute(statement)

    return list(result.scalars().all())

# Get a specific robot by its id
# GET /robots/{robot_id} -> robot_id is known as a PATH PARAMETER
@router.get("/{atm_id}", response_model=ATMRead)
async def get_atm(atm_id: int, db: AsyncSession=Depends(get_db)):
    atm = await db.get(ATM, atm_id)

    # TODO Code defensively
    if atm is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ATM {atm_id} not found"
        )

    return atm

# Let's create a Robot
# POST requests are used for creating new resources or altering state
@router.post("", response_model=ATMRead, status_code=status.HTTP_201_CREATED)
async def create_robot(payload: ATMCreate, db: AsyncSession = Depends(get_db)):
    # We receive the payload as a RobotCreate object
    # We need it as a Robot object to save with the ORM
    atm = ATM(**payload.model_dump())
    # Dumps the model into the Robot constructor
    db.add(atm)
    await db.commit()
    await db.refresh(atm)
    return atm