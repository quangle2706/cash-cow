"""
Enumerated types shared across all domain models.
"""

from enum import Enum

class ATMStatus(str, Enum):
    #Operational | Low-Cash | Maintenance | Offline
    OPERATIONAL = "Operational"
    LOW_CASH = "Low-Cash"
    MAINTENANCE = "Maintenance"
    OFFLINE = "Offline"

class ServiceCallPriority(str, Enum):
    #Low | Medium | Critical
    LOW = "Low"
    MEDIUM = "Medium"
    CRITICAL = "Critical"

class ServiceCallStatus(str, Enum):
    #Pending | In-Progress | Completed | Failed
    PENDING = "Pending"
    IN_PROGRESS = "In-Progress"
    COMPLETED = "Completed"
    FAILED = "Failed"