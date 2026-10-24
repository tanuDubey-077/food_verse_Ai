# FoodVerse AI — API Documentation
**Base URL:** `http://localhost:8000/api/v1`  
**Protocol:** HTTP/1.1 & HTTP/2  
**Format:** `application/json` & `multipart/form-data`  

---

## 1. System & Health Endpoints

### `GET /health`
Returns system liveness, version, active AI providers, and timestamp.
- **Response `200 OK`**:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2026-10-19T14:00:00Z",
  "providers": {
    "llm": "local",
    "vision": "local",
    "nutrition": "local"
  },
  "database": "connected"
}
```

### `GET /health/readiness`
Checks readiness of file storage, database read/write, and AI model subsystems.

---

## 2. Food Recognition & Nutrition Endpoints

### `POST /food/recognize`
Analyzes an uploaded food image or manual text description.
- **Request:** `multipart/form-data`
  - `file`: Optional image file (JPEG, PNG, WebP)
  - `query`: Optional manual text string (e.g., "Avocado toast with poached egg")
  - `portion_grams`: Float (default 100.0)
- **Response `200 OK`**:
```json
{
  "id": "rec_3fa85f64",
  "recognized_items": [
    {
      "name": "Avocado Toast",
      "confidence": 0.94,
      "category": "Breakfast / Toast",
      "food_101_class": "avocado_toast"
    }
  ],
  "portion": {
    "grams": 150.0,
    "unit": "grams",
    "description": "Standard serving (1 slice)"
  },
  "nutrition": {
    "calories": 280.0,
    "protein_g": 6.5,
    "carbs_g": 24.0,
    "fat_g": 18.0,
    "fiber_g": 7.2,
    "sugar_g": 1.8,
    "sodium_mg": 320.0
  },
  "micronutrients": {
    "potassium_mg": 450.0,
    "vitamin_c_mg": 8.0,
    "calcium_mg": 35.0,
    "iron_mg": 1.6
  },
  "data_source": "USDA FoodData Central Local Composition Database",
  "disclaimer": "Nutritional calculations are estimates based on standard references and assume typical portion density."
}
```

### `GET /food/nutrition`
Retrieves nutritional breakdown for a specific food query.
- **Query Params:** `item_name` (string), `portion_grams` (float, default 100.0)

---

## 3. Freshness & Spoilage Endpoints

### `POST /freshness/analyze`
Evaluates perishable food items using visual computer vision heuristics and storage context.
- **Request:** `multipart/form-data`
  - `file`: Required image file
  - `category`: String (e.g., `Produce`, `Dairy`, `Meat`, `Bakery`)
  - `storage_location`: String (`refrigerator`, `freezer`, `pantry`)
  - `days_stored`: Integer (e.g., 4)
  - `purchase_date`: Optional ISO date
  - `expiry_date`: Optional ISO date
- **Response `200 OK`**:
```json
{
  "id": "frsh_7819ab",
  "category": "Produce",
  "freshness_score": 82.5,
  "status": "Fair / Consume Soon",
  "shelf_life_remaining_days": 2,
  "observed_indicators": [
    {
      "indicator": "Minor surface dehydration",
      "detected": true,
      "severity": "low",
      "confidence": 0.88
    },
    {
      "indicator": "Fungal / Mold mycelium",
      "detected": false,
      "severity": "none",
      "confidence": 0.95
    }
  ],
  "recommendations": [
    "Trim minor softened outer peel.",
    "Consume or prepare within 48 hours.",
    "Maintain refrigeration below 4°C (40°F)."
  ],
  "safety_disclaimer": "Visual analysis cannot detect invisible bacterial pathogens (e.g., Listeria, Salmonella) or chemical toxins. When in doubt, discard."
}
```

---

## 4. Restaurant Hygiene & Kitchen Safety Endpoints

### `POST /hygiene/analyze`
Inspects kitchen photos or video recordings for food handling compliance.
- **Request:** `multipart/form-data`
  - `file`: Image or Video file
  - `environment_type`: String (`commercial_kitchen`, `prep_station`, `storage`)
- **Response `200 OK`**:
```json
{
  "id": "hyg_55a210",
  "overall_score": 78,
  "inspection_tier": "B - Minor Infractions Noted",
  "frames_analyzed": 12,
  "observations": [
    {
      "timestamp_sec": 4.5,
      "category": "Personal Protective Equipment",
      "finding": "Operator handling cooked food with bare hands.",
      "severity": "Major",
      "confidence": 0.91,
      "remediation": "Enforce mandatory single-use glove protocol during ready-to-eat assembly."
    },
    {
      "timestamp_sec": 8.0,
      "category": "Surface Cleanliness",
      "finding": "Stainless prep surface clean and sanitized.",
      "severity": "Compliant",
      "confidence": 0.96,
      "remediation": "Maintain sanitation schedule."
    }
  ],
  "summary": {
    "critical_count": 0,
    "major_count": 1,
    "minor_count": 1,
    "compliant_count": 10
  },
  "disclaimer": "Computer vision hygiene audits serve as assistive training tools and do not constitute statutory public health compliance certifications."
}
```

---

## 5. Smart Cooking Assistant Endpoints

### `POST /cooking/chat`
Conversational cooking queries, recipe generation, and culinary advice.
- **Request:** `application/json`
```json
{
  "message": "I have chicken breast, garlic, lemon, and spinach. What can I make in 20 minutes?",
  "preferences": {
    "diet": "low-carb",
    "skill_level": "intermediate",
    "max_time_min": 25
  },
  "history": []
}
```
- **Response `200 OK`**:
```json
{
  "reply": "Here is a vibrant 20-minute Mediterranean Lemon-Garlic Chicken with Sautéed Spinach...",
  "recipe": {
    "title": "20-Minute Lemon-Garlic Chicken & Wilted Spinach",
    "prep_time_min": 5,
    "cook_time_min": 15,
    "servings": 2,
    "ingredients": [
      {"name": "Boneless Chicken Breast", "amount": "400g", "notes": "sliced into cutlets"},
      {"name": "Fresh Spinach", "amount": "200g", "notes": "washed"},
      {"name": "Garlic", "amount": "3 cloves", "notes": "minced"},
      {"name": "Lemon", "amount": "1 whole", "notes": "juiced and zested"}
    ],
    "steps": [
      {"step_number": 1, "instruction": "Season chicken cutlets with salt and pepper.", "timer_sec": 0},
      {"step_number": 2, "instruction": "Sear cutlets in olive oil over medium-high heat for 4 minutes per side.", "timer_sec": 240},
      {"step_number": 3, "instruction": "Add minced garlic and spinach; toss until wilted (2 min). Deglaze with lemon juice.", "timer_sec": 120}
    ],
    "chef_tips": "Pounding chicken cutlets to an even 1/2-inch thickness ensures fast, even cooking without drying out."
  }
}
```

### `POST /cooking/substitute`
Suggests culinary substitutions based on available pantry items and dietary needs.

---

## 6. Personalized Meal Planner Endpoints

### `POST /meals/generate`
Generates a 1-day or 7-day meal plan respecting dietary patterns and strict allergen exclusions.
- **Request:** `application/json`
```json
{
  "duration_days": 7,
  "diet_pattern": "Mediterranean",
  "allergens_to_avoid": ["Peanuts", "Shellfish"],
  "target_daily_calories": 2100,
  "macro_ratio": {"protein": 30, "carbs": 45, "fat": 25},
  "meals_per_day": 3,
  "include_snacks": true,
  "budget_tier": "moderate"
}
```
- **Response `200 OK`**:
```json
{
  "id": "mp_991823",
  "diet_pattern": "Mediterranean",
  "days": [
    {
      "day_number": 1,
      "day_name": "Monday",
      "target_calories": 2100,
      "estimated_calories": 2080,
      "meals": [
        {
          "meal_type": "Breakfast",
          "name": "Greek Yogurt Bowl with Honey and Berries",
          "calories": 420,
          "protein_g": 24,
          "carbs_g": 48,
          "fat_g": 12,
          "prep_time_min": 5,
          "rationale": "High protein breakfast to maintain satiety."
        }
      ]
    }
  ],
  "shopping_list": {
    "Produce": ["Greek Yogurt", "Fresh Strawberries", "Blueberries"],
    "Proteins": ["Salmon fillets", "Chicken breast"],
    "Pantry": ["Extra virgin olive oil", "Rolled oats", "Honey"]
  }
}
```

---

## 7. History & Settings Endpoints

- `GET /history`: List past analysis runs with pagination and module filtering (`food_recognition`, `freshness`, `hygiene`, `meal_plan`).
- `GET /history/{id}`: Detailed inspection of a specific past analysis.
- `DELETE /history/{id}`: Purges an analysis record and associated media.
- `GET /history/export`: Exports analysis history as JSON or CSV.
- `GET /settings`: Retrieves user preferences.
- `PUT /settings`: Updates user dietary patterns and allergen preferences.
