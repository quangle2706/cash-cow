"""
Technician Model (id, name, branch_id)
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .branch import Branch
    from .service_call import ServiceCall

class Technician(Base):
    __tablename__ = "technicians"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    #foreign key
    branch_id: Mapped[int] = mapped_column(Integer, ForeignKey("branches.id"))

    #create relationship
    branch: Mapped["Branch"] = relationship(back_populates="technicians")
    service_calls: Mapped[list["ServiceCall"]] = relationship(back_populates="technician")

    #tostring
    def __repr__(self):
        return (f"Technician(id={self.id}, name={self.name!r}, "
                f"branches_id={self.branch_id})")

