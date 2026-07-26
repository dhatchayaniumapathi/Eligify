# Scheme Dataset Module — Eligify AI Engine

> **Module Location:** `ai_engine/dataset/`  
> **Status:** Active / Milestone 2 Completed  

The **Scheme Dataset Module** manages the core repository of Indian Government schemes (Central & State level). It provides standardized CSV data storage along with automated dataset loading, parsing, and data integrity validation.

---

## 📋 CSV Schema Specification (`schemes.csv`)

The scheme dataset is structured with 16 core attributes designed for precise eligibility matching:

| Column Name | Data Type | Mandatory | Description | Example / Values |
| :--- | :--- | :--- | :--- | :--- |
| `scheme_id` | String | **Yes** | Unique identifier key for the scheme | `SCH001`, `SCH011` |
| `scheme_name` | String | **Yes** | Official scheme title | `PM-KISAN`, `Gruha Lakshmi` |
| `ministry` | String | **Yes** | Administering Ministry / Department | `Ministry of Agriculture` |
| `state` | String | **Yes** | Target State (`All` for Central Schemes) | `All`, `Tamil Nadu`, `Karnataka` |
| `min_age` | Integer | No | Minimum age required (default: 0) | `18`, `21` |
| `max_age` | Integer | No | Maximum age allowed (default: 99) | `60`, `99` |
| `gender` | String | No | Target gender qualification | `All`, `Female`, `Male` |
| `category` | String | No | Target social category | `All`, `SC`, `ST`, `OBC`, `General` |
| `max_income` | Float | No | Maximum annual family income (0 = no cap) | `250000.0`, `0.0` |
| `occupation` | String | No | Eligible occupation group | `Farmer`, `Student`, `Unemployed`, `All` |
| `disability_required`| Boolean | No | Disability status required | `True`, `False` |
| `education` | String | No | Minimum education qualification | `All`, `10th Pass`, `Graduate` |
| `benefits` | Text | No | Description of financial/social benefits | `Rs. 6000 per year in 3 installments` |
| `required_documents` | String | No | Semicolon-separated document list | `Aadhaar Card; Land Record` |
| `application_link` | URL | No | Official application portal URL | `https://pmkisan.gov.in/` |
| `description` | Text | No | Summary of scheme goals & scope | `Central sector scheme for farmers...` |

---

## 📁 Module Files

```text
ai_engine/dataset/
├── schemes.csv       # Dataset populated with 20+ realistic Central & State schemes
├── loader.py         # CSV file reader, type parser, and header validator
├── validator.py      # Schema integrity, duplicate ID & numeric rule validator
└── README.md         # Module documentation & usage guide
```

---

## 🚀 Usage Guide

### 1. Loading the Dataset (`loader.py`)

```python
from ai_engine.dataset.loader import load_schemes_csv

# Load schemes from default path (ai_engine/dataset/schemes.csv)
schemes = load_schemes_csv()

print(f"Loaded {len(schemes)} schemes.")
first_scheme = schemes[0]
print(f"Scheme Name: {first_scheme['scheme_name']}")
print(f"Max Income Limit: ₹{first_scheme['max_income']}")
```

### 2. Validating the Dataset (`validator.py`)

#### Run via CLI:
```bash
python -m ai_engine.dataset.validator
```

#### Run Programmatically:
```python
from ai_engine.dataset.validator import validate_file

is_valid, errors = validate_file("ai_engine/dataset/schemes.csv")

if is_valid:
    print("Dataset passed all validation rules!")
else:
    print("Validation failed:")
    for err in errors:
        print(" -", err)
```

---

## ✅ Validation Checks Enforced

- **Header Completeness:** Ensures all 16 required columns are present in the CSV file.
- **Mandatory Non-Empty Fields:** `scheme_id`, `scheme_name`, `ministry`, `state` cannot be blank.
- **Unique Scheme ID:** Prevents duplicate `scheme_id` keys across entries.
- **Numeric Range Sanity:**
  - `0 <= min_age <= max_age <= 120`
  - `max_income >= 0`
