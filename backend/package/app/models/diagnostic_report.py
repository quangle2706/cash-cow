"""
Diagnostic Report (id, file_url(S3), notes, timestamp)
"""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .service_call import ServiceCall

class DiagnosticReport(Base):
    __tablename__ = "diagnostic_reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    file_url: Mapped[str] = mapped_column(Text)
    notes: Mapped[str] = mapped_column(String(500))
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    service_call_id: Mapped[int] = mapped_column(Integer, ForeignKey("service_calls.id"))

    #create relationship
    service_call: Mapped["ServiceCall"] = relationship(back_populates="diagnostic_reports")

    #tostring
    def __repr__(self):
        return (f"DiagnosticReport(id={self.id}, file_url={self.file_url!r}, "
                f"notes={self.notes!r}, timestamp={self.timestamp!r})")