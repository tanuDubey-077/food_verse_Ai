"""FoodVerse AI — Gemini-Powered Smart Cooking Assistant Service."""

import logging
from typing import Optional, List, Dict, Any
from fastapi import HTTPException

from app.core.config import settings
from app.ai.gemini_service import (
    gemini_service,
    GeminiCookingChatOutput,
    GeminiSubstituteResult,
    GeminiConfigurationError,
    GeminiQuotaError,
    GeminiTimeoutError,
    GeminiNetworkError,
    GeminiResponseError,
)
from app.schemas.cooking import (
    CookingChatRequest,
    CookingChatResponse,
    Recipe,
    RecipeIngredient,
    RecipeStep,
    SubstituteRequest,
    SubstituteResponse,
    SubstituteOption,
)

logger = logging.getLogger("foodverse.cooking")


class CookingAssistantService:
    """Conversational culinary intelligence backed by Google Gemini AI."""

    def __init__(self):
        self.gemini = gemini_service

    def chat(self, request: CookingChatRequest) -> CookingChatResponse:
        """Handles conversational cooking assistance, personalized recipes, and culinary queries."""
        if not self.gemini.is_configured():
            logger.error("Cooking assistant invoked without GEMINI_API_KEY configured.")
            raise HTTPException(
                status_code=503,
                detail=(
                    "Gemini AI is not configured. Please set GEMINI_API_KEY in your backend "
                    "environment (.env file) to chat with the Gemini Cooking Assistant."
                )
            )

        try:
            gemini_out: GeminiCookingChatOutput = self.gemini.cooking_assistant_chat(
                message=request.message,
                preferences=request.preferences,
                history=request.history
            )
        except GeminiQuotaError as e:
            raise HTTPException(status_code=429, detail=str(e))
        except GeminiTimeoutError as e:
            raise HTTPException(status_code=504, detail=str(e))
        except GeminiConfigurationError as e:
            raise HTTPException(status_code=503, detail=str(e))
        except (GeminiNetworkError, GeminiResponseError) as e:
            raise HTTPException(status_code=502, detail=str(e))
        except HTTPException:
            raise
        except Exception as e:
            logger.exception("Unexpected error in cooking assistant: %s", str(e))
            raise HTTPException(status_code=500, detail=f"Cooking assistant error: {str(e)}")

        recipe: Optional[Recipe] = None
        if gemini_out.has_recipe and gemini_out.recipe:
            g_rec = gemini_out.recipe
            ingredients = [
                RecipeIngredient(name=ing.name, amount=ing.amount, notes=ing.notes)
                for ing in g_rec.ingredients
            ]
            steps = [
                RecipeStep(
                    step_number=st.step_number,
                    instruction=st.instruction,
                    timer_sec=st.timer_sec,
                    technique_tip=st.technique_tip
                )
                for st in g_rec.steps
            ]
            recipe = Recipe(
                title=g_rec.title,
                prep_time_min=g_rec.prep_time_min,
                cook_time_min=g_rec.cook_time_min,
                servings=g_rec.servings,
                difficulty=g_rec.difficulty,
                calories_per_serving=g_rec.calories_per_serving,
                ingredients=ingredients,
                steps=steps,
                chef_tips=g_rec.chef_tips,
                allergens=g_rec.allergens or []
            )

        return CookingChatResponse(
            reply=gemini_out.reply,
            recipe=recipe,
            suggested_questions=gemini_out.suggested_questions
        )

    def substitute(self, ingredient_or_request: Any, context: Optional[str] = None) -> SubstituteResponse:
        """Provides intelligent culinary science substitutions using Gemini."""
        if isinstance(ingredient_or_request, SubstituteRequest):
            ingredient = ingredient_or_request.ingredient
            ctx = ingredient_or_request.context
        else:
            ingredient = str(ingredient_or_request)
            ctx = context

        if not self.gemini.is_configured():
            logger.error("Ingredient substitution invoked without GEMINI_API_KEY configured.")
            raise HTTPException(
                status_code=503,
                detail=(
                    "Gemini AI is not configured. Please set GEMINI_API_KEY in your backend "
                    "environment (.env file) to look up ingredient substitutions."
                )
            )

        try:
            gemini_sub: GeminiSubstituteResult = self.gemini.get_ingredient_substitution(
                ingredient=ingredient,
                context=ctx
            )
        except GeminiQuotaError as e:
            raise HTTPException(status_code=429, detail=str(e))
        except GeminiTimeoutError as e:
            raise HTTPException(status_code=504, detail=str(e))
        except GeminiConfigurationError as e:
            raise HTTPException(status_code=503, detail=str(e))
        except (GeminiNetworkError, GeminiResponseError) as e:
            raise HTTPException(status_code=502, detail=str(e))
        except HTTPException:
            raise
        except Exception as e:
            logger.exception("Unexpected error in substitution: %s", str(e))
            raise HTTPException(status_code=500, detail=f"Substitution lookup failed: {str(e)}")

        substitutes = [
            SubstituteOption(name=sub.name, ratio=sub.ratio, notes=sub.notes)
            for sub in gemini_sub.substitutes
        ]

        return SubstituteResponse(
            ingredient=gemini_sub.ingredient,
            substitutes=substitutes,
            culinary_explanation=gemini_sub.culinary_explanation
        )


cooking_assistant_service = CookingAssistantService()
