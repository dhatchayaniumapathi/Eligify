"""
parser.py — Document OCR Text Parser & Profile Cross-Validator for Eligify

Extracts structured domain fields (Name, Age, DOB, Gender, Aadhaar Number, Annual Income,
State, Social Category, Disability Status) from raw OCR text using Regex pattern matchers,
and provides cross-verification against UserProfile claims.
"""

import re
from typing import Dict, Any, Optional, List, Tuple
from ai_engine.ocr.models import ExtractedField, OCRResult, VerificationResult
from ai_engine.rules.models import UserProfile

# Regex patterns for key document credentials
PATTERNS = {
    "aadhaar_number": [
        r"\b[2-9]\d{3}\s?\d{4}\s?\d{4}\b",
        r"Aadhaar\s*(?:No|Number|#)?\s*:?\s*([2-9]\d{3}\s?\d{4}\s?\d{4})",
    ],
    "dob": [
        r"(?:DOB|Date of Birth|Birth Date)\s*:?\s*(\d{2}[/\.-]\d{2}[/\.-]\d{4})",
        r"\b(\d{2}[/\.-]\d{2}[/\.-]\d{4})\b",
        r"(?:Year of Birth|YOB)\s*:?\s*(\d{4})",
    ],
    "gender": [
        r"\b(Female|Male|Transgender)\b",
        r"(?:Gender|Sex)\s*:?\s*(Female|Male|Transgender|F|M)",
    ],
    "annual_income": [
        r"(?:Annual Income|Family Income|Income)\s*:?\s*(?:Rs\.?|INR|₹)?\s*([\d,]+)",
        r"(?:Rs\.?|INR|₹)\s*([\d,]+)\s*(?:per annum|annual|p\.a\.)?",
    ],
    "name": [
        r"(?:Name|Full Name)\s*:?\s*([A-Za-z\s\.]{3,30})",
        r"(?:To|Shri|Smt|Kumari)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)",
    ],
    "category": [
        r"\b(SC|ST|OBC|General|Minority)\b",
        r"(?:Category|Community)\s*:?\s*(SC|ST|OBC|General|Minority)",
    ],
    "disability": [
        r"(?:Disability|Handicapped)\s*:?\s*(Yes|No|True|False|\d{1,3}%)",
        r"\b(40%|\d{2}%\s*Disability)\b",
    ],
    "state": [
        r"\b(Tamil Nadu|Madhya Pradesh|Karnataka|Maharashtra|West Bengal|Telangana|Uttar Pradesh|Delhi|Kerala|Gujarat|Punjab|Rajasthan|Andhra Pradesh|Bihar)\b",
    ]
}


def mask_aadhaar(aadhaar_str: str) -> str:
    """Masks first 8 digits of an Aadhaar number for privacy compliance (e.g. XXXX-XXXX-1234)."""
    digits = re.sub(r"\D", "", aadhaar_str)
    if len(digits) == 12:
        return f"XXXX-XXXX-{digits[-4:]}"
    return aadhaar_str


def parse_aadhaar_number(text: str) -> Optional[ExtractedField]:
    """Extracts Aadhaar number from text."""
    for pattern in PATTERNS["aadhaar_number"]:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            raw_val = match.group(1) if match.groups() else match.group(0)
            clean_digits = re.sub(r"\D", "", raw_val)
            if len(clean_digits) == 12:
                masked = mask_aadhaar(clean_digits)
                return ExtractedField(
                    field_name="aadhaar_number",
                    field_value=masked,
                    confidence=0.95,
                    raw_text=raw_val
                )
    return None


def parse_dob_and_age(text: str) -> Tuple[Optional[ExtractedField], Optional[ExtractedField]]:
    """Extracts Date of Birth and calculates derived age."""
    dob_field = None
    age_field = None

    for pattern in PATTERNS["dob"]:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            raw_val = match.group(1) if match.groups() else match.group(0)
            dob_field = ExtractedField(field_name="dob", field_value=raw_val, confidence=0.9, raw_text=raw_val)
            
            # Extract year for age calculation
            year_match = re.search(r"\b(19\d{2}|20[0-2]\d)\b", raw_val)
            if year_match:
                birth_year = int(year_match.group(1))
                current_year = 2026
                derived_age = current_year - birth_year
                if 0 <= derived_age <= 120:
                    age_field = ExtractedField(field_name="age", field_value=str(derived_age), confidence=0.85, raw_text=str(birth_year))
            break

    return dob_field, age_field


def parse_gender(text: str) -> Optional[ExtractedField]:
    """Extracts gender from text."""
    for pattern in PATTERNS["gender"]:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            val = match.group(1).capitalize()
            if val in ("F", "Female"):
                val = "Female"
            elif val in ("M", "Male"):
                val = "Male"
            return ExtractedField(field_name="gender", field_value=val, confidence=0.9, raw_text=match.group(0))
    return None


def parse_annual_income(text: str) -> Optional[ExtractedField]:
    """Extracts annual family income in INR from text."""
    for pattern in PATTERNS["annual_income"]:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            raw_num = match.group(1).replace(",", "").strip()
            try:
                income_val = float(raw_num)
                return ExtractedField(
                    field_name="annual_income",
                    field_value=str(income_val),
                    confidence=0.88,
                    raw_text=match.group(0)
                )
            except ValueError:
                continue
    return None


def parse_state(text: str) -> Optional[ExtractedField]:
    """Extracts state name from text."""
    for pattern in PATTERNS["state"]:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            val = match.group(1).strip()
            return ExtractedField(field_name="state", field_value=val, confidence=0.92, raw_text=val)
    return None


def parse_category(text: str) -> Optional[ExtractedField]:
    """Extracts social category (SC/ST/OBC/General/Minority) from text."""
    for pattern in PATTERNS["category"]:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            val = match.group(1).upper()
            return ExtractedField(field_name="category", field_value=val, confidence=0.9, raw_text=match.group(0))
    return None


def parse_disability(text: str) -> Optional[ExtractedField]:
    """Extracts disability status from text."""
    for pattern in PATTERNS["disability"]:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            raw = match.group(0)
            is_dis = "yes" in raw.lower() or "true" in raw.lower() or "%" in raw
            return ExtractedField(
                field_name="disability",
                field_value="True" if is_dis else "False",
                confidence=0.85,
                raw_text=raw
            )
    return None


def parse_ocr_text(
    raw_text: str,
    document_type: str = "General Document",
    confidence_score: float = 0.85,
    processing_time_ms: float = 0.0
) -> OCRResult:
    """
    Parses full unparsed OCR text into a structured OCRResult model.

    Args:
        raw_text: Raw OCR extracted text.
        document_type: Document identifier (e.g. Aadhaar Card, Income Certificate).
        confidence_score: Raw OCR engine confidence.
        processing_time_ms: Duration of OCR processing in ms.

    Returns:
        OCRResult: Parsed model with extracted_fields.
    """
    fields: Dict[str, ExtractedField] = {}

    aadhaar = parse_aadhaar_number(raw_text)
    if aadhaar:
        fields["aadhaar_number"] = aadhaar

    dob, age = parse_dob_and_age(raw_text)
    if dob:
        fields["dob"] = dob
    if age:
        fields["age"] = age

    gender = parse_gender(raw_text)
    if gender:
        fields["gender"] = gender

    income = parse_annual_income(raw_text)
    if income:
        fields["annual_income"] = income

    state = parse_state(raw_text)
    if state:
        fields["state"] = state

    cat = parse_category(raw_text)
    if cat:
        fields["category"] = cat

    disability = parse_disability(raw_text)
    if disability:
        fields["disability"] = disability

    return OCRResult(
        document_type=document_type,
        raw_text=raw_text,
        confidence_score=confidence_score,
        extracted_fields=fields,
        processing_time_ms=processing_time_ms,
    )


def verify_document_against_profile(
    ocr_result: OCRResult,
    user_profile: UserProfile
) -> VerificationResult:
    """
    Cross-verifies OCR extracted credentials against user profile claims.

    Args:
        ocr_result: Parsed OCRResult model.
        user_profile: UserProfile model.

    Returns:
        VerificationResult: Detailed audit report of matches and discrepancies.
    """
    matched: List[str] = []
    mismatched: List[str] = []
    details: Dict[str, Any] = {}

    fields = ocr_result.extracted_fields

    # 1. Verify Gender
    if "gender" in fields and fields["gender"].field_value:
        doc_gen = fields["gender"].field_value.lower()
        usr_gen = user_profile.gender.lower()
        if doc_gen == usr_gen:
            matched.append("gender")
            details["gender"] = {"status": "MATCHED", "doc": doc_gen, "profile": usr_gen}
        else:
            mismatched.append("gender")
            details["gender"] = {"status": "MISMATCHED", "doc": doc_gen, "profile": usr_gen}

    # 2. Verify State
    if "state" in fields and fields["state"].field_value:
        doc_st = fields["state"].field_value.lower()
        usr_st = user_profile.state.lower()
        if doc_st == usr_st or usr_st in ("all", "any"):
            matched.append("state")
            details["state"] = {"status": "MATCHED", "doc": doc_st, "profile": usr_st}
        else:
            mismatched.append("state")
            details["state"] = {"status": "MISMATCHED", "doc": doc_st, "profile": usr_st}

    # 3. Verify Income (Income Certificate threshold)
    if "annual_income" in fields and fields["annual_income"].field_value:
        try:
            doc_inc = float(fields["annual_income"].field_value)
            usr_inc = user_profile.annual_income
            # Allow up to 10% variance for tax rounding
            if abs(doc_inc - usr_inc) <= max(5000.0, 0.1 * usr_inc):
                matched.append("annual_income")
                details["annual_income"] = {"status": "MATCHED", "doc": doc_inc, "profile": usr_inc}
            else:
                mismatched.append("annual_income")
                details["annual_income"] = {"status": "MISMATCHED", "doc": doc_inc, "profile": usr_inc}
        except ValueError:
            pass

    # 4. Verify Category
    if "category" in fields and fields["category"].field_value:
        doc_cat = fields["category"].field_value.lower()
        usr_cat = user_profile.category.lower()
        if doc_cat == usr_cat:
            matched.append("category")
            details["category"] = {"status": "MATCHED", "doc": doc_cat, "profile": usr_cat}
        else:
            mismatched.append("category")
            details["category"] = {"status": "MISMATCHED", "doc": doc_cat, "profile": usr_cat}

    total_checked = len(matched) + len(mismatched)
    if total_checked == 0:
        match_score = 1.0  # No contradictory fields found
        is_verified = True
    else:
        match_score = round(len(matched) / total_checked, 2)
        is_verified = len(mismatched) == 0

    return VerificationResult(
        document_type=ocr_result.document_type,
        is_verified=is_verified,
        match_score=match_score,
        matched_fields=matched,
        mismatched_fields=mismatched,
        details=details,
    )


if __name__ == "__main__":
    print("--- Eligify OCR Parser & Verification Test ---")

    # Sample extracted raw text snippet from an Aadhaar & Income document
    sample_raw_ocr_text = """
    GOVERNMENT OF INDIA
    Aadhaar No: 3456 7890 1234
    Name: Ananya Sharma
    DOB: 15/08/1998
    Gender: Female
    State: Madhya Pradesh
    Category: General
    Annual Income: Rs. 150000 per annum
    """

    # Parse OCR raw text
    ocr_result = parse_ocr_text(sample_raw_ocr_text, document_type="Aadhaar Card")

    print(f"Document Type: {ocr_result.document_type}")
    print("Extracted Fields:")
    for fname, fval in ocr_result.extracted_fields.items():
        print(f"  - {fname}: {fval.field_value} (Confidence: {fval.confidence})")

    # Verify against UserProfile
    user = UserProfile(
        age=28,
        gender="Female",
        category="General",
        annual_income=150000.0,
        state="Madhya Pradesh",
        occupation="Unemployed",
        disability=False,
        education="Graduate"
    )

    verif = verify_document_against_profile(ocr_result, user)
    print("\n--- Profile Verification Audit ---")
    print(f"Verified: {verif.is_verified}")
    print(f"Match Score: {verif.match_score}")
    print(f"Matched Fields: {verif.matched_fields}")
    print(f"Mismatched Fields: {verif.mismatched_fields}")

