"""
Service Call (id, title, priority: Low | Medium | Critical, 
status: Pending | In-Progress | Completed | Failed, atm_id, technician_id)
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base
from .enums import ServiceCallPriority, ServiceCallStatus

if TYPE_CHECKING:
    from .diagnostic_report import DiagnosticReport
    from .atm import ATM
    from .technician import Technician

class ServiceCall(Base):
    __tablename__ = "service_calls"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100))
    priority: Mapped[ServiceCallPriority] = mapped_column(
        SqlEnum(
            ServiceCallPriority,
            name="service_call_priority",
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
        ),
        default=ServiceCallPriority.LOW,
    )
    status: Mapped[ServiceCallStatus] = mapped_column(
        SqlEnum(
            ServiceCallStatus,
            name="service_call_status",
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
        ),
        default=ServiceCallStatus.PENDING,
    )
    atm_id: Mapped[int] = mapped_column(Integer, ForeignKey("atms.id"))
    technician_id: Mapped[int] = mapped_column(Integer, ForeignKey("technicians.id"))

    #create relationships
    atm: Mapped["ATM"] = relationship(back_populates="service_calls")
    technician: Mapped["Technician"] = relationship(back_populates="service_calls")
    diagnostic_reports: Mapped[list["DiagnosticReport"]] = relationship(back_populates="service_call")

    #update the status of a service call to completed
    def mark_completed(self) -> None:
        self.status = ServiceCallStatus.COMPLETED

    #update the status of a service call to failed
    def mark_failed(self) -> None:
        self.status = ServiceCallStatus.FAILED  

    #tostring
    def __repr__(self):
        return (f"ServiceCall(id={self.id}, title={self.title!r}, "
                f"priority={self.priority.value!r}, status={self.status.value!r})")