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

### 4.1 Dependency Injection & Layer Separation
- **Endpoints (Controllers):** Handle HTTP status codes, request parsing, and invoke service methods.
- **Service Layer:** Houses domain logic, orchestrates calls between database models and the `ai_engine`.
- **Repository / Database Layer:** Interacts with PostgreSQL using async SQLAlchemy ORM queries.

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

### 5.1 Eligibility Evaluation Matrix
The evaluation engine runs rule checks where each criterion produces:
- `STATUS`: `MATCHED`, `FAILED`, `CONDITIONALLY_MATCHED`
- `CONFIDENCE_SCORE`: Decimal (0.0 to 1.0)
- `REASON`: Clear human-readable message explaining why a user qualifies or fails (e.g., *"Annual income ₹1.5L is below the maximum scheme threshold of ₹2.5L"*).

### 5.2 OCR Pipeline Details
1. **Preprocessing:** Contrast stretching, noise reduction, and binarization via OpenCV.
2. **Text Extraction:** Optical Character Recognition using EasyOCR / Tesseract.
3. **Pattern Parser:** Customized Regular Expressions (Regex) to pull key identifiers:
   - Aadhaar Number (`\d{4}\s\d{4}\s\d{4}`)
   - Date of Birth / Year of Birth (`DOB:\s*\d{2}/\d{2}/\d{4}`)
   - Income Amount (`Annual Income:\s*₹?\s*[\d,]+`)
4. **Verification Matching:** String distance algorithms (e.g., Levenshtein distance) to compare extracted document text against user profile entries.

---

## 6. Frontend Architecture

The frontend is built using React.js with Tailwind CSS, utilizing a component-driven architecture with clean state management.

```text
frontend/src/
├── components/
│   ├── common/             # Navbar, Footer, LoadingSpinner, Badge
│   ├── dashboard/          # SchemeCard, EligibilityMeter, DocumentStatus
│   ├── profile/            # ProfileFormWizard, AttributeSelector
│   └── ocr/                # FileUploader, VerificationResultModal
├── context/
│   ├── AuthContext.js      # User authentication context & token handling
│   └── SchemeContext.js    # Active scheme list & user filter state
├── pages/
│   ├── HomePage.js         # Landing page & feature highlights
│   ├── LoginPage.js        # Auth login/registration page
│   ├── ProfilePage.js      # User demographic setup wizard
│   ├── DashboardPage.js    # Matched schemes overview
│   └── VerificationPage.js # OCR Document upload & verification
├── services/
│   ├── api.js              # Base Axios instance with auth headers
│   ├── authService.js      # Login/Register API calls
│   ├── schemeService.js    # Fetch schemes & eligibility checks
│   └── ocrService.js       # Multipart document upload API calls
└── App.js                  # React Router configuration
```

---

## 7. Database Overview

Eligify uses PostgreSQL as its primary database. Below is the Entity-Relationship (ER) schema design.

```mermaid
erDiagram
    USERS ||--o| PROFILES : "has"
    USERS ||--o{ APPLICATIONS : "submits"
    USERS ||--o{ DOCUMENTS : "uploads"
    SCHEMES ||--o{ ELIGIBILITY_RULES : "contains"
    SCHEMES ||--o{ APPLICATIONS : "receives"
    DOCUMENTS ||--o| VERIFICATION_LOGS : "generates"

    USERS {
        uuid id PK
        string email UK
        string hashed_password
        string full_name
        boolean is_active
        timestamp created_at
    }

    PROFILES {
        uuid id PK
        uuid user_id FK
        integer age
        string gender
        string state
        string district
        decimal annual_income
        string occupation
        string category
        boolean is_disabled
        timestamp updated_at
    }

    SCHEMES {
        uuid id PK
        string code UK
        string title
        string ministry_department
        text description
        string benefit_type
        decimal benefit_amount
        string official_portal_url
        boolean is_active
    }

    ELIGIBILITY_RULES {
        uuid id PK
        uuid scheme_id FK
        integer min_age
        integer max_age
        decimal max_income
        string required_category
        string required_state
        jsonb custom_conditions
    }

    DOCUMENTS {
        uuid id PK
        uuid user_id FK
        string document_type
        string file_path
        string status
        timestamp uploaded_at
    }

    VERIFICATION_LOGS {
        uuid id PK
        uuid document_id FK
        jsonb extracted_data
        decimal match_confidence
        boolean is_verified
        text remark
        timestamp verified_at
    }

    APPLICATIONS {
        uuid id PK
        uuid user_id FK
        uuid scheme_id FK
        string status
        timestamp applied_at
    }
```

---

## 8. API Interaction Flow

### 8.1 Core API Endpoints

| Method | Endpoint | Description | Request Body / Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new user | `{email, password, full_name}` | `{user_id, email, token}` |
| `POST` | `/api/v1/auth/login` | User authentication | `{username, password}` | `{access_token, token_type}` |
| `GET` | `/api/v1/profile` | Retrieve user profile | Header: `Bearer <token>` | `UserProfileResponse` schema |
| `PUT` | `/api/v1/profile` | Update profile attributes | `UserProfileCreate` schema | Updated `UserProfileResponse` |
| `GET` | `/api/v1/schemes` | List all available schemes | Query: `?state=X&category=Y` | `List[SchemeResponse]` |
| `POST` | `/api/v1/eligibility/check` | Evaluate scheme eligibility | Header: `Bearer <token>` | `EligibilityEvaluationResponse` |
| `POST` | `/api/v1/ocr/verify` | Upload document & run OCR | `Multipart Form (file, doc_type)` | `OCRVerificationResponse` |

### 8.2 Sequence Diagram: Document Upload & OCR Verification Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend
    participant API as FastAPI Gateway
    participant OCR as OCR Service
    participant Database

    User->>Frontend: Select document type & upload file (Aadhaar / Income Cert)
    Frontend->>API: POST /api/v1/ocr/verify (FormData with binary file)
    API->>API: Validate file extension & size (Max 5MB PDF/PNG/JPEG)
    API->>OCR: Invoke OCR pipeline (file_path, document_type)
    OCR->>OCR: Execute image enhancement & contrast adjustment
    OCR->>OCR: Extract raw text via Tesseract/EasyOCR
    OCR->>OCR: Parse regex fields (Name, Identifier No, Income value)
    API->>Database: Fetch user profile attributes for comparison
    Database-->>API: User profile record
    API->>OCR: Compare parsed text with profile record
    OCR-->>API: Match score (e.g. 0.95), extracted fields & verification boolean
    API->>Database: Store document record & verification log
    API-->>Frontend: Return verification status, match %, and identified credentials
    Frontend->>User: Display success banner with green verification badge
```
