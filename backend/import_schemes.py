import csv
from pathlib import Path

from app.core.database import SessionLocal
from app.models.scheme import Scheme

# CSV location
CSV_PATH = Path(__file__).resolve().parent.parent / "ai_engine" / "dataset" / "schemes.csv"

db = SessionLocal()

added = 0
skipped = 0

with open(CSV_PATH, "r", encoding="utf-8") as file:
    reader = csv.DictReader(file)

    for row in reader:

        # Skip duplicate scheme names
        exists = (
            db.query(Scheme)
            .filter(Scheme.scheme_name == row["scheme_name"])
            .first()
        )

        if exists:
            skipped += 1
            continue

        scheme = Scheme(
            scheme_name=row["scheme_name"],
            description=row["description"],
            benefits=row["benefits"],
            required_documents=row["required_documents"],
        )

        db.add(scheme)
        added += 1

db.commit()
db.close()

print("=" * 50)
print(f"Imported : {added}")
print(f"Skipped  : {skipped}")
print("=" * 50)