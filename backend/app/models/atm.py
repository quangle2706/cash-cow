"""
ATM (id, serial_number, model, status (Operational | Low-Cash | Maintenance | Offline), 
cash_level, branch_id)
"""

from __future__ import annotations
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, ForeignKey, Integer, Numeric, String
from sqlalchemy import Enum as SqlEum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base
from .enums import ATMStatus

if TYPE_CHECKING:
    from .branch import Branch
    from .service_call import ServiceCall


class ATM(Base):
    __tablename__ = "atms"

    #there is a table level constraint where the cash_level column is ALWAYS betweet 0 and 100
    __table_args__ = (
        CheckConstraint("cash_level BETWEEN 0 AND 100",
                        name="cash_level_range"), #need to have a comma 
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    serial_number: Mapped[str] = mapped_column(String(50), unique=True)
    model: Mapped[str] = mapped_column(String(100))
    #status uses our enum
    status: Mapped[ATMStatus] = mapped_column(
        SqlEum(
            ATMStatus,
            name="atm_status",
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
        ),
        default=ATMStatus.OPERATIONAL,
    )
    cash_level: Mapped[Decimal] = mapped_column(Numeric(5,2))
    branch_id: Mapped[int] = mapped_column(Integer, ForeignKey("branches.id"))

    #create relationship
    branch: Mapped["Branch"] = relationship(back_populates="atms")
    service_calls: Mapped[list["ServiceCall"]] = relationship(back_populates="atm")

    #cash level threshold
    LOW_CASH_THRESHOLD: int = 20

    def is_low_cash(self, threshold: int | None = None) -> bool:
        limit = threshold if threshold is not None else ATM.LOW_CASH_THRESHOLD
        return self.cash_level < limit

    #a method to check if an atm's status is set to maintenance
    def needs_maintenance(self) -> bool:
        return self.status == ATMStatus.MAINTENANCE

    #tostring
    def __repr__(self):
        return (f"ATM(id={self.id}, serial_number={self.serial_number!r}, "
                f"model={self.model!r}, status={self.status!r}, "
                f"cash_level={self.cash_level}, branch_id={self.branch_id})")
    