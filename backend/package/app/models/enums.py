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

#Operations Admin: Full CRUD permissions across branches, ATMs, service calls, and user accounts.
#Field Technician: Can view assigned ATMs, trigger service call status changes, and attach diagnostic reports.
#Auditor (Read-Only): Can view analytics dashboards, inspect data grids, and search system logs without write permissions.
class UserRole(str, Enum):
    OPERATIONS_ADMIN = "Operations Admin"
    FIELD_TECHNICIAN = "Field Technician"
    AUDITOR = "Auditor"