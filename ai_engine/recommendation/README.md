# Recommendation Engine — Eligify AI Engine

> **Module Location:** `ai_engine/recommendation/`  
> **Status:** Active / Milestone 4 Completed  

The **Recommendation Engine** orchestrates end-to-end scheme discovery for citizens. It loads scheme datasets, evaluates user profiles using the Rule-Based Eligibility Engine, scores and ranks eligible matches, applies post-evaluation filters, and returns a prioritized list of government scheme recommendations.

---

## 🏗️ Recommendation Pipeline Architecture

```text
[ UserProfile ]
       │
       ▼
┌───────────────────────────┐
│ 1. Dataset Ingestion      │ ◄── loads schemes.csv via loader.py
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ 2. Rule Evaluation        │ ◄── runs evaluate_eligibility() per scheme
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ 3. Scoring & Ranking      │ ◄── calculates composite ranking_score
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ 4. Post-filtering         │ ◄── filters by state, ministry, occupation, etc.
└─────────────┬─────────────┘
              │
              ▼
[ Ranked Scheme Recommendations ]
```

---

## 📁 Module Files

```text
ai_engine/recommendation/
├── recommender.py    # Main entrypoint function: recommend_schemes()
├── ranking.py        # Scoring formula & sorting algorithms
├── filters.py        # Post-evaluation criteria filter utility functions
└── README.md         # Module documentation & developer guide
```

---

## ⚖️ Ranking & Scoring Formula (`ranking.py`)

Each evaluated scheme is scored using the following weighted metric:

$$\text{Ranking Score} = (\text{Confidence} \times 50) + (\text{Matched Rules} \times 10) - (\text{Failed Rules} \times 20) + \text{State Match Bonus} + \text{Priority Boost}$$

### Scoring Components:
- **Base Confidence Points:** `confidence * 50.0` (0 to 50 pts)
- **Matched Conditions Bonus:** `len(matched_conditions) * 10.0` (+80 pts for 8/8 matches)
- **Failed Conditions Penalty:** `len(failed_conditions) * 20.0`
- **State Jurisdiction Bonus:** `+15.0` boost if scheme matches the user's home state (e.g. Madhya Pradesh state scheme for MP resident)
- **Custom Priority Boost:** Optional custom score adjustments (`priority_map`)

---

## 🔍 Filtering Capabilities (`filters.py`)

Supports granular post-filtering on recommendation results:

| Filter Function | Filter Parameter | Description |
| :--- | :--- | :--- |
| `filter_by_state` | `state` | Filters by home state or pan-India central schemes |
| `filter_by_ministry` | `ministry` | Substring match on administering ministry/department |
| `filter_by_occupation` | `occupation` | Filters by target occupation group |
| `filter_by_gender` | `gender` | Filters by target gender |
| `filter_by_category` | `category` | Filters by social category qualification |
| `filter_by_disability` | `disability` | Excludes mandatory disability schemes if user is not disabled |

---

## 🚀 Python Usage Examples

### 1. Basic Recommendation Query

```python
from ai_engine.rules.models import UserProfile
from ai_engine.recommendation.recommender import recommend_schemes

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

# Fetch top recommendations
recommendations = recommend_schemes(user)

print(f"Found {len(recommendations)} eligible schemes:")
for rec in recommendations:
    print(f" - [{rec.scheme.scheme_id}] {rec.scheme.scheme_name} (Score: {rec.ranking_score})")
```

### 2. Recommendations with Post-Filtering

```python
from ai_engine.rules.models import UserProfile
from ai_engine.recommendation.recommender import recommend_schemes

user = UserProfile(
    age=30,
    gender="Male",
    category="SC",
    annual_income=200000.0,
    state="Tamil Nadu",
    occupation="Farmer",
    disability=False,
    education="10th Pass"
)

# Filter criteria map
filters = {
    "occupation": "Farmer",
    "state": "Tamil Nadu"
}

recommendations = recommend_schemes(user, filter_criteria=filters)

for rec in recommendations:
    print(f"Scheme: {rec.scheme.scheme_name} | Ministry: {rec.scheme.ministry}")
```
