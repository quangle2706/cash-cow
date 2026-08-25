"""
Branch (id, name, location_region, capacity, supervisor_id)
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .technician import Technician
    from .atm import ATM

class Branch(Base):
    __tablename__ = "branches"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    location_region: Mapped[str] = mapped_column(String(50))
    capacity: Mapped[int] = mapped_column(Integer)
    supervisor_id: Mapped[int] = mapped_column(Integer)

    #creating the relationships with other tables
    atms: Mapped[list["ATM"]] = relationship(back_populates="branch")
    technicians: Mapped[list["Technician"]] = relationship(back_populates="branch")

    #tostring
    def __repr__(self):
        return (f"Branch(id={self.id}, name={self.name!r}, "
                f"region={self.location_region!r})")