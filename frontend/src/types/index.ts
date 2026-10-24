export interface SystemHealth {
  status: string;
  version: string;
  timestamp: string;
  providers: {
    llm: string;
    vision: string;
    nutrition: string;
  };
  database: string;
}

export interface RecognizedItem {
  name: string;
  confidence: number;
  category: string;
  food_101_class?: string;
}

export interface PortionInfo {
  grams: number;
  unit: string;
  description: string;
}

export interface NutritionMacros {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
}

export interface Micronutrients {
  potassium_mg?: number;
  vitamin_c_mg?: number;
  calcium_mg?: number;
  iron_mg?: number;
  cholesterol_mg?: number;
}

export interface FoodRecognitionResult {
  id: string;
  is_food?: boolean;
  dish_name?: string;
  recognized_items: RecognizedItem[];
  top_prediction: RecognizedItem;
  food_items?: string[];
  visible_ingredients?: string[];
  possible_hidden_ingredients?: string[];
  food_category?: string;
  cuisine?: string;
  preparation_method?: string;
  visual_attributes?: string[];
  confidence_description?: string;
  uncertainties?: string[];
  explanation?: string;
  follow_up_questions?: string[];
  portion: PortionInfo;
  nutrition: NutritionMacros;
  micronutrients: Micronutrients;
  data_source: string;
  disclaimer: string;
  image_url?: string;
}

export interface VisualIndicator {
  indicator: string;
  detected: boolean;
  severity: string;
  confidence: number;
  description: string;
}

export interface FreshnessResult {
  id: string;
  category: string;
  food_name: string;
  freshness_score: number;
  status: string;
  shelf_life_remaining_days: number;
  observed_indicators: VisualIndicator[];
  storage_context: {
    storage_location: string;
    days_stored: number;
    purchase_date?: string;
    expiry_date?: string;
    reference_shelf_life_days: number;
  };
  recommendations: string[];
  possible_concerns?: string[];
  relevant_limitations?: string[];
  confidence_description?: string;
  explanation?: string;
  safety_disclaimer: string;
  image_url?: string;
}

export interface HygieneObservation {
  timestamp_sec: number;
  category: string;
  finding: string;
  severity: 'Critical' | 'Major' | 'Minor' | 'Compliant';
  confidence: number;
  remediation: string;
  frame_url?: string;
}

export interface HygieneSummary {
  critical_count: number;
  major_count: number;
  minor_count: number;
  compliant_count: number;
}

export interface HygieneResult {
  id: string;
  overall_score: number;
  inspection_tier: string;
  frames_analyzed: number;
  media_type: string;
  summary: HygieneSummary;
  observations: HygieneObservation[];
  direct_observations?: string[];
  possible_concerns?: string[];
  model_interpretations?: string[];
  recommended_human_review?: string[];
  recommendations: string[];
  disclaimer: string;
  media_url?: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  notes?: string;
}

export interface RecipeStep {
  step_number: number;
  instruction: string;
  timer_sec: number;
  technique_tip?: string;
}

export interface Recipe {
  title: string;
  prep_time_min: number;
  cook_time_min: number;
  servings: number;
  difficulty: string;
  calories_per_serving?: number;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  chef_tips: string;
  allergens: string[];
}

export interface CookingChatResponse {
  reply: string;
  recipe?: Recipe;
  suggested_questions: string[];
}

export interface SubstituteOption {
  name: string;
  ratio: string;
  notes: string;
}

export interface SubstituteResponse {
  ingredient: string;
  substitutes: SubstituteOption[];
  culinary_explanation: string;
}

export interface MealItem {
  id: string;
  meal_type: string;
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  prep_time_min: number;
  ingredients: string[];
  rationale: string;
}

export interface DayMealPlan {
  day_number: number;
  day_name: string;
  target_calories: number;
  estimated_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  meals: MealItem[];
}

export interface MealPlanResult {
  id: string;
  title: string;
  duration_days: number;
  diet_pattern: string;
  allergens_excluded: string[];
  target_daily_calories: number;
  days: DayMealPlan[];
  shopping_list: Record<string, string[]>;
  disclaimer: string;
}

export interface HistorySummaryItem {
  id: string;
  module_type: string;
  title: string;
  summary?: string;
  confidence?: number;
  input_type: string;
  file_path?: string;
  created_at: string;
}

export interface HistoryListResponse {
  total_count: number;
  page: number;
  page_size: number;
  items: HistorySummaryItem[];
}

export interface UserProfileSettings {
  username: string;
  display_name: string;
  dietary_pattern: string;
  allergens: string[];
  daily_calorie_target: number;
  macro_ratios: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface SystemSettingsResponse {
  profile: UserProfileSettings;
  environment: string;
  providers: {
    llm: string;
    vision: string;
    nutrition: string;
  };
  version: string;
  max_upload_size_mb: number;
  gemini_configured?: boolean;
  gemini_model?: string;
}
