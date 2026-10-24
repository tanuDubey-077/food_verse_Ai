"""FoodVerse AI — Centralized Gemini Multimodal AI Service.

Provides unified, robust, and validated Gemini integration for:
- Food image understanding & visual attribute extraction
- Freshness & spoilage observation
- Restaurant hygiene & safety compliance auditing
- Conversational culinary assistant & recipe synthesis
- Structured allergen-compliant meal planning & grocery logistics
"""

import io
import json
import logging
from typing import Any, Dict, List, Optional, Tuple
from PIL import Image, ImageOps
from pydantic import BaseModel, Field

from app.core.config import settings

logger = logging.getLogger("foodverse.gemini")


# ====================================================================
# Exception Hierarchy
# ====================================================================

class GeminiServiceError(Exception):
    """Base exception for Gemini service errors."""
    pass


class GeminiConfigurationError(GeminiServiceError):
    """Raised when GEMINI_API_KEY is missing or invalid."""
    pass


class GeminiQuotaError(GeminiServiceError):
    """Raised when Gemini quota is exhausted or rate limit is encountered."""
    pass


class GeminiTimeoutError(GeminiServiceError):
    """Raised when a request to Gemini times out."""
    pass


class GeminiNetworkError(GeminiServiceError):
    """Raised when network connectivity to Gemini fails."""
    pass


class GeminiResponseError(GeminiServiceError):
    """Raised when Gemini returns malformed or invalid output."""
    pass


class ImageValidationError(GeminiServiceError):
    """Raised when an uploaded image fails validation."""
    pass


# ====================================================================
# Structured Output Schemas (Validated with Pydantic)
# ====================================================================

class GeminiFoodAnalysis(BaseModel):
    is_food: bool = Field(
        default=True,
        description="True if the image contains edible food or beverage; False if non-food item, person, animal, or object."
    )
    dish_name: str = Field(
        description="Primary identified name of the dish or food item. If not food, identify the non-food object."
    )
    food_items: List[str] = Field(
        default_factory=list,
        description="All clearly visible food items or components on the plate."
    )
    visible_ingredients: List[str] = Field(
        default_factory=list,
        description="Ingredients that are directly visible in the image."
    )
    possible_hidden_ingredients: List[str] = Field(
        default_factory=list,
        description="Likely ingredients not directly visible (e.g. cooking fats, broths, fillings, seasonings)."
    )
    food_category: str = Field(
        default="General Food",
        description="Category e.g. Pasta, Salad, Seafood, Poultry, Dessert, Beverage, Fast Food, Produce, Non-Food."
    )
    cuisine: Optional[str] = Field(
        default=None,
        description="Culinary tradition or origin e.g. Italian, Japanese, Mexican, Mediterranean, American, Indian."
    )
    preparation_method: Optional[str] = Field(
        default=None,
        description="Visible cooking method e.g. grilled, baked, fried, raw, steamed, sauteed, braised."
    )
    visual_attributes: List[str] = Field(
        default_factory=list,
        description="Observable colors, textures, garnishes, sauces, presentation."
    )
    portion_description: str = Field(
        default="Standard single serving",
        description="Approximate visual portion description with stated uncertainty."
    )
    confidence_description: str = Field(
        default="Model-reported visual estimate",
        description="Descriptive assessment of identification confidence."
    )
    estimated_confidence: float = Field(
        default=0.90,
        description="Model-reported estimate between 0.0 and 1.0."
    )
    uncertainties: List[str] = Field(
        default_factory=list,
        description="Ambiguities, occlusions, blurry areas, or limitations in visual evidence."
    )
    explanation: str = Field(
        default="",
        description="Concise culinary explanation of why this dish was identified and visual cues used."
    )
    follow_up_questions: List[str] = Field(
        default_factory=list,
        description="Helpful follow-up questions if ambiguous or to refine recipe/nutrition."
    )
    # Estimated macros per 100g base for nutritional fallback when not in local USDA database
    estimated_calories_per_100g: Optional[float] = Field(
        default=None,
        description="Estimated energy in kcal per 100g serving"
    )
    estimated_protein_g_per_100g: Optional[float] = Field(
        default=None,
        description="Estimated protein in grams per 100g"
    )
    estimated_carbs_g_per_100g: Optional[float] = Field(
        default=None,
        description="Estimated total carbohydrates in grams per 100g"
    )
    estimated_fat_g_per_100g: Optional[float] = Field(
        default=None,
        description="Estimated total lipids/fat in grams per 100g"
    )
    estimated_fiber_g_per_100g: Optional[float] = Field(
        default=None,
        description="Estimated dietary fiber in grams per 100g"
    )
    estimated_sugar_g_per_100g: Optional[float] = Field(
        default=None,
        description="Estimated sugar in grams per 100g"
    )
    estimated_sodium_mg_per_100g: Optional[float] = Field(
        default=None,
        description="Estimated sodium in mg per 100g"
    )


class GeminiFreshnessIndicator(BaseModel):
    indicator: str = Field(
        description="Visual degradation marker name (e.g. Surface Discoloration, Mold/Fungal Growth, Bruising, Wilting, Textural Softening)."
    )
    detected: bool = Field(
        description="Whether this optical degradation marker is visible."
    )
    severity: str = Field(
        description="Severity: none, low, medium, or high."
    )
    confidence: float = Field(
        description="Confidence estimate between 0.0 and 1.0."
    )
    description: str = Field(
        description="Specific visual observation of the food's surface condition."
    )


class GeminiFreshnessAnalysis(BaseModel):
    identified_food: str = Field(
        description="Specific food item identified in the image."
    )
    category: str = Field(
        description="Category e.g. Produce, Dairy, Meat, Bakery, Seafood."
    )
    freshness_score: float = Field(
        description="Visual freshness score from 0.0 (spoiled) to 100.0 (optimal freshness)."
    )
    freshness_status: str = Field(
        description="One of: 'Optimal Freshness', 'Fair / Consume Soon', 'Marginal / Inspect Carefully', 'Likely Spoiled / Discard'."
    )
    shelf_life_remaining_days: int = Field(
        description="Estimated days remaining under indicated storage conditions."
    )
    observed_indicators: List[GeminiFreshnessIndicator] = Field(
        default_factory=list
    )
    possible_concerns: List[str] = Field(
        default_factory=list,
        description="Visible signs of degradation or decay."
    )
    relevant_limitations: List[str] = Field(
        default_factory=list,
        description="Visual assessment limitations e.g. interior not visible, microbial pathogens invisible."
    )
    suggested_next_steps: List[str] = Field(
        default_factory=list,
        description="Actionable recommendations for handling, storage, or disposal."
    )
    confidence_description: str = Field(
        description="Model confidence description."
    )
    explanation: str = Field(
        description="Detailed visual analysis explanation."
    )


class GeminiHygieneFinding(BaseModel):
    timestamp_sec: float = Field(
        default=0.0,
        description="Timestamp in seconds in the video clip or 0.0 for image."
    )
    category: str = Field(
        description="Category: 'Personal Protective Equipment', 'Surface Sanitation', 'Cross-Contamination', 'Food Storage', or 'Equipment Maintenance'."
    )
    finding: str = Field(
        description="Direct visual observation of food handler action, surface, or equipment."
    )
    severity: str = Field(
        description="Compliance severity: 'Critical', 'Major', 'Minor', or 'Compliant'."
    )
    confidence: float = Field(
        description="Model confidence estimate between 0.0 and 1.0."
    )
    remediation: str = Field(
        description="Actionable standard operating procedure or corrective action."
    )
    observation_type: str = Field(
        default="direct_observation",
        description="'direct_observation', 'possible_concern', or 'model_interpretation'."
    )


class GeminiHygieneAnalysis(BaseModel):
    overall_score: int = Field(
        description="Sanitation audit score from 0 to 100 based on observed conditions."
    )
    inspection_tier: str = Field(
        description="'Grade A — Optimal Hygiene & Sanitation', 'Grade B — Acceptable with Minor Action Items', 'Grade C — Substandard Compliance; Requires Supervisory Review', or 'Action Required — Critical Hygiene Deficiencies Detected'."
    )
    findings: List[GeminiHygieneFinding] = Field(
        default_factory=list
    )
    direct_observations: List[str] = Field(
        default_factory=list,
        description="Directly visible facts observed without speculation."
    )
    possible_concerns: List[str] = Field(
        default_factory=list,
        description="Potential safety concerns supported by visible evidence."
    )
    model_interpretations: List[str] = Field(
        default_factory=list,
        description="Model interpretations of visible workflows."
    )
    recommended_human_review: List[str] = Field(
        default_factory=list,
        description="Specific items flagged for in-person supervisor verification."
    )
    recommendations: List[str] = Field(
        default_factory=list,
        description="Key kitchen sanitation recommendations."
    )


class GeminiRecipeIngredient(BaseModel):
    name: str
    amount: str
    notes: Optional[str] = None


class GeminiRecipeStep(BaseModel):
    step_number: int
    instruction: str
    timer_sec: int = 0
    technique_tip: Optional[str] = None


class GeminiRecipe(BaseModel):
    title: str
    prep_time_min: int
    cook_time_min: int
    servings: int
    difficulty: str = "Intermediate"
    calories_per_serving: Optional[int] = None
    ingredients: List[GeminiRecipeIngredient]
    steps: List[GeminiRecipeStep]
    chef_tips: str
    allergens: List[str] = []


class GeminiCookingChatOutput(BaseModel):
    reply: str
    has_recipe: bool = False
    recipe: Optional[GeminiRecipe] = None
    suggested_questions: List[str] = []


class GeminiSubstituteItem(BaseModel):
    name: str
    ratio: str
    notes: str


class GeminiSubstituteResult(BaseModel):
    ingredient: str
    substitutes: List[GeminiSubstituteItem]
    culinary_explanation: str


class GeminiMealItem(BaseModel):
    id: str
    meal_type: str
    name: str
    calories: int
    protein_g: int
    carbs_g: int
    fat_g: int
    prep_time_min: int
    ingredients: List[str]
    rationale: str


class GeminiDayPlan(BaseModel):
    day_number: int
    day_name: str
    target_calories: int
    estimated_calories: int
    total_protein_g: int
    total_carbs_g: int
    total_fat_g: int
    meals: List[GeminiMealItem]


class GeminiMealPlanOutput(BaseModel):
    title: str
    duration_days: int
    diet_pattern: str
    allergens_excluded: List[str]
    target_daily_calories: int
    days: List[GeminiDayPlan]
    shopping_list: Dict[str, List[str]]
    nutrition_rationale: str


# ====================================================================
# Centralized Gemini Multimodal Service
# ====================================================================

class GeminiService:
    """Centralized service managing all interactions with Google Gemini API."""

    def __init__(self):
        self._client: Optional[Any] = None
        self._cached_api_key: Optional[str] = None

    @property
    def model_name(self) -> str:
        """Returns currently configured Gemini model."""
        return settings.GEMINI_MODEL or "gemini-2.5-flash"

    def is_configured(self) -> bool:
        """Checks if a valid Gemini API key is configured."""
        return settings.is_gemini_configured()

    def get_client(self) -> Any:
        """Retrieves or creates the reusable Google GenAI client."""
        api_key = settings.get_gemini_api_key()
        if not api_key:
            raise GeminiConfigurationError(
                "Gemini API is not configured. Set GEMINI_API_KEY in your environment (.env file) "
                "to enable Gemini multimodal AI features."
            )

        # Reuse existing client if key hasn't changed
        if self._client is not None and self._cached_api_key == api_key:
            return self._client

        try:
            from google import genai
            self._client = genai.Client(api_key=api_key)
            self._cached_api_key = api_key
            logger.info("Initialized Gemini client with model %s", self.model_name)
            return self._client
        except Exception as e:
            logger.error("Failed to initialize Google GenAI SDK client: %s", str(e))
            raise GeminiConfigurationError(f"Failed to initialize Gemini client: {str(e)}") from e

    def _handle_genai_exception(self, e: Exception) -> None:
        """Translates SDK / API exceptions into structured FoodVerse exceptions."""
        err_msg = str(e)
        logger.error("Gemini API call failed: %s", err_msg)

        lower_err = err_msg.lower()
        if "429" in err_msg or "resource_exhausted" in lower_err or "quota" in lower_err or "rate limit" in lower_err:
            raise GeminiQuotaError(
                "Gemini API quota exceeded or rate limit reached. "
                "Please check your Google AI Studio plan and quotas."
            ) from e
        elif "401" in err_msg or "403" in err_msg or "api_key_invalid" in lower_err or "unauthorized" in lower_err:
            raise GeminiConfigurationError(
                "Invalid Gemini API key or credentials rejected by Google AI. "
                "Please verify your GEMINI_API_KEY in the .env file."
            ) from e
        elif "timeout" in lower_err or "timed out" in lower_err or "deadline" in lower_err:
            raise GeminiTimeoutError(
                "Google Gemini API request timed out. Please try again."
            ) from e
        elif "connection" in lower_err or "network" in lower_err or "resolve" in lower_err:
            raise GeminiNetworkError(
                f"Network error connecting to Google Gemini API: {err_msg}"
            ) from e
        else:
            raise GeminiServiceError(f"Gemini service failure: {err_msg}") from e

    # ----------------------------------------------------------------
    # Image Preprocessing & Validation
    # ----------------------------------------------------------------

    @staticmethod
    def validate_and_preprocess_image(
        image_bytes: bytes,
        max_dimension: int = 2048
    ) -> Tuple[bytes, str, int, int]:
        """Validates image readability, corrects EXIF orientation, and optimizes for Gemini.

        Returns: (clean_jpeg_bytes, 'image/jpeg', width, height)
        """
        if not image_bytes or len(image_bytes) < 16:
            raise ImageValidationError("Uploaded image file is empty or too small.")

        try:
            with Image.open(io.BytesIO(image_bytes)) as img:
                # Validate format
                fmt = (img.format or "").upper()
                if fmt not in ("JPEG", "JPG", "PNG", "WEBP"):
                    raise ImageValidationError(
                        f"Unsupported image format: {fmt}. Allowed formats: JPEG, PNG, WebP."
                    )

                # Correct EXIF orientation (crucial for smartphone uploads)
                img = ImageOps.exif_transpose(img)

                # Validate dimensions
                w, h = img.size
                if w < 16 or h < 16:
                    raise ImageValidationError(f"Image dimensions too small ({w}x{h}). Minimum is 16x16.")
                if w > 12000 or h > 12000:
                    raise ImageValidationError(f"Image dimensions excessive ({w}x{h}).")

                # Resize if excessively large to avoid unnecessary upload latency while preserving quality
                if max(w, h) > max_dimension:
                    img.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
                    w, h = img.size

                # Convert to RGB if needed
                if img.mode != "RGB":
                    img = img.convert("RGB")

                # Export to clean JPEG buffer
                buf = io.BytesIO()
                img.save(buf, format="JPEG", quality=90, optimize=True)
                clean_bytes = buf.getvalue()
                return clean_bytes, "image/jpeg", w, h

        except ImageValidationError:
            raise
        except Exception as e:
            raise ImageValidationError(f"Failed to decode or parse image file: {str(e)}") from e

    # ----------------------------------------------------------------
    # 1. Food Recognition & Visual Understanding
    # ----------------------------------------------------------------

    def analyze_food_image(
        self,
        image_bytes: bytes,
        mime_type: str = "image/jpeg",
        user_query: Optional[str] = None
    ) -> GeminiFoodAnalysis:
        """Analyzes food image using Gemini Vision with structured schema validation."""
        client = self.get_client()
        from google.genai import types

        # Validate and normalize image
        clean_bytes, clean_mime, w, h = self.validate_and_preprocess_image(image_bytes)

        image_part = types.Part.from_bytes(data=clean_bytes, mime_type=clean_mime)

        prompt = (
            "You are an expert food scientist, multimodal vision analyst, and culinary chef. "
            "Examine this image carefully and provide an honest, accurate visual analysis.\n\n"
            "CRITICAL INSTRUCTIONS:\n"
            "1. FIRST, determine whether the image depicts EDIBLE FOOD or a beverage. "
            "   If it is a non-food object (e.g. animal, car, electronics, furniture, document, person), "
            "   set `is_food=false`, set `dish_name` to describe the non-food object, explain that it does not appear "
            "   to be food, and do NOT force it into a food category.\n"
            "2. If it is food:\n"
            "   - Identify the primary dish or item clearly.\n"
            "   - List all distinct visible food items on the plate.\n"
            "   - Separate directly visible ingredients from inferred possibilities.\n"
            "   - Identify cuisine, category, and visible cooking/preparation method.\n"
            "   - Note observable visual attributes (colors, textures, sauces, garnishes).\n"
            "   - Estimate portion size with stated uncertainty.\n"
            "   - Note any image ambiguities, occlusions, or blur.\n"
            "   - Estimate typical macronutrients per 100g (for fallback when not in USDA composition database).\n"
            "3. If the image is blurry, partially obscured, or ambiguous, state your uncertainty clearly "
            "   and suggest follow-up questions.\n"
            "4. NEVER invent an exact ingredient, spice, cooking method, or recipe that cannot be supported by visual evidence."
        )

        if user_query and user_query.strip():
            prompt += f"\n\nUser Context/Query: '{user_query.strip()}'. Factor this into your analysis if consistent with visual evidence."

        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=GeminiFoodAnalysis,
            temperature=0.2,
        )

        try:
            response = client.models.generate_content(
                model=self.model_name,
                contents=[image_part, prompt],
                config=config,
            )

            # Parse structured response
            if hasattr(response, "parsed") and response.parsed is not None:
                if isinstance(response.parsed, GeminiFoodAnalysis):
                    return response.parsed
                return GeminiFoodAnalysis.model_validate(response.parsed)

            raw_text = response.text or "{}"
            data = json.loads(raw_text)
            return GeminiFoodAnalysis.model_validate(data)

        except Exception as e:
            if isinstance(e, (GeminiConfigurationError, GeminiQuotaError, GeminiTimeoutError, GeminiNetworkError)):
                raise
            self._handle_genai_exception(e)
            raise

    def analyze_food_text(self, query: str) -> GeminiFoodAnalysis:
        """Analyzes a food query text description when no image is provided."""
        client = self.get_client()
        from google.genai import types

        prompt = (
            f"You are an expert food scientist and culinary chef. The user requested culinary analysis for: '{query}'.\n"
            "Analyze this dish/food item, identifying its typical ingredients, category, cuisine, preparation method, "
            "and estimated typical macronutrients per 100g. Return a structured analysis."
        )

        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=GeminiFoodAnalysis,
            temperature=0.2,
        )

        try:
            response = client.models.generate_content(
                model=self.model_name,
                contents=[prompt],
                config=config,
            )

            if hasattr(response, "parsed") and response.parsed is not None:
                if isinstance(response.parsed, GeminiFoodAnalysis):
                    return response.parsed
                return GeminiFoodAnalysis.model_validate(response.parsed)

            raw_text = response.text or "{}"
            data = json.loads(raw_text)
            return GeminiFoodAnalysis.model_validate(data)
        except Exception as e:
            self._handle_genai_exception(e)
            raise

    # ----------------------------------------------------------------
    # 2. Freshness & Spoilage Analysis
    # ----------------------------------------------------------------

    def analyze_freshness_image(
        self,
        image_bytes: bytes,
        mime_type: str = "image/jpeg",
        category: str = "Produce",
        storage_location: str = "refrigerator",
        days_stored: int = 2,
        purchase_date: Optional[str] = None,
        expiry_date: Optional[str] = None
    ) -> GeminiFreshnessAnalysis:
        """Inspects food surface degradation and freshness markers with Gemini vision."""
        client = self.get_client()
        from google.genai import types

        clean_bytes, clean_mime, _, _ = self.validate_and_preprocess_image(image_bytes)
        image_part = types.Part.from_bytes(data=clean_bytes, mime_type=clean_mime)

        prompt = (
            "You are an expert post-harvest food quality inspector and agricultural scientist. "
            "Inspect the provided food image for visible freshness and surface degradation biomarkers.\n\n"
            f"Context: Category: {category}, Storage location: {storage_location}, Stored for: {days_stored} days.\n"
            f"Purchase date: {purchase_date or 'Not provided'}, Expiry date: {expiry_date or 'Not provided'}.\n\n"
            "EVALUATION CRITERIA:\n"
            "1. Identify the specific food item in the image.\n"
            "2. Inspect for visual degradation markers: discoloration, enzymatic browning, visible mold/fungal colonies, "
            "   bruising, cuticular dehydration/wrinkling, softening, surface drying or slime.\n"
            "3. Ground each indicator in visual evidence with severity ('none', 'low', 'medium', 'high') and confidence.\n"
            "4. Calculate an honest visual freshness score (0.0 to 100.0) and choose appropriate status:\n"
            "   - 'Optimal Freshness' (85-100)\n"
            "   - 'Fair / Consume Soon' (70-84)\n"
            "   - 'Marginal / Inspect Carefully' (50-69)\n"
            "   - 'Likely Spoiled / Discard' (<50)\n"
            "5. SAFETY GUARDRAIL: You must NOT declare food microbiologically safe from appearance alone. "
            "   State clear relevant limitations (e.g. foodborne bacteria like Salmonella, Listeria, and toxins "
            "   can multiply without visible changes). Distinguish visible observations from safety conclusions.\n"
            "6. Provide sensible, food-waste-conscious next steps (cook soon, trim, or discard)."
        )

        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=GeminiFreshnessAnalysis,
            temperature=0.2,
        )

        try:
            response = client.models.generate_content(
                model=self.model_name,
                contents=[image_part, prompt],
                config=config,
            )

            if hasattr(response, "parsed") and response.parsed is not None:
                if isinstance(response.parsed, GeminiFreshnessAnalysis):
                    return response.parsed
                return GeminiFreshnessAnalysis.model_validate(response.parsed)

            raw_text = response.text or "{}"
            data = json.loads(raw_text)
            return GeminiFreshnessAnalysis.model_validate(data)
        except Exception as e:
            self._handle_genai_exception(e)
            raise

    # ----------------------------------------------------------------
    # 3. Restaurant Hygiene & Kitchen Safety Analysis
    # ----------------------------------------------------------------

    def analyze_hygiene_frames(
        self,
        frames: List[Tuple[float, bytes, str]],  # (timestamp_sec, image_bytes, mime_type)
        environment_type: str = "commercial_kitchen"
    ) -> GeminiHygieneAnalysis:
        """Audits kitchen hygiene from 1 or more video/image frames using Gemini Vision."""
        client = self.get_client()
        from google.genai import types

        if not frames:
            raise GeminiServiceError("No media frames provided for hygiene inspection.")

        parts: List[Any] = []
        timestamps_info = []

        for idx, (t_sec, b_data, m_type) in enumerate(frames):
            clean_b, clean_m, _, _ = self.validate_and_preprocess_image(b_data)
            parts.append(types.Part.from_bytes(data=clean_b, mime_type=clean_m))
            timestamps_info.append(f"Frame {idx + 1} at timestamp {t_sec:.1f}s")

        timeline_desc = ", ".join(timestamps_info)
        prompt = (
            "You are a certified HACCP hygiene auditor and commercial kitchen safety inspector. "
            f"Examine the provided kitchen media ({len(frames)} frames: {timeline_desc}). "
            f"Environment: {environment_type}.\n\n"
            "OBJECTIVES:\n"
            "1. Report ONLY supported visual observations. Distinguish:\n"
            "   - Direct visual observations (what is clearly visible: gloves, hairnets, aprons, stainless tables, covered/uncovered food).\n"
            "   - Possible concerns (e.g. potential cross-contamination zone, unmonitored prep space).\n"
            "   - Model interpretations.\n"
            "   - Recommended human review.\n"
            "2. Key inspection categories: Personal Protective Equipment, Surface Sanitation, Cross-Contamination, Food Storage, Equipment Maintenance.\n"
            "3. Assign compliance severities: 'Critical', 'Major', 'Minor', or 'Compliant' with timestamp in seconds.\n"
            "4. Calculate an overall inspection score (0 to 100) and assign inspection tier.\n"
            "5. Do NOT invent violations, do NOT claim unseen actions occurred, and do NOT certify statutory legal compliance."
        )
        parts.append(prompt)

        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=GeminiHygieneAnalysis,
            temperature=0.2,
        )

        try:
            response = client.models.generate_content(
                model=self.model_name,
                contents=parts,
                config=config,
            )

            if hasattr(response, "parsed") and response.parsed is not None:
                if isinstance(response.parsed, GeminiHygieneAnalysis):
                    return response.parsed
                return GeminiHygieneAnalysis.model_validate(response.parsed)

            raw_text = response.text or "{}"
            data = json.loads(raw_text)
            return GeminiHygieneAnalysis.model_validate(data)
        except Exception as e:
            self._handle_genai_exception(e)
            raise

    # ----------------------------------------------------------------
    # 4. Smart Cooking Assistant & Ingredient Substitutions
    # ----------------------------------------------------------------

    def cooking_assistant_chat(
        self,
        message: str,
        preferences: Optional[Any] = None,
        history: Optional[List[Any]] = None
    ) -> GeminiCookingChatOutput:
        """Conducts conversational cooking guidance, recipe synthesis, and culinary consultation."""
        client = self.get_client()
        from google.genai import types

        # Build prompt incorporating preferences and context
        pref_desc = "Standard"
        if preferences:
            pref_desc = (
                f"Diet: {getattr(preferences, 'diet', 'All')}, "
                f"Skill level: {getattr(preferences, 'skill_level', 'Intermediate')}, "
                f"Max prep time: {getattr(preferences, 'max_time_min', 30)} minutes, "
                f"Allergens to strictly avoid: {getattr(preferences, 'allergens', [])}"
            )

        history_context = ""
        if history:
            # Keep last 6 messages
            recent = history[-6:]
            turns = [f"{getattr(m, 'role', 'user')}: {getattr(m, 'content', '')}" for m in recent]
            history_context = "Recent Conversation History:\n" + "\n".join(turns) + "\n\n"

        prompt = (
            "You are the FoodVerse AI Executive Chef & Culinary Assistant. "
            "You assist home cooks and culinary professionals with step-by-step recipes, "
            "technique tips, ingredient substitutions, and meal execution.\n\n"
            f"User Preferences: {pref_desc}\n\n"
            f"{history_context}"
            f"Current User Request: '{message}'\n\n"
            "INSTRUCTIONS:\n"
            "1. If the user asks for a recipe, suggests ingredients, or asks what to cook, provide a comprehensive recipe (`has_recipe=true`) "
            "   including exact ingredient amounts, step-by-step instructions with cooking timers (seconds), technique tips, and chef tips.\n"
            "2. Respect all stated allergens and dietary restrictions strictly. Never recommend an allergen the user excluded.\n"
            "3. If the query is conversational or about a culinary technique/question, provide a clear, helpful reply with `has_recipe=false`.\n"
            "4. Provide 3 contextually relevant follow-up questions."
        )

        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=GeminiCookingChatOutput,
            temperature=0.3,
        )

        try:
            response = client.models.generate_content(
                model=self.model_name,
                contents=[prompt],
                config=config,
            )

            if hasattr(response, "parsed") and response.parsed is not None:
                if isinstance(response.parsed, GeminiCookingChatOutput):
                    return response.parsed
                return GeminiCookingChatOutput.model_validate(response.parsed)

            raw_text = response.text or "{}"
            data = json.loads(raw_text)
            return GeminiCookingChatOutput.model_validate(data)
        except Exception as e:
            self._handle_genai_exception(e)
            raise

    def get_ingredient_substitution(
        self,
        ingredient: str,
        context: Optional[str] = None
    ) -> GeminiSubstituteResult:
        """Finds scientifically sound culinary substitutions using Gemini."""
        client = self.get_client()
        from google.genai import types

        prompt = (
            f"You are a food scientist and professional chef. What are the best culinary substitutes for '{ingredient}'?\n"
            f"Context / Dish: '{context or 'General cooking or baking'}'\n\n"
            "Provide 2 to 4 viable substitutes with exact replacement ratios (e.g. 1:1, 3:1), usage notes, "
            "and a culinary explanation of how the substitution behaves in cooking chemistry."
        )

        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=GeminiSubstituteResult,
            temperature=0.2,
        )

        try:
            response = client.models.generate_content(
                model=self.model_name,
                contents=[prompt],
                config=config,
            )

            if hasattr(response, "parsed") and response.parsed is not None:
                if isinstance(response.parsed, GeminiSubstituteResult):
                    return response.parsed
                return GeminiSubstituteResult.model_validate(response.parsed)

            raw_text = response.text or "{}"
            data = json.loads(raw_text)
            return GeminiSubstituteResult.model_validate(data)
        except Exception as e:
            self._handle_genai_exception(e)
            raise

    # ----------------------------------------------------------------
    # 5. Personalized Meal Planner & Grocery Logistics
    # ----------------------------------------------------------------

    def generate_meal_plan(
        self,
        duration_days: int,
        diet_pattern: str,
        allergens_to_avoid: List[str],
        target_daily_calories: int,
        include_snacks: bool = True,
        budget_tier: str = "moderate"
    ) -> GeminiMealPlanOutput:
        """Generates a complete, structured, allergen-compliant multi-day meal plan."""
        client = self.get_client()
        from google.genai import types

        day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

        prompt = (
            "You are a certified nutrition planning specialist and executive chef. "
            "Create a personalized, delicious, and balanced meal plan.\n\n"
            f"PARAMETERS:\n"
            f"- Duration: {duration_days} days\n"
            f"- Dietary pattern: {diet_pattern}\n"
            f"- Target calories: {target_daily_calories} kcal/day\n"
            f"- Include snacks: {include_snacks}\n"
            f"- Budget tier: {budget_tier}\n"
            f"- ALLERGENS TO STRICTLY AVOID: {allergens_to_avoid}\n\n"
            "STRICT RULES:\n"
            "1. NEVER include ANY declared allergen in any meal or ingredient. This is a critical food safety constraint.\n"
            "2. For each day (Day 1 through Day N), provide Breakfast, Lunch, Dinner, and optionally Snack.\n"
            "3. For each meal item provide: id, meal_type, name, estimated calories, protein_g, carbs_g, fat_g, prep_time_min, ingredients list, and culinary rationale.\n"
            "4. Calculate accurate daily totals matching target calories reasonably (+- 10%).\n"
            "5. Compile an organized shopping list categorized by grocery store aisle: "
            "'Fresh Produce', 'Proteins & Seafood', 'Dairy & Alternatives', 'Pantry & Grains', 'Spices & Oils'.\n"
            "6. Provide a concise nutrition rationale explaining how this plan supports the user's goals."
        )

        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=GeminiMealPlanOutput,
            temperature=0.3,
        )

        try:
            response = client.models.generate_content(
                model=self.model_name,
                contents=[prompt],
                config=config,
            )

            if hasattr(response, "parsed") and response.parsed is not None:
                if isinstance(response.parsed, GeminiMealPlanOutput):
                    return response.parsed
                return GeminiMealPlanOutput.model_validate(response.parsed)

            raw_text = response.text or "{}"
            data = json.loads(raw_text)
            return GeminiMealPlanOutput.model_validate(data)
        except Exception as e:
            self._handle_genai_exception(e)
            raise


# Reusable singleton instance
gemini_service = GeminiService()
