"""
CashCow Command Center
Reconcile diagnostic_reports against what actually exists in s3. Two independent
sources of truck (the db claim, and the s3 reality) can drift; this script 
finds where they disagree

Run from /backend with .venv active, DATABASE_URL pointed at RDS
    python -m scripts.verify_diagnostics
"""

import asyncio
import boto3
from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models import DiagnosticReport

BUCKET_NAME = "cashcow-diagnostics-ql"
DIAGNOSTICS_PREFIX = "diagnostics/"

def extract_s3_key(file_url: str) -> str:
    """
    s3://bucket-name/diagnostics/rx1001-002.txt -> diagnostics/rx1001-002.txt

    Strips the scheme and bucket name, keeping only the actual object key aka the part 
    that has a match what list_objects_v2 returns
    """
    without_scheme = file_url.removeprefix("s3://")
    #the _ is the bucket name, the second _ is the slash after the bucket name, and the key is the rest
    _, _, key = without_scheme.partition("/")
    return key

def list_s3_keys(bucket_name: str, prefix: str) -> set[str]:
    s3_client = boto3.client("s3")

    """
    uses a paginator rather than a single list_objects_v2() call - 
    list_objects_v2 caps out at 1,000 keys per response; a paginator
    automatically follows the continuation token for anything beyond that,
    so this stays correct even as a bucket grows
    """
    paginator = s3_client.get_paginator("list_objects_v2") 

    #accumulate all the keys in a set so we can do operations later
    keys: set[str] = set()
    for page in paginator.paginate(Bucket=bucket_name, Prefix=prefix):
        for obj in page.get("Contents", []):
            keys.add(obj["Key"])
    return keys

#async function to fetch all diagnostic reports from the db
async def fetch_diagnostic_reports() -> list[DiagnosticReport]:
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(DiagnosticReport))
        return list(result.scalars().all())

#a function to compare the s3 key against the database rows and print the results
async def main() -> None:
    s3_keys = list_s3_keys(BUCKET_NAME, DIAGNOSTICS_PREFIX)
    reports = await fetch_diagnostic_reports()

    healthy: list[DiagnosticReport] = []
    broken: list[DiagnosticReport] = []
    referenced_keys: set[str] = set()

    for report in reports:
        key = extract_s3_key(report.file_url)
        referenced_keys.add(key)
        if key in s3_keys:
            healthy.append(report)
        else:
            broken.append(report)

    orphaned_keys = s3_keys - referenced_keys

    print("== Healthy (database row + matching s3 file) ==")
    if not healthy:
        print(" None Found ")
    for report in healthy:
        print(f"DiagnosticReport {report.id}: {report.file_url}")

    print("== Broken (database row, no matching file) ==")
    if not broken:
        print(" None found ")
    for report in broken:
        print(f"DiagnosticReport {report.id}: {report.file_url}")

    #Bonus section, per the research prompts - not strictly required
    print("== Orphaned (file in s3, but no matching database row) ==")
    if not orphaned_keys:
        print(" None found ")
    for key in orphaned_keys:
        print(f"s3://{BUCKET_NAME}/{key}")

if __name__ == "__main__":
    asyncio.run(main())