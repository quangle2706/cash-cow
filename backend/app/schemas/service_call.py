"""
Answer Business #2 - How many ATMs are assigned to field technicians 
who are NOT co-located at the same physical branch?

Create the schema for API response -> co-located discrepancies 
"""

from pydantic import BaseModel, ConfigDict
from app.models import ServiceCallStatus, ServiceCallPriority

# Response model
class DiscrepancyRead(BaseModel):
    service_call_id: int
    title: str
    atm_branch_id: int
    technician_branch_id: int

    model_config = ConfigDict(from_attributes=True)

# Request validation model
class ServiceCallStatusUpdate(BaseModel):
    status: ServiceCallStatus

# Response model 
class ServiceCallRead(BaseModel):
    id: int
    title: str
    priority: ServiceCallPriority
    status: ServiceCallStatus
    atm_id: int
    technician_id: int

    model_config = ConfigDict(from_attributes=True)