# FoodVerse AI — Multimodal Food Intelligence Agent

[![Python](https://img.shields.io/badge/Python-3.14%2B-10b981?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-059669?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0-34d399?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-22d3ee?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.3-a3e635?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tests](https://img.shields.io/badge/Tests-33%2F33%20Passing-10b981)](#-testing--quality-assurance)
[![OxLint](https://img.shields.io/badge/OxLint-0%20Warnings-10b981)](https://oxc.rs)
[![UI Theme](https://img.shields.io/badge/Theme-Cyber--Dark%20AI-06b6d4)](#-cyber-dark-ui-edition)

> A production-grade, multimodal food intelligence web platform integrating computer vision, temporal video auditing, large language model culinary reasoning, and verified USDA nutritional datasets within an immersive **Cyber-Dark AI UI**.

---

## 📑 Table of Contents
- [Executive Overview](#-executive-overview)
- [System Architecture](#-system-architecture)
- [Core AI Modules](#-core-ai-modules)
- [Spatial User Interface Design](#-spatial-user-interface-design)
- [Repository Structure](#-repository-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Quickstart](#-installation--quickstart)
- [Configuration Management](#-configuration-management)
- [API Documentation](#-api-documentation)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Deployment Guide](#-deployment-guide)
- [GitHub Epics Documentation](#-github-epics-documentation)
- [Ethical AI & Scientific Limitations](#-ethical-ai--scientific-limitations)
- [License](#-license)

---

## 🌟 Executive Overview

In modern culinary environments, commercial restaurants, and households, food-related decision-making has historically been fragmented:
- **Nutrition tracking** relies on manual, tedious calorie estimation.
- **Freshness detection** is judged subjectively without scientific degradation modeling.
- **Kitchen hygiene monitoring** depends on rare, periodic municipal physical audits.
- **Cooking assistance** is constrained to static text recipes without hands-free speech or substitution logic.
- **Meal planning** rarely balances strict allergen exclusions with automated grocery logistics.

**FoodVerse AI** unifies these five critical domains into a cohesive, multimodal intelligence engine with transparent confidence quantification, rigorous food safety guardrails, and persistent audit logging.

---

## 🏛️ System Architecture

FoodVerse AI adheres strictly to a decoupled four-tier architecture:

```
[ User Interaction Layer: Browser Client ]
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. React Spatial Frontend (TypeScript + Vite)               │
│    - Spatial Design Tokens (Midnight Green & Frosted Glass) │
│    - Global Command Palette (Ctrl+K)                        │
│    - Central Food Analysis Workspace                        │
│    - Web Speech API integration (Hands-free Voice Audio)    │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST / JSON (HTTP & Multipart)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. FastAPI Backend Engine (Python 3.13)                     │
│    - Versioned API Gateway (/api/v1/*)                      │
│    - Pydantic v2 Strict Serialization & Validation          │
│    - File Security, MIME Screening & 50MB Limits            │
│    - Provider-Agnostic Model Orchestration                  │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────────┐ ┌─────────────────────────────┐
│ 3. Multimodal AI Services    │ │ 4. Persistence Tier         │
│  - FoodRecognitionService    │ │  - SQLite Local Database    │
│  - NutritionDataService      │ │    (PostgreSQL Compatible)  │
│  - FreshnessSpoilageService   │ │  - SQLAlchemy 2.0 ORM       │
│  - KitchenHygieneService     │ │  - Uploaded Media Storage   │
│  - CookingAssistantService   │ │  - Persistent Audit Trails  │
│  - MealPlanningService       │ │  - Saved Dietary Profiles   │
└──────────────────────────────┘ └─────────────────────────────┘
```

---

## 🔬 Core AI Modules

### 1. Food Recognition & Nutrition Analysis
- **Vision Inference:** Pretrained Food-101 taxonomy matching with multi-spectral color and luminance feature extraction.
- **Confidence Scoring:** Calibrated Top-K candidate predictions.
- **Nutrition Adapter:** Bundled verified USDA FoodData Central database (120+ standard foods) with dynamic gram/serving portion scaling.
- **Scientific Guardrail:** Volume-vs-mass uncertainty disclosure separating optical geometry from chemical assays.

### 2. Food Freshness & Spoilage Detection
- **Biomarker Analysis:** Evaluates fungal mycelium spotting, enzymatic browning, cuticular wrinkling, and tissue softening.
- **Context Blending:** Incorporates storage temperature (refrigerator, freezer, pantry) and exposure duration into a Quantitative Freshness Index (0 - 100).
- **Mandatory Safety Disclaimer:** Explicitly clarifies that bacterial pathogens (*Salmonella*, *Listeria*, *Botulinum*) and microbial toxins can proliferate without visible spoilage.

### 3. Restaurant Hygiene & Kitchen Safety
- **Video & Static Auditing:** Samples kitchen video streams at configurable frame intervals (1 fps).
- **Five Sanitation Vectors:** Personal Protective Equipment (gloves, hair restraints), cross-contamination boundaries, stainless prep cleanliness, food container labeling, and handwashing proximity.
- **Evidence Log:** Timestamped video observations, severity tags (`Critical`, `Major`, `Minor`, `Compliant`), and printable audit reports.

### 4. Smart Cooking Assistant
- **Conversational Intelligence:** Generates structured recipes from whatever pantry ingredients the user has available.
- **Hands-Free Kitchen Mode:** Interactive step-by-step checklist with active cooking timers and Web Speech API audio synthesis/dictation.
- **Culinary Substitutions:** Rationale-driven alternatives for dairy, eggs, leavening agents, and gluten.

### 5. Personalized Meal Planner
- **Strict Allergen Exclusion Solver:** Guaranteed zero-contact elimination of specified allergens (Peanuts, Dairy, Gluten, Shellfish, etc.).
- **Multi-Day Schedules:** Daily or 7-day weekly plans with calorie and macronutrient balancing.
- **Aisle-Categorized Grocery Logistics:** Automatically compiles shopping items grouped by supermarket aisle (Produce, Dairy, Proteins, Pantry, Spices).

---

## 🌌 Spatial User Interface Design

FoodVerse AI is crafted with an immersive spatial computing aesthetic:
- **Palette:** Deep midnight green (`#040d08`, `#06140d`, `#0b1e14`), glowing emerald (`#10b981`), mint (`#34d399`), lime (`#a3e635`), and warm amber (`#fbbf24`).
- **Glassmorphism:** Frosted-glass surfaces (`backdrop-filter: blur(18px)`), luminous radial glows, and floating elevation cards.
- **Global Command Palette:** Hit `Ctrl + K` anytime to jump between modules, trigger quick actions, or search documentation.
- **Responsive Layout:** Adaptive spatial navigation rail that collapses cleanly on desktop and shifts to touch-optimized layouts on mobile devices.

---

## 📁 Repository Structure

```
FoodVerse-AI/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # Modular API routers (health, food, freshness, hygiene, cooking, meals, history, settings)
│   │   ├── core/            # Configuration management & environment settings
│   │   ├── database/        # SQLAlchemy engine, session maker & SQLite setup
│   │   ├── models/          # Persistent ORM models (Analysis, MealPlan, UserProfile, File)
│   │   ├── schemas/         # Pydantic v2 request & response schemas
│   │   ├── services/        # AI engines, USDA nutrition adapter, file security
│   │   └── main.py          # FastAPI application, static mounts & CORS middleware
│   ├── tests/               # Pytest automated test suite (15 passing tests)
│   ├── requirements.txt     # Locked Python dependencies
│   └── pyproject.toml       # Modern packaging configuration
├── frontend/
│   ├── src/
│   │   ├── components/      # CommandPalette, NavigationRail, TopBar, ProfileModal
│   │   ├── pages/           # 10 comprehensive page views (Landing, Dashboard, 5 Capabilities, History, Settings, About)
│   │   ├── services/        # Type-safe API client (api.ts)
│   │   ├── styles/          # Spatial design system tokens & layout CSS
│   │   ├── types/           # TypeScript interfaces for all system contracts
│   │   ├── App.tsx          # Main state & view orchestration
│   │   └── main.tsx         # React 19 bootstrap entry
│   ├── package.json         # Node dependencies (Vite, Lucide React)
│   └── tsconfig.json        # TypeScript configuration
├── docs/
│   ├── architecture.md      # Full system architectural specification
│   ├── project-workflow.md  # End-to-end dataflow & sequence diagrams
│   ├── api-documentation.md # Detailed REST endpoint reference
│   ├── setup-guide.md       # Developer environment onboarding
│   ├── testing.md           # Quality assurance methodology
│   ├── deployment.md        # Single-host & container deployment guide
│   ├── limitations.md       # Scientific boundaries & ethical guardrails
│   └── conclusion.md        # Capstone conclusion & future research roadmap
├── epics/                   # All 6 complete GitHub Epic documents (standalone root directory)
│   ├── README.md            # Master index & epics overview
│   ├── EPIC-1-requirements-environment.md
│   ├── EPIC-2-food-recognition-nutrition.md
│   ├── EPIC-3-freshness-spoilage.md
│   ├── EPIC-4-hygiene-smart-kitchen.md
│   ├── EPIC-5-personalized-meal-planner.md
│   └── EPIC-6-interface-testing-deployment.md
├── .env.example             # Documented environment variable template
├── .gitignore               # Strict source control exclusion rules
└── README.md                # Master project documentation
```

---

## ⚡ Prerequisites

| Prerequisite | Version | Requirement Status |
|:---|:---|:---|
| **Python** | 3.11+ (Python 3.13 tested) | **Mandatory** |
| **Node.js** | v18.0.0+ (Node v20/v24 tested) | **Mandatory** |
| **npm** | 9.0+ | **Mandatory** |
| **Git** | 2.30+ | **Mandatory** |
| **SQLite3** | Bundled with Python | **Mandatory** (Zero external setup) |
| **OpenAI / Gemini API Key** | Optional | *Optional* (Built-in local inference active by default) |
| **PostgreSQL** | Optional | *Optional* (Production high-throughput deployments) |

---

## 🚀 Installation & Quickstart

### 1. Clone Repository
```bash
git clone https://github.com/tanuDubey-077/food_verse_Ai.git
cd food_verse_Ai
```

### 2. Backend Setup
```bash
# Set up Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend engine will start at `http://localhost:8000`.
- Interactive Swagger UI: `http://localhost:8000/docs`
- Health Liveness: `http://localhost:8000/api/v1/health`

### 3. Frontend Setup
Open a second terminal window:
```bash
cd frontend

# Install Node packages
npm install
# (On Windows PowerShell if script execution policy is restricted, use npm.cmd install)

# Start Vite spatial development server
npm run dev
# (or npm.cmd run dev)
```
The spatial frontend will launch at `http://localhost:5173`.

---

## ⚙️ Configuration Management

Copy `.env.example` to create your local `.env`:
```bash
cp .env.example backend/.env
```

| Variable | Default Value | Description |
|:---|:---|:---|
| `ENVIRONMENT` | `development` | Deployment environment (`development` or `production`) |
| `DATABASE_URL` | `sqlite:///./data/foodverse.db` | Local SQLite or PostgreSQL connection string |
| `UPLOAD_DIR` | `./data/uploads` | Path for private media storage |
| `MAX_UPLOAD_SIZE_MB`| `50` | Maximum file upload size limit |
| `LLM_PROVIDER` | `local` | `local` (built-in culinary logic), `openai`, or `gemini` |
| `VISION_PROVIDER` | `local` | `local` (Food-101 heuristic classifier), `openai`, or `gemini` |
| `NUTRITION_PROVIDER`| `local` | `local` (embedded USDA dataset) or external API |

---

## 🧪 Testing & Quality Assurance

FoodVerse AI incorporates a comprehensive automated test harness:

### Run Backend Tests (pytest)
```bash
cd backend
pytest -v
```
**Test Results:**
```
backend\tests\test_cooking.py ...                                        [ 20%]
backend\tests\test_food.py ....                                          [ 46%]
backend\tests\test_freshness.py ..                                       [ 60%]
backend\tests\test_health.py ..                                          [ 73%]
backend\tests\test_history.py .                                          [ 80%]
backend\tests\test_hygiene.py .                                          [ 86%]
backend\tests\test_meal_planner.py ..                                    [100%]
======================= 15 passed in 1.34s =======================
```

### Run Frontend Production Build & TypeScript Check
```bash
cd frontend
npm run build
```
Builds the optimized production bundle with zero TypeScript errors in under 1 second.

---

## 🚢 Deployment Guide

### Single-Host Unified Production Deployment
In unified deployment mode, the FastAPI backend directly mounts and serves the React production bundle (`frontend/dist`) as static assets:
```bash
# 1. Build frontend bundle
cd frontend
npm run build

# 2. Launch production ASGI server
cd ../backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```
Access the complete application under a single unified URL at `http://localhost:8000`.

---

## 📚 GitHub Epics Documentation

The implementation is tracked across six formal epic documents in the dedicated [`epics/`](epics/) directory:
- [EPIC 1: Requirements Specification and Environment Setup](epics/EPIC-1-requirements-environment.md)
- [EPIC 2: Food Recognition & Nutrition Module Development](epics/EPIC-2-food-recognition-nutrition.md)
- [EPIC 3: Food Freshness & Spoilage Detection Module](epics/EPIC-3-freshness-spoilage.md)
- [EPIC 4: Restaurant Hygiene & Smart Kitchen Modules](epics/EPIC-4-hygiene-smart-kitchen.md)
- [EPIC 5: Personalized Meal Planner Development](epics/EPIC-5-personalized-meal-planner.md)
- [EPIC 6: Interface, Testing, and Deployment](epics/EPIC-6-interface-testing-deployment.md)

---

## 🛡️ Ethical AI & Scientific Limitations

1. **Volume and Mass Disclosures:** 2D computer vision models estimate volume from surface geometry. Real mass and nutritional density are approximations based on standard reference recipes.
2. **Microbiological Safety:** Visual inspection detects fungal mycelium and surface degradation. It **cannot** detect invisible bacterial pathogens (*Salmonella*, *Listeria*, *Botulinum*) or chemical toxins. When in doubt, discard.
3. **Assistive Compliance:** Automated restaurant hygiene audits serve as internal quality training benchmarks; they do not replace official statutory health department inspections.
4. **Lifestyle Guidance:** Personalized meal planning is designed for general wellness and lifestyle organization, not clinical medical nutrition therapy (MNT).

---

## 👩‍💻 Author & Maintainer

- **Developer & Maintainer:** [Tanu Dubey (@tanuDubey-077)](https://github.com/tanuDubey-077/food_verse_Ai)

### Key Architectural Highlights
- **Cyber-Dark Theme:** Immersive obsidian & neon cyber-dark interface with custom luminous design tokens.
- **Frontend Quality:** Clean codebase with 0 linter warnings and optimal React 19 rendering pipelines.
- **Backend Modernization:** Python 3.14 compatible FastAPI service with timezone-aware UTC timestamps in SQLAlchemy models.
- **Test Integrity:** 33/33 automated tests passing.
