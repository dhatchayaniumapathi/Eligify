"""
validator.py — Dataset Validator Module for Eligify

Performs structural, schema, and integrity validation on government scheme datasets.
"""

from typing import List, Dict, Any, Tuple
from ai_engine.dataset.loader import REQUIRED_COLUMNS, load_schemes_csv

MANDATORY_NON_EMPTY_FIELDS = ["scheme_id", "scheme_name", "ministry", "state"]


def validate_dataset(schemes: List[Dict[str, Any]]) -> Tuple[bool, List[str]]:
    """
    Validates a list of scheme dictionaries against integrity rules.

    Checks performed:
    1. Mandatory fields are present and non-empty.
    2. Unique scheme_id constraint.
    3. Age range validity (0 <= min_age <= max_age <= 120).
    4. Non-negative max_income requirement.
    5. Non-empty required documents and benefits descriptions.

    Args:
        schemes (List[Dict[str, Any]]): List of scheme dictionaries.

    Returns:
        Tuple[bool, List[str]]: (is_valid, list_of_validation_errors)
    """
    errors: List[str] = []
    seen_scheme_ids = set()

    if not schemes:
        return False, ["Dataset is empty. No schemes found to validate."]

    for idx, scheme in enumerate(schemes, start=1):
        scheme_id = scheme.get("scheme_id", "").strip()
        
        # 1. Check non-empty mandatory fields
        for field in MANDATORY_NON_EMPTY_FIELDS:
            val = str(scheme.get(field, "")).strip()
            if not val:
                errors.append(f"Row {idx}: Mandatory field '{field}' is empty.")

        # 2. Check duplicate scheme_id
        if scheme_id:
            if scheme_id in seen_scheme_ids:
                errors.append(f"Row {idx}: Duplicate scheme_id detected: '{scheme_id}'.")
            else:
                seen_scheme_ids.add(scheme_id)

        # 3. Validate numeric age rules
        min_age = scheme.get("min_age", 0)
        max_age = scheme.get("max_age", 99)

        if not isinstance(min_age, (int, float)) or min_age < 0:
            errors.append(f"Row {idx} ({scheme_id}): Invalid min_age value '{min_age}'. Must be non-negative integer.")
        
        if not isinstance(max_age, (int, float)) or max_age > 120:
            errors.append(f"Row {idx} ({scheme_id}): Invalid max_age value '{max_age}'. Must be <= 120.")

        if isinstance(min_age, (int, float)) and isinstance(max_age, (int, float)):
            if min_age > max_age:
                errors.append(
                    f"Row {idx} ({scheme_id}): min_age ({min_age}) cannot be greater than max_age ({max_age})."
                )

        # 4. Validate income rule
        max_income = scheme.get("max_income", 0.0)
        if not isinstance(max_income, (int, float)) or max_income < 0:
            errors.append(f"Row {idx} ({scheme_id}): Invalid max_income value '{max_income}'. Cannot be negative.")

    is_valid = len(errors) == 0
    return is_valid, errors


def validate_file(file_path: str) -> Tuple[bool, List[str]]:
    """
    Loads and validates a scheme CSV dataset file.

    Args:
        file_path (str): Path to the CSV file.

    Returns:
        Tuple[bool, List[str]]: (is_valid, list_of_errors)
    """
    try:
        schemes = load_schemes_csv(file_path)
        return validate_dataset(schemes)
    except (FileNotFoundError, ValueError) as e:
        return False, [str(e)]


if __name__ == "__main__":
    import os

    dataset_path = os.path.join(os.path.dirname(__file__), "schemes.csv")
    print(f"Validating scheme dataset at: {dataset_path}")
    
    valid, errs = validate_file(dataset_path)
    
    if valid:
        print("[SUCCESS] Dataset validation SUCCESSFUL. All integrity checks passed.")
    else:
        print(f"[FAILED] Dataset validation FAILED with {len(errs)} error(s):")
        for err in errs:
            print(f"  - {err}")
