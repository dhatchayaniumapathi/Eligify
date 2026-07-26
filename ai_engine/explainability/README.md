# Explainability Engine — Eligify AI Engine

> **Module Location:** `ai_engine/explainability/`  
> **Status:** Active / Milestone 5 Completed  

The **Explainability Engine** transforms raw, machine-evaluated eligibility outputs into clear, human-understandable explanations. It presents citizens with transparent reasons for their qualification or disqualification, itemizes matched vs. failed rule criteria, provides confidence metrics, and formats details for Plain Text, Markdown, or JSON outputs.

---

## 🏗️ Explainability Workflow Architecture

```text
[ EligibilityResult + Scheme ]
               │
               ▼
┌─────────────────────────────┐
│ 1. Explanation Generation   │ ◄── generate_explanation() in explainer.py
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ 2. Schema Enrichment        │ ◄── populates SchemeExplanation model
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ 3. Multi-Format Output      │ ◄── formatter.py utilities
├──────────────┬──────────────┤
│  Plain Text  │   Markdown   │   JSON Response
└──────────────┴──────────────┴─────────────────
```

---

## 📁 Module Files

```text
ai_engine/explainability/
├── explainer.py    # Core explanation builder: generate_explanation()
├── formatter.py    # Multi-format representation utilities (Text, Markdown, JSON)
└── README.md       # Module documentation & developer guide
```

---

## 📋 Data Schema (`SchemeExplanation`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `scheme_id` | `str` | Unique scheme code |
| `scheme_name` | `str` | Official scheme title |
| `eligible` | `bool` | High-level verdict status (`True`/`False`) |
| `confidence` | `float` | Rule match confidence ratio (0.0 to 1.0) |
| `summary` | `str` | Human-readable explanation summary |
| `matched_conditions` | `List[str]` | Detailed list of passed condition checks |
| `failed_conditions` | `List[str]` | Detailed list of failed condition checks |
| `benefits` | `str` | Financial or social benefit summary |
| `required_documents` | `List[str]` | Verification document checklist |
| `application_link` | `str` | Official portal application link |

---

## 🚀 Usage Guide

### 1. Generating a Structured Explanation

```python
from ai_engine.rules.models import UserProfile, Scheme
from ai_engine.rules.evaluator import evaluate_eligibility
from ai_engine.explainability.explainer import generate_explanation

user = UserProfile(
    age=24,
    gender="Female",
    category="General",
    annual_income=150000.0,
    state="Madhya Pradesh",
    occupation="Unemployed",
    disability=False,
    education="Graduate"
)

scheme = Scheme(
    scheme_id="SCH012",
    scheme_name="Chief Minister Ladli Behna Yojana",
    ministry="Department of Women and Child Development",
    state="Madhya Pradesh",
    min_age=21,
    max_age=60,
    gender="Female",
    category="All",
    max_income=250000.0,
    occupation="All",
    disability_required=False,
    education="All",
    benefits="Monthly assistance of Rs. 1250",
    required_documents=["Aadhaar Card", "Samagra ID"],
    application_link="https://cmladlibehna.mp.gov.in/"
)

# 1. Run Rule Evaluation
eval_result = evaluate_eligibility(user, scheme)

# 2. Build Explanation
explanation = generate_explanation(eval_result, scheme)

print(explanation.summary)
```

### 2. Multi-Format Rendering (`formatter.py`)

```python
from ai_engine.explainability.formatter import (
    format_as_text,
    format_as_markdown,
    format_as_json,
)

# Render Plain Text (for CLI / Console)
plain_text_output = format_as_text(explanation)

# Render Markdown (for Frontend UI / Docs)
markdown_output = format_as_markdown(explanation)

# Render JSON (for REST API payloads)
json_output = format_as_json(explanation)
```
