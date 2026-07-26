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
- Use explicit type annotations for function parameters and return types (`def evaluate_scheme(user_profile: UserProfileSchema) -> EligibilityResult:`).
- Define all request/response models using **Pydantic v2**.
- Structure API handlers using `APIRouter` categorized by feature domain (e.g., `/api/v1/auth`, `/api/v1/schemes`, `/api/v1/eligibility`, `/api/v1/ocr`).
- Use async/await for database queries and I/O-bound operations.

### 4.3 JavaScript & React (Frontend)
- Use **Functional Components** with React Hooks (`useState`, `useEffect`, `useContext`, `useCallback`).
- Follow standard component modularity: one component per file, grouped by domain/feature.
- Use **Tailwind CSS** for styling, utilizing utility classes and curated color themes rather than inline styles.
- Organize API requests inside dedicated service modules (e.g., `services/api.js`, `services/ocrService.js`).

### 4.4 Git & Commit Conventions
- Branch naming: `feature/<feature-name>`, `fix/<bug-name>`, `docs/<doc-name>`.
- Commit message format: `feat: <short description>`, `fix: <short description>`, `docs: <short description>`.

---

## 5. Folder Structure Overview

```text
Eligify/
├── docs/                      # Project documentation & architecture diagrams
│   ├── PROJECT_CONTEXT.md     # Project foundation & rules (this file)
│   └── ARCHITECTURE.md        # Deep-dive system architecture & data flows
├── backend/                   # FastAPI Backend Application
│   ├── app/
│   │   ├── api/               # API route controllers (v1)
│   │   │   ├── endpoints/     # auth.py, users.py, schemes.py, eligibility.py, ocr.py
│   │   │   └── router.py      # Main API router aggregator
│   │   ├── core/              # Config, security, database session setup
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── database.py
│   │   ├── models/            # SQLAlchemy ORM database models
│   │   │   ├── user.py
│   │   │   ├── profile.py
│   │   │   ├── scheme.py
│   │   │   └── application.py
│   │   ├── schemas/           # Pydantic validation schemas
│   │   ├── services/          # Business logic (Scheme Service, User Service)
│   │   └── utils/             # Helper utilities & loggers
│   ├── main.py                # FastAPI entry point
│   ├── requirements.txt       # Python dependencies
│   └── alembic/               # DB migrations
├── ai_engine/                 # AI & OCR Intelligence Engine
│   ├── rules/                 # Scheme rule evaluator logic
│   │   ├── evaluator.py       # Core evaluation engine logic
│   │   ├── condition_matchers.py # Age, income, gender, location condition checkers
│   │   └── scheme_rules.json  # Pre-configured scheme eligibility definitions
│   ├── ocr/                   # Document OCR & Information Extraction
│   │   ├── preprocessor.py    # Image contrast, deskewing, noise reduction
│   │   ├── extractor.py       # OCR text extraction engine
│   │   └── parser.py          # Regex/NER parsers for ID & Income documents
│   └── tests/                 # Unit tests for AI logic
├── frontend/                  # React.js Single Page Application
│   ├── public/                # Static assets & index.html
│   ├── src/
│   │   ├── assets/            # Images, logos, branding assets
│   │   ├── components/        # Reusable UI components (Navbar, Footer, Card, Modal)
│   │   ├── pages/             # Page views (Home, Login, Profile, Dashboard, SchemeDetail, OCRUpload)
│   │   ├── services/          # Axios API communication services
│   │   ├── context/           # React Context (AuthContext, EligibilityContext)
│   │   ├── utils/             # Helper formatters & validators
│   │   ├── App.js             # Core App component & routes
│   │   └── index.css          # Global CSS & Tailwind imports
│   ├── package.json
│   └── tailwind.config.js
├── README.md                  # Quickstart & Repository Overview
└── .gitignore                 # Excluded files and directories
```

---

## 6. Development Rules

1. **Strict Type Safety & Input Validation:** All external data arriving at the API must pass strict validation via Pydantic before processing.
2. **Environment Variable Configuration:** Never hardcode credentials, secret keys, or database URIs. All config must load from `.env` via `pydantic-settings` or Python `os.getenv`.
3. **Graceful Error Handling:**
   - FastAPI endpoints must catch exceptions and return standardized JSON error responses with appropriate HTTP status codes (`400`, `401`, `404`, `422`, `500`).
   - Frontend must display clear visual feedback (toast notifications, inline alerts) rather than breaking or freezing.
4. **Data Isolation:** User document uploads must be stored with unique UUID filenames and processed isolatedly to prevent directory traversal or file collision.
5. **No Production Secrets in Git:** Keep `.env` in `.gitignore`. Provide `.env.example` templates for setup.

---

## 7. AI Assistant Rules

When generating code, modifying files, or assisting with Eligify development, AI agents must strictly observe the following rules:

1. **Adhere to Folder Boundaries:** Keep backend code inside `backend/`, frontend code inside `frontend/`, and AI/OCR code inside `ai_engine/`. Do not mix layers.
2. **No Fallback Stubbing of Security Code:** Ensure authentication and password hashing logic remain secure and rely on industry standards (`passlib`, `bcrypt`, `pyjwt`).
3. **Preserve Schemas:** Do not change API schemas or database model field names without updating corresponding frontend interfaces and API contracts simultaneously.
4. **Interactive & Modular Code:** Always produce clean, well-commented code modules with type annotations. Avoid dumping monoliths into single files.
5. **Explicit Path References:** Always link files and references accurately according to project layout conventions.
