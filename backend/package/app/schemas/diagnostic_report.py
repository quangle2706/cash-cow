from datetime import datetime
from pydantic import BaseModel, ConfigDict

class DiagnosticReportRead(BaseModel):
    id: int
    file_url: str
    notes: str
    timestamp: datetime
    service_call_id: int

    model_config = ConfigDict(from_attributes=True)