# OCR & Document Verification Engine — Eligify AI Engine

> **Module Location:** `ai_engine/ocr/`  
> **Status:** Active / Milestone 6 Completed  

The **OCR & Document Verification Engine** provides automated text extraction and credential validation for Indian government identity and income documents (Aadhaar Cards, Income Certificates, Caste Certificates, Disability Certificates). It preprocesses uploaded document scans, executes Optical Character Recognition (OCR), extracts key domain fields via Regular Expressions, and cross-verifies credentials against citizen profile claims.

---

## 🏗️ OCR Engine Pipeline Architecture

```text
[ Uploaded Document Image / PDF ]
               │
               ▼
┌─────────────────────────────┐
│ 1. Preprocessing            │ ◄── preprocessor.py (Grayscale, CLAHE, Noise Reduction, Deskew)
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ 2. Text Extraction (OCR)    │ ◄── extractor.py (EasyOCR / PyTesseract Engine)
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ 3. Pattern Field Parsing    │ ◄── parser.py (Regex parsing for Name, DOB, Aadhaar, Income, etc.)
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ 4. Profile Verification     │ ◄── verify_document_against_profile() vs UserProfile
└──────────────┬──────────────┘
               │
               ▼
[ VerificationResult & Masked Credentials ]
```

---

## 📁 Module Files

```text
ai_engine/ocr/
├── models.py          # Pydantic schemas (ExtractedField, OCRResult, VerificationResult)
├── preprocessor.py    # OpenCV & Pillow image enhancement pipeline
├── extractor.py       # EasyOCR text extraction with PyTesseract fallback
├── parser.py          # Regex field parsers & profile verification engine
└── README.md          # Module documentation & developer guide
```

---

## 📋 Data Models (`models.py`)

### 1. `ExtractedField`
Represents an individual field parsed from document text.
- `field_name`: Field key (e.g. `aadhaar_number`, `dob`, `gender`, `annual_income`).
- `field_value`: Cleaned value (e.g. `XXXX-XXXX-1234`, `15/08/1998`, `Female`).
- `confidence`: Extraction confidence score (0.0 to 1.0).
- `raw_text`: Original uncleaned text snippet.

### 2. `OCRResult`
Full payload output from document text extraction and parsing.
- `document_type`: Document classification (`Aadhaar Card`, `Income Certificate`, etc.).
- `raw_text`: Unparsed text output from OCR.
- `extracted_fields`: Map of field names to `ExtractedField` objects.
- `processing_time_ms`: Processing latency in milliseconds.

### 3. `VerificationResult`
Audit output comparing extracted credentials against `UserProfile` claims.
- `is_verified`: `True` if no contradictory credentials found.
- `match_score`: Ratio of matched fields over total verified fields (0.0 to 1.0).
- `matched_fields`: List of verified profile attributes.
- `mismatched_fields`: List of conflicting attributes.

---

## 📄 Supported Documents & Field Patterns

| Document Type | Target Parsed Fields | Privacy Protection |
| :--- | :--- | :--- |
| **Aadhaar Card** | Aadhaar No, Name, DOB/Age, Gender, State | **Masked** (`XXXX-XXXX-1234`) |
| **Income Certificate** | Name, Annual Income (INR), State, Issue Date | Verified against max income threshold |
| **Caste Certificate** | Name, Social Category (SC/ST/OBC/General), State | Verified against category claim |
| **Disability Certificate**| Disability Status (True/False), Percentage (40%+) | Verified against disability claim |

---

## 🚀 Python Usage Examples

### 1. Preprocessing and Text Extraction

```python
from ai_engine.ocr.preprocessor import preprocess_image
from ai_engine.ocr.extractor import extract_text

image_path = "path/to/aadhaar_scan.jpg"

# 1. Preprocess Image (CLAHE, Deskew, Resize)
enhanced_img = preprocess_image(image_path)

# 2. Extract Text via EasyOCR
raw_text, confidence, elapsed_ms, details = extract_text(enhanced_img)
print(f"Extracted Text ({confidence * 100}% confidence in {elapsed_ms}ms):\n{raw_text}")
```

### 2. Full OCR Parsing & User Profile Verification

```python
from ai_engine.rules.models import UserProfile
from ai_engine.ocr.parser import parse_ocr_text, verify_document_against_profile

raw_ocr_text = """
GOVERNMENT OF INDIA
Aadhaar No: 9876 5432 1098
Gender: Female
State: Tamil Nadu
Category: OBC
Annual Income: Rs. 180000
"""

# Parse OCR Text
ocr_result = parse_ocr_text(raw_ocr_text, document_type="Aadhaar Card")

# User Profile to Verify
user = UserProfile(
    age=26,
    gender="Female",
    category="OBC",
    annual_income=180000.0,
    state="Tamil Nadu",
    occupation="Student",
    disability=False,
    education="Graduate"
)

# Run Cross-Verification
verification = verify_document_against_profile(ocr_result, user)

print(f"Verification Result: {verification.is_verified}")
print(f"Match Score: {verification.match_score * 100}%")
print(f"Matched Fields: {verification.matched_fields}")
```
