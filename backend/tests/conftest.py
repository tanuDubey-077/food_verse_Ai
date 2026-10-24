import io
from PIL import Image
import pytest
from unittest.mock import MagicMock, patch

from app.ai.gemini_service import (
    GeminiFoodAnalysis,
    GeminiFreshnessAnalysis,
    GeminiFreshnessIndicator,
    GeminiHygieneAnalysis,
    GeminiHygieneFinding,
    GeminiCookingChatOutput,
    GeminiRecipe,
    GeminiRecipeIngredient,
    GeminiRecipeStep,
    GeminiSubstituteResult,
    GeminiSubstituteItem,
    GeminiMealPlanOutput,
    GeminiShoppingCategory,
    GeminiDayPlan,
    GeminiMealItem,
)


@pytest.fixture
def mock_gemini_food_analysis():
    return GeminiFoodAnalysis(
        is_food=True,
        dish_name="Grilled Salmon with Asparagus",
        food_items=["Grilled Salmon Fillet", "Grilled Asparagus Spears", "Lemon Wedge"],
        visible_ingredients=["Salmon fillet", "Green asparagus", "Lemon slice", "Olive oil drizzle"],
        possible_hidden_ingredients=["Butter", "Sea salt", "Black pepper"],
        food_category="Seafood",
        cuisine="Mediterranean",
        preparation_method="Grilled / Pan-Seared",
        visual_attributes=["Golden sear marks", "Flaky pink flesh", "Charred vegetable tips"],
        portion_description="Single grilled salmon fillet with 4-5 asparagus spears (~180g)",
        confidence_description="High visual confidence based on distinctive sear texture and salmon pigmentation",
        estimated_confidence=0.96,
        uncertainties=["Cooking oil and hidden seasoning amounts cannot be confirmed without laboratory assays"],
        explanation="Fresh Atlantic salmon fillet seared with tender-crisp asparagus spears and citrus garnish.",
        follow_up_questions=["Was this prepared with olive oil or butter?", "Did you eat the salmon skin?"],
        estimated_calories_per_100g=180.0,
        estimated_protein_g_per_100g=20.0,
        estimated_carbs_g_per_100g=2.0,
        estimated_fat_g_per_100g=10.0,
        estimated_fiber_g_per_100g=1.0,
        estimated_sugar_g_per_100g=0.5,
        estimated_sodium_mg_per_100g=150.0
    )


@pytest.fixture
def mock_gemini_non_food_analysis():
    return GeminiFoodAnalysis(
        is_food=False,
        dish_name="Mechanical Wristwatch",
        food_items=[],
        visible_ingredients=[],
        possible_hidden_ingredients=[],
        food_category="Non-Food",
        cuisine=None,
        preparation_method=None,
        visual_attributes=["Metallic bezel", "Leather watch strap", "Glass crystal face"],
        portion_description="Non-edible timepiece",
        confidence_description="Very high confidence that this is a manufactured personal accessory",
        estimated_confidence=0.99,
        uncertainties=[],
        explanation="The uploaded image depicts a metallic wristwatch, which is not an edible food item.",
        follow_up_questions=[],
        estimated_calories_per_100g=0.0,
        estimated_protein_g_per_100g=0.0,
        estimated_carbs_g_per_100g=0.0,
        estimated_fat_g_per_100g=0.0,
        estimated_fiber_g_per_100g=0.0,
        estimated_sugar_g_per_100g=0.0,
        estimated_sodium_mg_per_100g=0.0
    )


@pytest.fixture
def mock_gemini_freshness_analysis():
    return GeminiFreshnessAnalysis(
        identified_food="Fresh Baby Spinach",
        category="Produce",
        freshness_score=88.0,
        freshness_status="Optimal Freshness",
        shelf_life_remaining_days=5,
        observed_indicators=[
            GeminiFreshnessIndicator(
                indicator="Turgor & Firmness",
                detected=True,
                severity="none",
                confidence=0.92,
                description="Leaves are crisp, upright, and display vibrant green chlorophyll density."
            ),
            GeminiFreshnessIndicator(
                indicator="Discoloration / Wilting",
                detected=False,
                severity="none",
                confidence=0.95,
                description="No chlorosis, yellowing, or browning along margins."
            )
        ],
        possible_concerns=["Leafy greens rapidly degrade if exposed to condensing moisture."],
        relevant_limitations=["Sub-surface microbial counts cannot be measured from optical imagery alone."],
        suggested_next_steps=[
            "Store in a breathable container with a dry paper towel to absorb excess moisture.",
            "Maintain refrigerator temperature between 1°C and 4°C."
        ],
        confidence_description="High optical clarity of leaf margins and cellular structure.",
        explanation="Leaves exhibit strong turgor pressure and uniform deep green pigmentation."
    )


@pytest.fixture
def mock_gemini_hygiene_analysis():
    return GeminiHygieneAnalysis(
        overall_score=85,
        inspection_tier="Grade A — Optimal Hygiene & Sanitation",
        findings=[
            GeminiHygieneFinding(
                timestamp_sec=0.0,
                category="Cross-Contamination",
                finding="Separate color-coded cutting boards visible on prep line.",
                severity="Compliant",
                confidence=0.90,
                remediation="Maintain color-coding protocol.",
                observation_type="direct_observation"
            ),
            GeminiHygieneFinding(
                timestamp_sec=1.5,
                category="Food Storage",
                finding="Uncovered secondary container on low prep shelf.",
                severity="Minor",
                confidence=0.82,
                remediation="Cover and date-label all secondary ingredient containers.",
                observation_type="possible_concern"
            )
        ],
        direct_observations=[
            "Stainless steel food preparation table is wiped down and clear of standing liquid.",
            "Sanitizer bucket present near dishwashing zone."
        ],
        possible_concerns=["Ensure walk-in temperatures are logged twice daily."],
        model_interpretations=["Lighting conditions are adequate for safe culinary operations."],
        recommended_human_review=[
            "Verify probe thermometer calibration records.",
            "Verify chlorine/quats test strip readings in sanitizer buckets."
        ],
        recommendations=[
            "Label and date all prepped items in refrigerator.",
            "Ensure sneeze guard glass is wiped between shift changes."
        ]
    )


@pytest.fixture
def mock_gemini_cooking_chat():
    return GeminiCookingChatOutput(
        reply="Here is a delicious, healthy Lemon Herb Seared Chicken recipe perfect for a quick 25-minute weeknight dinner!",
        has_recipe=True,
        recipe=GeminiRecipe(
            title="Lemon Herb Pan-Seared Chicken",
            prep_time_min=10,
            cook_time_min=15,
            servings=2,
            difficulty="Intermediate",
            calories_per_serving=340,
            ingredients=[
                GeminiRecipeIngredient(name="Boneless Skinless Chicken Breast", amount="2 breasts (approx 400g)", notes="Pounded to even 1/2 inch thickness"),
                GeminiRecipeIngredient(name="Fresh Lemon Juice", amount="2 tbsp"),
                GeminiRecipeIngredient(name="Baby Spinach", amount="2 cups"),
                GeminiRecipeIngredient(name="Extra Virgin Olive Oil", amount="1 tbsp")
            ],
            steps=[
                GeminiRecipeStep(step_number=1, instruction="Pat chicken dry and season with sea salt and cracked pepper.", timer_sec=120, technique_tip="Dry chicken ensures a golden sear."),
                GeminiRecipeStep(step_number=2, instruction="Heat skillet over medium-high heat with olive oil. Sear chicken 5-6 min per side until 165°F.", timer_sec=600, technique_tip="Do not crowd the skillet."),
                GeminiRecipeStep(step_number=3, instruction="Deglaze with lemon juice and toss in spinach until just wilted.", timer_sec=120)
            ],
            chef_tips="Rest chicken for 3-4 minutes on a cutting board before slicing to retain savory juices.",
            allergens=[]
        ),
        suggested_questions=[
            "How do I keep chicken breast from drying out?",
            "What side dishes pair best with this chicken?",
            "Can I substitute chicken thighs?"
        ]
    )


@pytest.fixture
def mock_gemini_substitute():
    return GeminiSubstituteResult(
        ingredient="buttermilk",
        substitutes=[
            GeminiSubstituteItem(
                name="Milk + Lemon Juice or White Vinegar",
                ratio="1 cup milk + 1 tbsp lemon juice / vinegar (let sit 5 min)",
                notes="Acid curdles milk slightly, recreating the tangy flavor and pH needed to activate baking soda."
            ),
            GeminiSubstituteItem(
                name="Plain Yogurt + Water",
                ratio="3/4 cup plain yogurt + 1/4 cup water or milk",
                notes="Delivers comparable acidity and lactic acid richness for marinades and quick breads."
            )
        ],
        culinary_explanation="Buttermilk provides both lactic acidity and moisture. Acidity reacts with chemical leaveners (baking soda) to create tender baked textures."
    )


@pytest.fixture
def mock_gemini_meal_plan():
    return GeminiMealPlanOutput(
        title="7-Day Mediterranean Heart-Healthy Plan",
        duration_days=7,
        diet_pattern="Mediterranean",
        allergens_excluded=["Dairy", "Fish"],
        target_daily_calories=2100,
        days=[
            GeminiDayPlan(
                day_number=1,
                day_name="Monday",
                target_calories=2100,
                estimated_calories=2080,
                total_protein_g=115,
                total_carbs_g=230,
                total_fat_g=78,
                meals=[
                    GeminiMealItem(
                        id="meal-1-1",
                        meal_type="Breakfast",
                        name="Overnight Rolled Oats with Chia and Berries",
                        calories=480,
                        protein_g=16,
                        carbs_g=72,
                        fat_g=14,
                        prep_time_min=5,
                        ingredients=["Rolled oats", "Almond beverage", "Chia seeds", "Blueberries", "Walnuts"],
                        rationale="High soluble fiber for sustained morning glucose control."
                    ),
                    GeminiMealItem(
                        id="meal-1-2",
                        meal_type="Lunch",
                        name="Mediterranean Lentil and Quinoa Salad",
                        calories=650,
                        protein_g=28,
                        carbs_g=84,
                        fat_g=22,
                        prep_time_min=15,
                        ingredients=["Brown lentils", "Quinoa", "Cucumbers", "Cherry tomatoes", "Kalamata olives", "Extra virgin olive oil"],
                        rationale="Plant protein and monounsaturated fatty acids."
                    ),
                    GeminiMealItem(
                        id="meal-1-3",
                        meal_type="Dinner",
                        name="Herbed Grilled Chicken with Roasted Asparagus and Sweet Potato",
                        calories=720,
                        protein_g=58,
                        carbs_g=54,
                        fat_g=28,
                        prep_time_min=25,
                        ingredients=["Chicken breast", "Asparagus", "Sweet potato", "Olive oil", "Rosemary", "Garlic"],
                        rationale="Lean protein with complex carbohydrates and micronutrients."
                    ),
                    GeminiMealItem(
                        id="meal-1-4",
                        meal_type="Snack",
                        name="Apple Slices with Handful of Raw Almonds",
                        calories=230,
                        protein_g=6,
                        carbs_g=20,
                        fat_g=14,
                        prep_time_min=3,
                        ingredients=["Fuji apple", "Raw almonds"],
                        rationale="Crisp fiber and healthy fats."
                    )
                ]
            )
        ],
        shopping_list=[
            GeminiShoppingCategory(
                category="Produce",
                items=["Asparagus", "Blueberries", "Cherry tomatoes", "Cucumbers", "Fuji apple", "Garlic", "Sweet potato"]
            ),
            GeminiShoppingCategory(
                category="Pantry & Grains",
                items=["Raw almonds", "Chia seeds", "Extra virgin olive oil", "Kalamata olives", "Quinoa", "Rolled oats", "Brown lentils"]
            ),
            GeminiShoppingCategory(
                category="Meat & Poultry",
                items=["Chicken breast"]
            ),
            GeminiShoppingCategory(
                category="Plant Beverages",
                items=["Unsweetened almond drink"]
            )
        ],
        nutrition_rationale="Personalized Mediterranean nutritional plan generated with allergen exclusions. Focuses on healthy fats, high fiber, and lean protein."
    )


def create_test_image_bytes(color=(200, 50, 50), size=(100, 100)) -> bytes:
    img = Image.new("RGB", size, color=color)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()
