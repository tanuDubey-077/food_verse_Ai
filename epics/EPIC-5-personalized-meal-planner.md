# EPIC 5: Personalized Meal Planner Development

## Objective
Develop a personalized meal-planning engine that translates individual dietary patterns, strict allergen restrictions, caloric targets, macro distributions, and lifestyle constraints into structured, actionable multi-day meal plans complete with consolidated grocery lists.

## Scope
- Configuration of comprehensive dietary profiles:
  - Dietary Patterns: Omnivore, Vegetarian, Vegan, Ketogenic, Mediterranean, High-Protein, Low-Carb, Paleo.
  - Strict Allergen Exclusions: Peanuts, Tree Nuts, Dairy, Gluten/Wheat, Shellfish, Eggs, Soy, Fish, Sesame.
  - Calorie and Macronutrient Distribution Targets (Carbs / Protein / Fat ratios).
  - Meal Frequency: 3 Meals, 4 Meals, or 3 Meals + 2 Snacks.
  - Cooking Time and Budget Tier preferences.
- Multi-day meal plan generation (1-Day Snapshot or 7-Day Complete Weekly Schedule).
- Meal itemization: Breakfast, Lunch, Dinner, and Snacks with estimated calories, macros, prep time, and culinary rationale ("Why this was selected").
- Strict Allergen Guardrail: Guaranteed exclusion of specified allergens prior to recommendation delivery.
- Consolidated Grocery Shopping List: Aggregates all required ingredients across the planned days, categorized by supermarket aisle (Produce, Dairy & Eggs, Proteins, Pantry & Grains, Spices).
- Interactive Plan Operations: Swap/regenerate individual meals, save plans to database, and export to JSON or formatted text.

## Dependencies
- Backend: Pydantic, SQLAlchemy.
- Frontend: React 19, Lucide Icons, Spatial UI Design tokens.

## Implementation Tasks
- [x] Task 5.1: Implement backend `MealPlanningService` with constraint solver and recipe synthesis.
- [x] Task 5.2: Enforce strict allergen exclusion verification pipeline.
- [x] Task 5.3: Build grocery list compiler aggregating ingredients by grocery department.
- [x] Task 5.4: Build `/api/v1/meals/generate`, `/api/v1/meals`, and `/api/v1/meals/{id}` endpoints.
- [x] Task 5.5: Persist meal plans and user preferences in `MealPlanRecord` and `UserProfileRecord`.
- [x] Task 5.6: Build React `MealPlannerPage` with wizard controls, weekly calendar view, macro summary, and grocery drawer.
- [x] Task 5.7: Implement meal swap/regeneration and export functionality.
- [x] Task 5.8: Write automated tests verifying allergen exclusion and macro calculations.

## Acceptance Criteria
- User can configure custom dietary profiles and generate coherent meal plans.
- Allergen exclusions are strictly respected; excluded allergens never appear in recipes or shopping lists.
- Grocery lists correctly group ingredients across all days without item duplication.
- Plans can be saved, retrieved, and exported.
- Transparent disclaimer clarifies that meal plans do not constitute clinical or medical nutrition therapy.

## Testing Checklist
- [x] Specifying a peanut allergy strictly prevents peanut ingredients in any generated meal.
- [x] 7-day plan aggregates calories and macronutrients with reasonable daily variance.
- [x] Grocery shopping list categorizes items by aisle (Produce, Pantry, Dairy, etc.).
- [x] Saved meal plans reload accurately from the database.

## Definition of Done
The meal planning module enables users to generate, customize, save, and export nutritionally balanced meal schedules with strict allergen compliance and automated grocery logistics.

## Status
Completed
