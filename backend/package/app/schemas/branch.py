"""
Define and validate the shape of branch data 
"""

from pydantic import BaseModel, ConfigDict, Field

#TODO maybe add Field for validation
class BranchBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    location_region: str = Field(min_length=1, max_length=200)
    capacity: int = Field(ge=1, le=1000)
    supervisor_id: int

class BranchCreate(BranchBase):
    """Shape of the Request Body for POST /branches"""

class BranchRead(BranchBase):
    id: int

    model_config = ConfigDict(from_attributes=True) #This allows us to return SQLAlchemy objects directly from the DB and have them automatically converted to Pydantic models

class BranchMaintenanceRead(BaseModel):
    branch_id: int
    branch_name: str
    total_atms: int 
    total_maintenance_atms: int
    maintenance_ratio: float = Field(ge=0, le=1)