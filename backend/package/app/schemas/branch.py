"""
Define and validate the shape of branch data 
"""

from pydantic import BaseModel, ConfigDict, Field

#TODO maybe add Field for validation

class BranchMaintenanceRead(BaseModel):
    branch_id: int
    branch_name: str
    total_atms: int 
    total_maintenance_atms: int
    maintenance_ratio: float = Field(ge=0, le=1)