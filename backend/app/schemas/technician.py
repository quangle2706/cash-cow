"""
Define and validate the shape of technician data 

Business #5: 
How many technicians reporting to a specific Regional Operations Supervisor have
active service calls assigned to them?
"""

from pydantic import BaseModel, ConfigDict

class ActiveTechnicianCountRead(BaseModel):
    supervisor_id: int | None
    active_technician_count: int #number of technician have active service assigned to them to supervisor_id provided