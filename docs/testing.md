# FoodVerse AI — Quality Assurance and Testing Guide

Testing is a core architectural requirement of FoodVerse AI. This document details our multi-tier automated testing strategy, including unit testing, integration testing, and full-stack end-to-end verification.

---

## 1. Testing Architecture

FoodVerse AI employs three tiers of automated verification:
1. **Backend Unit & Integration Tests (pytest):** Validates all endpoint schemas, Pydantic serialization, business logic services, database transactions, file security, and provider fallbacks.
2. **Frontend Type & Build Verification (tsc & Vite):** Verifies that all components, hooks, interfaces, and API services conform strictly to TypeScript definitions with zero bundle errors.
3. **End-to-End System Smoke Tests:** Validates complete user journeys from browser upload to model inference, database persistence, and spatial UI rendering.

---

## 2. Running Backend Tests

Navigate to the `backend/` directory and invoke pytest:

```bash
cd backend
pytest -v
```

### Key Test Suites:
- `tests/test_health.py`: Verifies `/api/v1/health` and `/api/v1/health/readiness`.
- `tests/test_food_recognition.py`: Tests food classification, Top-K candidates, portion scaling, and invalid file upload rejection.
- `tests/test_freshness.py`: Tests visual indicator analysis, expiration timeline calculation, and food safety disclaimers.
- `tests/test_hygiene.py`: Tests kitchen frame extraction, sanitation violation taxonomy, and audit report generation.
- `tests/test_cooking.py`: Tests conversational recipe generation, ingredient substitutions, and chef guidance.
- `tests/test_meal_planner.py`: Tests strict allergen elimination filters, macro distributions, and grocery list compilation.
- `tests/test_history.py`: Tests database persistence, pagination, and multi-format report exports.

---

## 3. Running Frontend Tests and Verification

Navigate to `frontend/`:

```bash
cd frontend
# Run TypeScript type check
npm.cmd run build
```

The production build pipeline bundles the application into `frontend/dist`, validating all JSX elements, CSS assets, and typed API contracts.

---

## 4. End-to-End Workflow Verification Matrix

| Workflow | Tested Scenario | Expected Outcome | Verification Status |
|:---|:---|:---|:---|
| **Health Liveness** | Query `GET /api/v1/health` | HTTP 200, system status `healthy` | ✅ Verified |
| **Food Recognition** | Upload image or type "Salmon Bowl" | Return 90%+ confidence, macro breakdown, portion slider | ✅ Verified |
| **Freshness Check** | Upload fruit image with 6 days storage | Freshness score ~70-80%, visual alerts, safe consumption window | ✅ Verified |
| **Kitchen Hygiene** | Upload prep area image | Frame inspection, violation tags, sanitization score | ✅ Verified |
| **Cooking Chat** | Request recipe with 3 ingredients | Structured recipe with timers and ingredients list | ✅ Verified |
| **Meal Planning** | 7-day Mediterranean plan excluding peanuts | Excludes peanuts completely, generates grocery list | ✅ Verified |
| **History Logging** | Verify past analyses populate history | Saved records visible, filterable, and exportable | ✅ Verified |
