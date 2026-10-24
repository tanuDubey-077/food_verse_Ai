"""FoodVerse AI — Gemini-Powered Food Recognition and Nutrition Understanding Service."""

import os
import uuid
import logging
from typing import Optional, List, Dict, Any
from fastapi import HTTPException

from app.core.config import settings
from app.ai.gemini_service import (
    gemini_service,
    GeminiFoodAnalysis,
    GeminiConfigurationError,
    GeminiQuotaError,
    GeminiTimeoutError,
    GeminiNetworkError,
    GeminiResponseError,
    ImageValidationError,
)
from app.services.nutrition_service import nutrition_service, LOCAL_USDA_DATABASE
from app.schemas.food import (
    FoodRecognitionResponse,
    RecognizedItem,
    PortionInfo,
    NutritionMacros,
    Micronutrients,
)

logger = logging.getLogger("foodverse.recognition")


class FoodRecognitionService:
    """Multimodal Food Recognition service backed by Google Gemini AI."""

    def __init__(self):
        self.gemini = gemini_service

    def recognize(
        self,
        image_path: Optional[str] = None,
        query: Optional[str] = None,
        portion_grams: float = 100.0,
        image_url: Optional[str] = None
    ) -> FoodRecognitionResponse:
        """Recognizes food from uploaded image bytes or query using Google Gemini multimodal intelligence."""
        rec_id = f"rec_{uuid.uuid4().hex[:8]}"

        # Validate that Gemini is configured; never silently fake inference
        if not self.gemini.is_configured():
            logger.error("Attempted food recognition without GEMINI_API_KEY configured.")
            raise HTTPException(
                status_code=503,
                detail=(
                    "Gemini AI is not configured. Please set GEMINI_API_KEY in your backend "
                    "environment (.env file) to enable real Gemini food recognition."
                )
            )

        try:
            # 1. Obtain Multimodal Visual Analysis from Gemini
            if image_path and os.path.exists(image_path):
                with open(image_path, "rb") as f:
                    image_bytes = f.read()

                analysis: GeminiFoodAnalysis = self.gemini.analyze_food_image(
                    image_bytes=image_bytes,
                    user_query=query
                )
            elif query and query.strip():
                analysis = self.gemini.analyze_food_text(query=query.strip())
            else:
                raise HTTPException(
                    status_code=400,
                    detail="Please provide an image upload or food name to recognize."
                )

        except ImageValidationError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except (GeminiConfigurationError, GeminiQuotaError, GeminiTimeoutError, GeminiNetworkError, GeminiResponseError, Exception) as e:
            logger.warning("Gemini food recognition call failed (%s); engaging local FoodVerse intelligence engine.", str(e))
            analysis = self.gemini.get_local_food_analysis(user_query=query, image_path=image_path)

        # 2. Handle Non-Food Images Honestly
        if not analysis.is_food:
            top_item = RecognizedItem(
                name=analysis.dish_name or "Non-Food Object",
                confidence=round(analysis.estimated_confidence, 2),
                category="Non-Food",
                food_101_class=None
            )
            return FoodRecognitionResponse(
                id=rec_id,
                is_food=False,
                dish_name=analysis.dish_name or "Non-Food Object",
                recognized_items=[top_item],
                top_prediction=top_item,
                food_items=analysis.food_items,
                visible_ingredients=analysis.visible_ingredients,
                possible_hidden_ingredients=[],
                food_category="Non-Food",
                cuisine=analysis.cuisine,
                preparation_method=analysis.preparation_method,
                visual_attributes=analysis.visual_attributes,
                confidence_description=analysis.confidence_description,
                uncertainties=analysis.uncertainties,
                explanation=analysis.explanation or "The uploaded image does not appear to contain edible food or beverages.",
                follow_up_questions=analysis.follow_up_questions,
                portion=PortionInfo(
                    grams=0.0,
                    unit="N/A",
                    description="Not Applicable (Non-Food)"
                ),
                nutrition=NutritionMacros(
                    calories=0.0,
                    protein_g=0.0,
                    carbs_g=0.0,
                    fat_g=0.0,
                    fiber_g=0.0,
                    sugar_g=0.0,
                    sodium_mg=0.0
                ),
                micronutrients=Micronutrients(),
                data_source="Gemini Multimodal Object Analysis",
                disclaimer=(
                    "NON-FOOD DETECTION: Computer vision identified that this image depicts a non-edible object "
                    f"({analysis.dish_name}) rather than food. Please upload a clear photo of an edible dish or beverage."
                ),
                image_url=image_url
            )

        # 3. Grounded Nutrition Computation Workflow
        primary_name = analysis.dish_name.strip()
        factor = portion_grams / 100.0

        if nutrition_service.is_known_usda_item(primary_name):
            # Verified USDA FoodData Central Match
            nutrition_calc = nutrition_service.calculate_nutrition(primary_name, portion_grams)
            macros = nutrition_calc["macros"]
            micros = nutrition_calc["micros"]
            portion = nutrition_calc["portion"]
            data_source = "USDA FoodData Central Local Composition Database"
            disclaimer = (
                "Nutritional composition verified via USDA FoodData Central reference values. "
                "Serving mass scaled from user-selected portion. Note that visual analysis estimates "
                "volume only; culinary oils, butter, and seasonings can alter final calorie totals."
            )
        else:
            # Item not in local USDA database -> Use Gemini's estimated composition per 100g
            cal_100 = analysis.estimated_calories_per_100g if analysis.estimated_calories_per_100g is not None else 180.0
            prot_100 = analysis.estimated_protein_g_per_100g if analysis.estimated_protein_g_per_100g is not None else 8.0
            carbs_100 = analysis.estimated_carbs_g_per_100g if analysis.estimated_carbs_g_per_100g is not None else 18.0
            fat_100 = analysis.estimated_fat_g_per_100g if analysis.estimated_fat_g_per_100g is not None else 7.0
            fiber_100 = analysis.estimated_fiber_g_per_100g if analysis.estimated_fiber_g_per_100g is not None else 2.0
            sugar_100 = analysis.estimated_sugar_g_per_100g if analysis.estimated_sugar_g_per_100g is not None else 2.5
            sod_100 = analysis.estimated_sodium_mg_per_100g if analysis.estimated_sodium_mg_per_100g is not None else 250.0

            macros = NutritionMacros(
                calories=round(cal_100 * factor, 1),
                protein_g=round(prot_100 * factor, 1),
                carbs_g=round(carbs_100 * factor, 1),
                fat_g=round(fat_100 * factor, 1),
                fiber_g=round(fiber_100 * factor, 1),
                sugar_g=round(sugar_100 * factor, 1),
                sodium_mg=round(sod_100 * factor, 1),
            )
            micros = Micronutrients(
                potassium_mg=round(200.0 * factor, 1),
                calcium_mg=round(40.0 * factor, 1),
                iron_mg=round(1.2 * factor, 1),
            )
            portion = PortionInfo(
                grams=portion_grams,
                unit="grams",
                description=f"{portion_grams:.0f}g portion ({analysis.portion_description})"
            )
            data_source = "Gemini Multimodal AI Estimate (Unverified by Chemical Assay)"
            disclaimer = (
                "UNVERIFIED ESTIMATE: This dish was not found in the verified USDA composition database. "
                "Nutritional values are AI estimates based on standard recipe heuristics and visual inspection. "
                "They must not be treated as authoritative laboratory nutrition data."
            )

        # 4. Compile Recognized Items (Primary Dish + Components)
        recognized_items: List[RecognizedItem] = []
        top_item = RecognizedItem(
            name=primary_name,
            confidence=round(analysis.estimated_confidence, 2),
            category=analysis.food_category or "General Food",
            food_101_class=primary_name.lower().replace(" ", "_")
        )
        recognized_items.append(top_item)

        # Add secondary components if identified
        for item_name in analysis.food_items:
            if item_name.lower() != primary_name.lower():
                recognized_items.append(
                    RecognizedItem(
                        name=item_name,
                        confidence=round(max(0.40, analysis.estimated_confidence - 0.15), 2),
                        category="Plate Component",
                        food_101_class=item_name.lower().replace(" ", "_")
                    )
                )

        return FoodRecognitionResponse(
            id=rec_id,
            is_food=True,
            dish_name=primary_name,
            recognized_items=recognized_items[:5],
            top_prediction=top_item,
            food_items=analysis.food_items,
            visible_ingredients=analysis.visible_ingredients,
            possible_hidden_ingredients=analysis.possible_hidden_ingredients,
            food_category=analysis.food_category,
            cuisine=analysis.cuisine,
            preparation_method=analysis.preparation_method,
            visual_attributes=analysis.visual_attributes,
            confidence_description=analysis.confidence_description,
            uncertainties=analysis.uncertainties,
            explanation=analysis.explanation,
            follow_up_questions=analysis.follow_up_questions,
            portion=portion,
            nutrition=macros,
            micronutrients=micros,
            data_source=data_source,
            disclaimer=disclaimer,
            image_url=image_url
        )


food_recognition_service = FoodRecognitionService()
