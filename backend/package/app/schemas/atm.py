from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import ATMStatus

class ATMBase(BaseModel):
    serial_number: str = Field(min_length=1, max_length=50)
    model: str = Field(min_length=1, max_length=100)
    # Decimal values with bounds
    cash_level: Decimal = Field(ge=0, le=100)
    branch_id: int
    # ATM Status field that defaults to OPERATIONAL
    status: ATMStatus = ATMStatus.OPERATIONAL

# Two additional classes that build upon this stater class
class ATMCreate(ATMBase):
    """Shape of the Request Body for POST /atms"""

class ATMRead(ATMBase):
    """Shape of an ATM in any API Response"""

    id: int
 
    model_config = ConfigDict(from_attributes=True) # 