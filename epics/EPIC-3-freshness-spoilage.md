# EPIC 3: Food Freshness & Spoilage Detection Module

## Objective
Build a specialized freshness and spoilage assessment engine that evaluates visual degradation markers on perishable foods (fruits, vegetables, dairy, meats, baked goods), incorporates storage metadata (temperature, duration, packaging), and outputs an objective condition assessment with food safety guardrails.

## Scope
- Modular `FreshnessService` evaluating visual surface indicators: discoloration, mold-like mycelial patterns, surface dehydration, bruising, and textural wrinkling.
- Integration of contextual storage metadata: storage location (refrigerated, frozen, room temperature), purchase date, expiration date, and exposure duration.
- Quantitative Freshness Index (0 - 100) and qualitative categorization (`Optimal`, `Fair / Consume Soon`, `Marginal / Inspect Carefully`, `Likely Spoiled / Discard`).
- Honest model state reporting: distinguishes between visual observations and microbiological safety.
- Critical Food Safety Disclaimer: emphasizes that dangerous foodborne pathogens (e.g., *Salmonella*, *Listeria*, *Botulinum*) and bacterial toxins may be present without visible spoilage.
- Spatial UI panel displaying freshness status, visual indicator checklists, actionable handling recommendations, and inspection guides.

## Dependencies
- Backend: Pillow, NumPy, Pydantic.
- Frontend: React 19, Lucide Icons, Spatial UI Design tokens.

## Implementation Tasks
- [x] Task 3.1: Build `FreshnessService` with visual indicator analyzer and multi-factor heuristic engine.
- [x] Task 3.2: Implement metadata blending algorithm (shelf-life modeling + visual evidence).
- [x] Task 3.3: Expose `/api/v1/freshness/analyze` endpoint accepting multipart image + JSON metadata.
- [x] Task 3.4: Persist freshness assessments in database with image references.
- [x] Task 3.5: Build React `FreshnessPage` with visual gauge, category selector, storage sliders, and alerts.
- [x] Task 3.6: Integrate prominent food safety disclaimer and next-step culinary actions.
- [x] Task 3.7: Write automated tests verifying freshness classification across edge-case inputs.

## Acceptance Criteria
- Users can upload a food image, specify storage conditions and age, and receive a freshness report.
- The system explains which visual and temporal indicators drove the rating.
- The UI strictly never guarantees microbiological safety purely from visual appearance.
- Low-quality or non-food images are flagged with appropriate warnings.

## Testing Checklist
- [x] Freshness score drops proportionally with increased storage age beyond typical shelf-life.
- [x] High-contrast mold or discoloration patterns trigger the `Likely Spoiled` categorization.
- [x] Food safety disclaimer is persistently visible on all output screens.
- [x] Assessments persist cleanly to the SQLite database.

## Definition of Done
The system accurately ingests perishable food images, evaluates visual signs of degradation in tandem with storage metadata, returns calibrated freshness tiers, and instructs users with practical handling advice and safety warnings.

## Status
Completed
