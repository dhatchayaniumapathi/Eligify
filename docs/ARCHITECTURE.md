# ARCHITECTURE.md — Eligify

> **Project Name:** Eligify  
> **System Architecture Specification**  
> **Version:** 1.0.0  

---

## 1. Overall System Architecture

Eligify follows a decoupled **3-Tier Architecture** consisting of a React.js Single Page Application (Frontend), a high-performance FastAPI API Gateway/Backend, a specialized Python AI Engine (Rule Evaluator & OCR Document Parser), and a PostgreSQL Relational Database.

### 1.1 Architecture Block Diagram

```mermaid
flowchart TB
    subgraph Client Tier ["Client Tier (Browser / Mobile)"]
        ReactUI["React.js Frontend (Tailwind CSS)"]
        UserDevice["User Dashboard / Document Uploader"]
    end

    subgraph API Tier ["Backend & Gateway Tier"]
        FastAPI["FastAPI App / Router (Python)"]
        AuthModule["Auth & User Mgmt (JWT / Passlib)"]
        SchemeAPI["Scheme Service & Controller"]
        OCRController["OCR Upload Handler"]
    end

    subgraph AI Tier ["AI & Intelligence Engine"]
        RuleEngine["Rule-Based Eligibility Engine"]
        ConditionMatcher["Condition Matcher (Demographics, Income, Category)"]
        OCREngine["OCR Processing Pipeline (Tesseract / EasyOCR)"]
        DocParser["Document Extractor & Validator (Aadhaar, Income, Caste)"]
    end

    subgraph Data Tier ["Data Tier"]
        PostgresDB[(PostgreSQL Database)]
        FileStore["Secure Document Storage (Local/S3 Store)"]
    end

    %% Flow Connections
    ReactUI <-->|"REST API (JSON / Multipart HTTP)"| FastAPI
    FastAPI --> AuthModule
    FastAPI --> SchemeAPI
    FastAPI --> OCRController

    SchemeAPI <--> RuleEngine
    RuleEngine --> ConditionMatcher
    ConditionMatcher <-->|"Query Scheme Rules & Profiles"| PostgresDB

    OCRController --> OCREngine
    OCREngine --> DocParser
    OCRController -->|"Store Raw Document"| FileStore
    DocParser -->|"Cross-check Extracted Data"| PostgresDB

    FastAPI <-->|"Async SQL Queries (SQLAlchemy)"| PostgresDB
```

---

## 2. Module Descriptions

| Module | Location | Primary Responsibilities |
| :--- | :--- | :--- |
| **Frontend UI** | `frontend/` | Renders user registration, profile form, scheme discovery dashboard, eligibility breakdown cards, and document upload wizard. |
| **API Gateway & Auth** | `backend/app/api/` | Handles client requests, user authentication (JWT), request validation (Pydantic), and endpoint routing. |
| **User & Profile Service** | `backend/app/services/` | Manages demographic attributes (age, state, gender, annual income, occupation, category, disability status). |
| **Rule-Based Eligibility Engine** | `ai_engine/rules/` | Evaluates user profile attributes against scheme qualification criteria matrices and generates match confidence scores. |
| **OCR Document Parser** | `ai_engine/ocr/` | Applies image preprocessing, text extraction via OCR, regex pattern matching, and credential verification against claimed profile values. |
| **Database Access Layer** | `backend/app/core/database.py` | Asynchronous connection pooling and ORM models mapping to PostgreSQL tables. |

---

## 3. Data Flow

### 3.1 End-to-End Application Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Citizen
    participant FE as React.js Frontend
    participant BE as FastAPI Backend
    participant AI as AI Eligibility Engine
    participant OCR as OCR Document Parser
    participant DB as PostgreSQL DB

    User->>FE: 1. Register / Fill Demographic Profile
    FE->>BE: 2. POST /api/v1/profile (User attributes)
    BE->>DB: 3. Save User Profile Data
    DB-->>BE: 4. Profile Saved Confirmation
    
    FE->>BE: 5. POST /api/v1/eligibility/check
    BE->>AI: 6. Invoke Evaluate(UserProfile, ActiveSchemes)
    AI->>AI: 7. Execute Condition Matchers (Income, Age, Category, Location)
    AI-->>BE: 8. Return Eligible Schemes + Match Scores + Missing Criteria
    BE-->>FE: 9. JSON Response (List of Matched Schemes)
    FE->>User: 10. Render Personalized Eligibility Dashboard

    User->>FE: 11. Upload Verification Document (Aadhaar / Income Cert)
    FE->>BE: 12. POST /api/v1/ocr/verify (Multipart File Upload)
    BE->>OCR: 13. Pass Document File Stream
    OCR->>OCR: 14. Preprocess Image -> Run OCR Extraction -> Parse Key Fields
    OCR->>DB: 15. Fetch User Claimed Profile Attributes
    OCR->>OCR: 16. Compare Extracted Credentials vs Claimed Attributes
    OCR-->>BE: 17. Return Verification Result (Match Status, Confidence %)
    BE->>DB: 18. Log Verification Audit Result
    BE-->>FE: 19. Verification Status & Verified Badge
    FE->>User: 20. Update Dashboard with Verification Badge & Application Link
```

---

## 4. Backend Architecture

FastAPI serves as the asynchronous backend API layer, structured following clean architecture principles.

```text
backend/app/
├── api/
│   ├── endpoints/
│   │   ├── auth.py         # POST /register, POST /login, GET /me
│   │   ├── users.py        # GET/PUT /profile
│   │   ├── schemes.py      # GET /schemes, GET /schemes/{id}
│   │   ├── eligibility.py  # POST /check, GET /my-recommendations
│   │   └── ocr.py          # POST /upload-verify
│   └── router.py           # Main APIRouter bundling all endpoints
├── core/
│   ├── config.py           # Settings management via pydantic-settings
│   ├── database.py         # SQLAlchemy async engine & sessionmaker
│   └── security.py         # JWT creation, password hashing (bcrypt)
├── models/                 # SQLAlchemy ORM models
├── schemas/                # Pydantic schemas for request/response serialization
└── services/               # Core business services
```

---

## 5. AI Module Architecture

The AI module consists of two decoupled sub-systems: the **Eligibility Engine** and the **OCR Document Verification Engine**.

```mermaid
flowchart LR
    subgraph RulesEngine ["1. Rule-Based Eligibility Engine"]
        ProfileInput["User Profile Object"] --> RuleEvaluator["Rule Evaluator Core"]
        SchemeCriteria["Scheme Rule Specifications"] --> RuleEvaluator
        
        RuleEvaluator --> AgeCheck["Age Matcher"]
        RuleEvaluator --> IncomeCheck["Income Threshold Matcher"]
        RuleEvaluator --> CategoryCheck["Category Matcher (General/OBC/SC/ST)"]
        RuleEvaluator --> LocCheck["State/District Location Matcher"]
        
        AgeCheck & IncomeCheck & CategoryCheck & LocCheck --> MatchScore["Calculate Match Score & Status"]
    end

    subgraph OCREngine ["2. OCR & Verification Engine"]
        DocFile["Uploaded PDF / Image"] --> Preprocessor["Image Preprocessing (Grayscale, Thresholding)"]
        Preprocessor --> TesseractOCR["EasyOCR / Tesseract Engine"]
        TesseractOCR --> RawText["Extracted Text String"]
        RawText --> FieldParser["Regex & Pattern Extractor"]
        FieldParser --> ExtractedData["Extracted Name, DOB, Aadhaar No, Income"]
        ExtractedData --> CrossValidator["Cross-Validator (Compare with Profile)"]
        CrossValidator --> VerificationReport["Verification Report & Score"]
    end
```

---

## 6. Database Overview

```mermaid
erDiagram
    USERS ||--o| PROFILES : "has"
    USERS ||--o{ APPLICATIONS : "submits"
    USERS ||--o{ DOCUMENTS : "uploads"
    SCHEMES ||--o{ ELIGIBILITY_RULES : "contains"
    SCHEMES ||--o{ APPLICATIONS : "receives"
    DOCUMENTS ||--o| VERIFICATION_LOGS : "generates"
```
