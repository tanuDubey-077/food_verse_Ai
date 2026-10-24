# 📋 FoodVerse AI — GitHub Epics Master Index

Welcome to the **FoodVerse AI Epics Directory**. This folder houses the complete engineering specifications, requirements, acceptance criteria, and architecture for all 6 core epics comprising the FoodVerse AI platform.

---

## 📑 Overview of Project Epics

| Epic | Specification Document | Focus Area | Status |
| :--- | :--- | :--- | :---: |
| **EPIC 1** | [EPIC-1: Requirements & Environment Setup](./EPIC-1-requirements-environment.md) | System architecture, dependencies, FastAPI + Vite foundation, SQLite & database schemas | ✅ **Complete** |
| **EPIC 2** | [EPIC-2: Food Recognition & Nutrition](./EPIC-2-food-recognition-nutrition.md) | Multimodal food detection, volume estimation, USDA macro/micronutrient breakdown, Gemini AI | ✅ **Complete** |
| **EPIC 3** | [EPIC-3: Freshness & Spoilage Detection](./EPIC-3-freshness-spoilage.md) | Surface visual degradation analysis, freshness scoring, shelf-life estimation, safe storage tips | ✅ **Complete** |
| **EPIC 4** | [EPIC-4: Restaurant Hygiene & Smart Kitchen](./EPIC-4-hygiene-smart-kitchen.md) | Commercial kitchen sanitation audit, hazard detection, interactive AI culinary chat assistant | ✅ **Complete** |
| **EPIC 5** | [EPIC-5: Personalized Meal Planner](./EPIC-5-personalized-meal-planner.md) | Caloric target calculation, dietary constraint filtering (vegan, keto, etc.), weekly plan generator | ✅ **Complete** |
| **EPIC 6** | [EPIC-6: Interface, Testing, and Deployment](./EPIC-6-interface-testing-deployment.md) | Colorful claymorphic frontend UI, full pytest test suite, single-port production serving | ✅ **Complete** |

---

## 🏗️ Architecture & Technology Stack Alignment

- **Frontend**: React 19, TypeScript, Vite, Tailwind-free bespoke CSS with claymorphic tactile styling.
- **Backend**: FastAPI, SQLAlchemy, Pydantic v2, Python 3.11+.
- **Multimodal AI Provider**: Google Gemini (`gemini-2.5-flash`), with offline heuristic fallback models.
- **Storage**: Local SQLite engine with uploads directory for image analysis.

---

For complete system architecture and API documentation, refer to the [`docs/`](../docs/) directory.
