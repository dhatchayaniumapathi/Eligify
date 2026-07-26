# PROJECT_CONTEXT.md — Eligify

> **Project Name:** Eligify  
> **Tagline:** AI-Powered Government Scheme Eligibility & Recommendation Platform  
> **Version:** 1.0.0 (Hackathon Edition)  
> **Document Status:** Active / Living Foundation Document  

---

## 1. Project Vision

Millions of citizens miss out on life-changing welfare programs, subsidies, and government schemes due to complex eligibility criteria, fragmented information across government portals, and tedious document verification processes.

**Eligify** aims to bridge this gap by delivering an intelligent, unified, and user-centric platform. By leveraging a rule-based AI eligibility evaluation engine combined with automated OCR (Optical Character Recognition) document verification, Eligify automatically matches users with the government schemes they qualify for, verifies their credentials, and provides step-by-step application guidance.

---

## 2. Objectives

- **Democratize Scheme Access:** Provide a simple, accessible questionnaire and profile setup for users of all digital literacy levels.
- **Accurate Eligibility Matching:** Implement a deterministic, configurable rule engine to match user demographics, financial status, location, category, and occupation with government scheme criteria with high precision.
- **Automated Document Verification:** Utilize AI/OCR models to extract key fields from government-issued identity and income documents (e.g., Aadhaar, Income Certificate, Caste Certificate) and cross-validate them against user claims.
- **Transparent & Actionable Insights:** Present clear eligibility scores, missing qualification criteria, required documents, and direct application links in an intuitive user dashboard.
- **Privacy & Security First:** Ensure sensitive personal data and documents are processed securely and encrypted at rest and in transit.

---

## 3. Tech Stack

| Layer | Technologies & Tools | Description / Rationale |
| :--- | :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Lucide Icons, Axios | Responsive, high-performance UI with modern aesthetics, dark mode support, and smooth user flows. |
| **Backend API** | FastAPI (Python 3.10+), Pydantic, Uvicorn | Async web framework providing fast performance, automatic OpenAPI documentation, and strict type safety. |
| **Database** | PostgreSQL, SQLAlchemy (ORMs / Asyncpg), Alembic | Relational database to store users, scheme rules, applications, and verification audit logs. |
| **AI / Rules Engine** | Python, Rule Evaluation Engine, PyDantic Schemas | Custom modular rule matcher mapping user attributes against dynamic JSON/DB scheme conditions. |
| **Document Processing (OCR)** | EasyOCR / Tesseract, OpenCV, Pillow, PyMuPDF | Extraction of structured textual data from scanned PDFs/images to verify claimed user data. |
| **DevOps & Tooling** | Git, Docker (optional), Vite / Create React App | Standardized local dev environment and deployment containerization. |

---

## 4. Coding Conventions

To ensure consistency across the hackathon project, all contributors must strictly adhere to these conventions:

### 4.1 General Principles
- **KISS (Keep It Simple, Stupid):** Avoid over-engineering; build modular, extensible components.
- **DRY (Don't Repeat Yourself):** Abstract shared utilities, constants, and database helpers.
- **Explicit over Implicit:** Use strict type hints and meaningful variable/function naming.

### 4.2 Python & FastAPI (Backend / AI)
- Follow **PEP 8** standards.
- Use explicit type annotations for function parameters and return types.
- Define all request/response models using **Pydantic v2**.
- Structure API handlers using `APIRouter` categorized by feature domain.
- Use async/await for database queries and I/O-bound operations.

### 4.3 JavaScript & React (Frontend)
- Use **Functional Components** with React Hooks (`useState`, `useEffect`, `useContext`, `useCallback`).
- Follow standard component modularity: one component per file, grouped by domain/feature.
- Use **Tailwind CSS** for styling, utilizing utility classes and curated color themes rather than inline styles.
- Organize API requests inside dedicated service modules.

### 4.4 Git & Commit Conventions
- Branch naming: `feature/<feature-name>`, `fix/<bug-name>`, `docs/<doc-name>`.
- Commit message format: `feat: <short description>`, `fix: <short description>`, `docs: <short description>`.

---

## 5. Folder Structure Overview

```text
Eligify/
├── docs/                      # Project documentation & architecture diagrams
│   ├── PROJECT_CONTEXT.md     # Project foundation & rules
│   └── ARCHITECTURE.md        # Deep-dive system architecture & data flows
├── backend/                   # FastAPI Backend Application
│   ├── app/
│   │   ├── api/               # API route controllers
│   │   ├── core/              # Config, security, database session setup
│   │   ├── models/            # SQLAlchemy ORM database models
│   │   ├── schemas/           # Pydantic validation schemas
│   │   ├── services/          # Business logic
│   │   └── utils/             # Helper utilities & loggers
│   ├── main.py                # FastAPI entry point
│   ├── requirements.txt       # Python dependencies
│   └── .env.example
├── ai_engine/                 # AI & OCR Intelligence Engine
│   ├── dataset/
│   ├── rules/
│   ├── recommendation/
│   ├── explainability/
│   ├── ocr/
│   ├── utils/
│   ├── tests/
│   └── requirements.txt
├── frontend/                  # React.js SPA (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── README.md
└── .gitignore
```
