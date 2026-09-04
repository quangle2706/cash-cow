import uuid
from urllib.parse import quote

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    UploadFile,
    HTTPException,
)
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.diagnostic_report import DiagnosticReport
from app.models.service_call import ServiceCall
from app.schemas.diagnostic_report import DiagnosticReportRead
from app.services.s3_service import upload_file_to_s3

from app.dependencies import get_db, require_role
from app.models.user import User, UserRole
from app.config import settings


router = APIRouter(
    prefix="/diagnostic-reports",
    tags=["Diagnostic Reports"]
)

#list all diagnostic reports
@router.get("/", response_model=list[DiagnosticReportRead])
async def list_diagnostic_reports(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.OPERATIONS_ADMIN, UserRole.FIELD_TECHNICIAN, UserRole.AUDITOR))
) -> list[DiagnosticReportRead]:
    result = await db.execute(
        select(DiagnosticReport)
    )
    diagnostic_reports = result.scalars().all()
    return diagnostic_reports


@router.post(
    "/",
    response_model=DiagnosticReportRead
)
async def upload_diagnostic_report(
    service_call_id: int = Form(...),
    file: UploadFile = File(...),
    note: str | None = Form(None),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.OPERATIONS_ADMIN, UserRole.FIELD_TECHNICIAN))
) -> DiagnosticReportRead:
    service_call = await db.get(ServiceCall, service_call_id)
    if service_call is None:
        raise HTTPException(
            status_code=404,
            detail=f"Service call {service_call_id} not found",
        )

    # Generate a unique S3 key for the uploaded file
    s3_key = f"diagnostic_reports/{uuid.uuid4()}_{file.filename}"

    # Upload the file to S3
    try:
        upload_file_to_s3(file.file, s3_key)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload file to S3: {str(e)}"
        )

    # Create a new DiagnosticReport record in the database
    diagnostic_report = DiagnosticReport(
        service_call_id=service_call_id,
        file_url=(
            f"https://{settings.s3_bucket_name}.s3.{settings.aws_region}.amazonaws.com/"
            f"{quote(s3_key, safe='/')}"
        ),
        notes=note or ""
    )
    db.add(diagnostic_report)
    await db.commit()
    await db.refresh(diagnostic_report)

    return diagnostic_report

# https://cashcow-diagnostics-ql.s3.us-east-1.amazonaws.com/diagnostic_reports/9bf5aa0f-2549-4eaa-8c6e-978690d07f73_rx100_New.txt