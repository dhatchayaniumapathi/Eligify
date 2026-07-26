# Eligify

## AI-Powered Government Scheme Eligibility & Recommendation Platform

Eligify is an intelligent platform that simplifies government scheme discovery, verifies citizen document credentials using OCR, and provides transparent eligibility evaluation.

---

## 📚 Project Documentation

- [Project Context & Vision](docs/PROJECT_CONTEXT.md)
- [System Architecture & Specifications](docs/ARCHITECTURE.md)

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Lucide Icons
- **Backend:** FastAPI (Python), Pydantic, SQLAlchemy, PostgreSQL
- **AI & OCR:** Python, Rule Evaluation Engine, EasyOCR / Tesseract

---

## 📁 Repository Structure Overview

```text
Eligify/
├── docs/                      # Technical documentation & system specifications
├── backend/                   # FastAPI REST API Application
│   ├── app/                   # API routes, core settings, models, schemas, services
│   ├── requirements.txt
│   └── .env.example
├── ai_engine/                 # AI Rules Matcher & OCR Verification Engine
│   ├── dataset/
│   ├── rules/
│   ├── recommendation/
│   ├── explainability/
│   ├── ocr/
│   ├── utils/
│   ├── tests/
│   └── requirements.txt
├── frontend/                  # React Single Page Application (Vite)
│   ├── public/
│   ├── src/                   # Components, pages, hooks, layouts, context, services
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── README.md
└── .gitignore
```
