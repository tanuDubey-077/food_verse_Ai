# FoodVerse AI — System Architecture Specification
**Document ID:** ARCH-2026-V1  
**Project:** FoodVerse AI — Multimodal Food Intelligence Agent  
**Status:** Approved & Implemented  

---

## 1. Executive Architecture Overview

FoodVerse AI is structured as a decoupled, multi-tier multimodal AI application consisting of four primary structural tiers:

```
[ User Interaction Layer: Browser Client ]
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. React Spatial Frontend (TypeScript + Vite)               │
│    - Spatial Design System (Midnight Green & Frosted Glass) │
│    - Global Command Palette (Ctrl+K)                        │
│    - Central Food Analysis Workspace                        │
│    - 5 Core Capability Consoles + History & Settings        │
│    - Web Speech API integration (Audio I/O)                 │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST / JSON (HTTP & Multipart)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. FastAPI Backend Engine (Python 3.13)                     │
│    - API Gateway & Versioned Routing (/api/v1/*)            │
│    - Pydantic v2 Request/Response Validation                │
│    - File Security, MIME Screening & Size Governance        │
│    - AI Provider Abstraction & Orchestration Layer         │
│    - Global Error Handling & Logging Middleware             │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────────┐ ┌─────────────────────────────┐
│ 3. Multimodal AI Providers   │ │ 4. Persistence & Storage    │
│  - Vision Recognition Service│ │  - SQLite / PostgreSQL      │
│  - USDA Nutrition Adapter    │ │    (SQLAlchemy 2.0 ORM)     │
│  - Spoilage & Freshness Model│ │  - Private Media Storage    │
│  - Kitchen Hygiene Engine    │ │    (Hashed Disk Files)      │
│  - Conversational LLM Chef   │ │  - Analysis History Records │
│  - Meal Planning Solver      │ │  - User Dietary Profiles    │
└──────────────────────────────┘ └─────────────────────────────┘
```

---

## 2. Core Subsystems

### 2.1 React Spatial Frontend (`/frontend`)
- **Technology Stack:** React 19, TypeScript, Vite, Vanilla CSS Spatial Design Tokens, Lucide Icons.
- **Design Paradigm:** Futuristic spatial UI featuring midnight green surfaces (`#040d08`), frosted-glass panels (`backdrop-filter: blur(16px)`), luminous emerald and lime indicators, floating command palette, responsive modular sidebars, and keyboard-first accessibility.
- **API Client:** Type-safe HTTP client (`services/api.ts`) with request interceptors, graceful error degradation, file upload progress support, and unified response envelope parsing.

### 2.2 FastAPI Application Engine (`/backend/app`)
- **Framework:** FastAPI with Uvicorn ASGI server.
- **Modularity:** Separate routers for Health, Food Recognition, Freshness Detection, Restaurant Hygiene, Smart Cooking, Meal Planning, Analysis History, and Settings.
- **Validation:** Strict Pydantic v2 schemas for all payload representations with explicit serialization constraints.
- **Security:** Strict file upload filters (MIME type verification, magic byte validation, 50MB file size limits), CORS origin white-listing, sanitized filepath handling, zero secret leakage in logs.

### 2.3 Multimodal AI Model Architecture (`/backend/app/services/`)
- **`FoodRecognitionService`:** Provider-agnostic vision inference engine. Built-in local food classification based on Food-101 taxonomy and feature extraction, with pluggable support for OpenAI GPT-4o-vision or Google Gemini Multimodal. Provides Top-K class predictions, confidence estimation, and macro estimation disclaimers.
- **`NutritionService`:** Dual-mode nutrition adapter. Bundles a local verified USDA FoodData Central composition dataset covering 120+ standard food items, macronutrients (calories, protein, carbs, fats, fiber), and micronutrients (calcium, iron, vitamin C, potassium), with portion size scaling and dynamic API fallback.
- **`FreshnessService`:** Multi-factor freshness & spoilage inference engine. Evaluates visual indicators (surface discoloration, mold-like patches, bruising, textural degradation) combined with contextual metadata (temperature, days stored, packaging). Implements a strict food safety disclaimer separating visible cues from microbiological safety.
- **`HygieneAnalysisService`:** Kitchen surveillance and safety analysis pipeline. Processes static images or extracts video frames at configurable sampling rates (1 fps default). Evaluates glove usage, hair restraints, cross-contamination vector proximity, surface sanitization, and open food storage. Outputs timestamped evidence logs and compliance scoring.
- **`CookingAssistantService`:** Interactive culinary reasoning engine. Generates structured recipes, ingredient substitutions, equipment requirements, cooking timelines, and conversational cooking guidance.
- **`MealPlanningService`:** Constraint-driven meal optimization engine. Applies strict allergen elimination filters, calorie/macro distribution targets, meal frequency configurations, and generates consolidated grocery shopping lists grouped by grocery aisle.

### 2.4 Data Persistence & Storage (`/backend/app/database/`)
- **ORM:** SQLAlchemy 2.0 models with Alembic-ready schemas.
- **Database Engine:** SQLite for zero-dependency local development and testing; fully switchable to PostgreSQL via `DATABASE_URL`.
- **Entities:**
  - `AnalysisRecord`: Unified persistence for food recognition, freshness, and hygiene runs.
  - `MealPlanRecord`: Structured multi-day meal plans and grocery lists.
  - `UserProfileRecord`: Dietary patterns, allergen preferences, calorie goals.
  - `HygieneReportRecord`: Detailed kitchen audits with violation logs and frame references.
  - `UploadedFileRecord`: File metadata, original filename, hashed path, MIME type, byte size.

---

## 3. Communication Protocols & Data Flow

1. **Client Request:** Frontend user inputs an image, video, voice prompt, or text query.
2. **Client Validation:** File size, MIME type, and required fields are screened in the browser.
3. **Transmission:** Sent via `multipart/form-data` or `application/json` to versioned endpoints (`/api/v1/*`).
4. **Backend Processing:**
   - FastAPI validates payload structure.
   - Files are stored with secure UUIDs in `/data/uploads`.
   - Relevant AI service is invoked via its standardized interface.
   - Results are normalized into documented Pydantic response models.
   - Analysis transaction is persisted to the database.
5. **Client Presentation:** React client parses the structured response and renders layered spatial cards, interactive macro charts, and contextual suggestions.
