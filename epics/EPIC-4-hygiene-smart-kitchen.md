# EPIC 4: Restaurant Hygiene & Smart Kitchen Modules

## Objective
Implement two complementary intelligent culinary systems:
1. **Restaurant Hygiene & Safety Monitoring:** A video/image auditing system that inspects kitchen environments, food handling practices, personal protective equipment (gloves, hair coverings), and sanitary storage conditions.
2. **Smart Cooking Assistance:** A conversational culinary intelligence agent providing dynamic recipe generation, ingredient substitutions, step-by-step cooking timers, voice interaction, and safety alerts.

## Scope

### Sub-Module 4A: Restaurant Hygiene & Safety Monitoring
- Support for static kitchen photos and video clips (MP4, WebM).
- Automated frame extraction at configurable intervals (1 fps).
- Inspection of 5 key sanitation dimensions:
  1. Hand hygiene & glove adherence.
  2. Hair restraints and worker apparel.
  3. Cross-contamination vectors (raw meat separation from ready-to-eat foods).
  4. Work surface cleanliness and clutter.
  5. Food storage labeling and temperature hazard containment.
- Frame-level timestamped evidence log with severity ratings (`Critical`, `Major`, `Minor`, `Compliant`).
- Comprehensive Kitchen Sanitation Score (0 - 100) and exportable inspection report.
- Explicit legal & scientific disclaimer stating AI audits do not replace official regulatory health inspections.

### Sub-Module 4B: Smart Cooking Assistance
- Conversational chat interface for culinary inquiry.
- Ingredient-based recipe generator utilizing whatever pantry items the user has available.
- Step-by-step interactive cooking mode with live cooking timers and check-offs.
- Dynamic ingredient substitution engine (e.g., alternatives for buttermilk, eggs, soy sauce).
- Hands-free Web Speech API integration (voice dictation for input and Text-to-Speech audio reading for hands-free kitchen guidance).
- Provider-agnostic LLM backend (Local culinary logic engine by default, seamlessly switchable to OpenAI or Gemini via `.env`).

## Dependencies
- Backend: OpenCV-Python / Pillow, NumPy, Pydantic, SQLAlchemy.
- Frontend: React 19, Lucide Icons, Web Speech API.

## Implementation Tasks
- [x] Task 4.1: Implement backend `HygieneAnalysisService` with video frame sampling and violation detection.
- [x] Task 4.2: Build `/api/v1/hygiene/analyze` endpoint accepting video/image files and returning structured audits.
- [x] Task 4.3: Implement `CookingAssistantService` with conversational memory, recipe structuring, and substitution logic.
- [x] Task 4.4: Build `/api/v1/cooking/chat` and `/api/v1/cooking/substitute` endpoints.
- [x] Task 4.5: Build React `HygienePage` with video playback, frame gallery, timeline markers, and violation filters.
- [x] Task 4.6: Build React `CookingAssistantPage` with chat UI, recipe card viewer, step timer, and voice controls.
- [x] Task 4.7: Write backend unit tests for hygiene auditing and cooking conversation endpoints.

## Acceptance Criteria
- Video uploads are safely processed into frames without resource starvation.
- The hygiene report lists observed violations with exact timestamps, severity, and remediation guidance.
- The cooking assistant generates structured recipes based on arbitrary ingredients and respects dietary restrictions.
- Voice readout functions seamlessly on supported browsers via Web Speech API.
- Modules remain strictly segregated with independent endpoints and database models.

## Testing Checklist
- [x] Kitchen image or video upload generates a hygiene score and classified observation items.
- [x] Recipe generation responds correctly to constraints (e.g., "vegetarian within 20 minutes").
- [x] Substitution query returns valid alternatives with culinary explanations.
- [x] Large file uploads exceeding limits return descriptive HTTP 413 or 400 errors.

## Definition of Done
Both the kitchen hygiene auditing suite and conversational cooking assistant are fully functional, interactive, backed by dedicated backend services, and integrated into the spatial UI.

## Status
Completed
