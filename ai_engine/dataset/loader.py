"""
loader.py — Dataset Loader Module for Eligify

Provides functions to read and parse government scheme CSV datasets into structured Python dictionaries.
"""

import csv
import os
from typing import List, Dict, Any

REQUIRED_COLUMNS = [
    "scheme_id",
    "scheme_name",
    "ministry",
    "state",
    "min_age",
    "max_age",
    "gender",
    "category",
    "max_income",
    "occupation",
    "disability_required",
    "education",
    "benefits",
    "required_documents",
    "application_link",
    "description"
]

DEFAULT_CSV_PATH = os.path.join(os.path.dirname(__file__), "schemes.csv")


def parse_boolean(val: str) -> bool:
    """Parse string representations of boolean values."""
    if isinstance(val, bool):
        return val
    s = str(val).strip().lower()
    return s in ("true", "1", "yes", "t", "y")


def parse_number(val: str, default: float = 0.0, target_type=int) -> Any:
    """Safely parse numeric strings into int or float."""
    try:
        s = str(val).strip()
        if not s:
            return default
        num = float(s)
        return target_type(num)
    except (ValueError, TypeError):
        return default


def load_schemes_csv(file_path: str = DEFAULT_CSV_PATH) -> List[Dict[str, Any]]:
    """
    Loads government scheme data from a CSV file.

    Args:
        file_path (str): Path to the CSV file. Defaults to 'schemes.csv' in the dataset directory.

    Returns:
        List[Dict[str, Any]]: List of parsed scheme dictionaries.

    Raises:
        FileNotFoundError: If the specified CSV file does not exist.
        ValueError: If mandatory columns are missing from the CSV header.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Scheme dataset file not found at: '{file_path}'")

    schemes: List[Dict[str, Any]] = []

    with open(file_path, mode="r", encoding="utf-8-sig") as csv_file:
        reader = csv.DictReader(csv_file)
        
        # Validate mandatory header columns
        if reader.fieldnames is None:
            raise ValueError(f"The CSV file '{file_path}' is empty or unreadable.")
            
        missing_columns = [col for col in REQUIRED_COLUMNS if col not in reader.fieldnames]
        if missing_columns:
            raise ValueError(
                f"Invalid CSV structure. Missing required columns: {', '.join(missing_columns)}"
            )

        for row_idx, row in enumerate(reader, start=2):
            # Clean and cast fields
            scheme = {
                "scheme_id": str(row.get("scheme_id", "")).strip(),
                "scheme_name": str(row.get("scheme_name", "")).strip(),
                "ministry": str(row.get("ministry", "")).strip(),
                "state": str(row.get("state", "All")).strip(),
                "min_age": parse_number(row.get("min_age", 0), default=0, target_type=int),
                "max_age": parse_number(row.get("max_age", 99), default=99, target_type=int),
                "gender": str(row.get("gender", "All")).strip(),
                "category": str(row.get("category", "All")).strip(),
                "max_income": parse_number(row.get("max_income", 0), default=0.0, target_type=float),
                "occupation": str(row.get("occupation", "All")).strip(),
                "disability_required": parse_boolean(row.get("disability_required", "False")),
                "education": str(row.get("education", "All")).strip(),
                "benefits": str(row.get("benefits", "")).strip(),
                "required_documents": [
                    doc.strip() for doc in str(row.get("required_documents", "")).split(";") if doc.strip()
                ],
                "application_link": str(row.get("application_link", "")).strip(),
                "description": str(row.get("description", "")).strip(),
            }
            schemes.append(scheme)

    return schemes


if __name__ == "__main__":
    try:
        loaded_data = load_schemes_csv()
        print(f"Successfully loaded {len(loaded_data)} schemes from CSV.")
        if loaded_data:
            print("Sample Scheme:", loaded_data[0]["scheme_name"])
    except Exception as e:
        print(f"Error loading scheme dataset: {e}")
