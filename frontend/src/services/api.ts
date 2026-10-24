import {
  SystemHealth,
  FoodRecognitionResult,
  FreshnessResult,
  HygieneResult,
  CookingChatResponse,
  SubstituteResponse,
  MealPlanResult,
  HistoryListResponse,
  SystemSettingsResponse,
  UserProfileSettings
} from '../types';

const DEFAULT_API_BASE = 'http://localhost:8000/api/v1';

const API_BASE = (() => {
  const rawValue = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE;
  const normalized = String(rawValue).trim().replace(/\/+$/, '');

  if (!normalized) {
    return DEFAULT_API_BASE;
  }

  if (normalized.endsWith('/api/v1')) {
    return normalized;
  }

  if (normalized.includes('/api/v1')) {
    return normalized.replace(/\/+$/, '');
  }

  return `${normalized}/api/v1`;
})();

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = `Request failed with status ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      // Ignore JSON parse error on non-json body
    }
    throw new Error(errorDetail);
  }
  return res.json();
}

export const api = {
  // System Health
  async getHealth(): Promise<SystemHealth> {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse<SystemHealth>(res);
  },

  // Food Recognition & Nutrition
  async recognizeFood(file?: File, query?: string, portionGrams = 100): Promise<FoodRecognitionResult> {
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (query) formData.append('query', query);
    formData.append('portion_grams', portionGrams.toString());

    const res = await fetch(`${API_BASE}/food/recognize`, {
      method: 'POST',
      body: formData
    });
    return handleResponse<FoodRecognitionResult>(res);
  },

  async getNutrition(itemName: string, portionGrams = 100) {
    const res = await fetch(`${API_BASE}/food/nutrition?item_name=${encodeURIComponent(itemName)}&portion_grams=${portionGrams}`);
    return handleResponse<any>(res);
  },

  // Freshness & Spoilage Detection
  async analyzeFreshness(
    file: File,
    category: string,
    storageLocation: string,
    daysStored: number,
    purchaseDate?: string,
    expiryDate?: string
  ): Promise<FreshnessResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('storage_location', storageLocation);
    formData.append('days_stored', daysStored.toString());
    if (purchaseDate) formData.append('purchase_date', purchaseDate);
    if (expiryDate) formData.append('expiry_date', expiryDate);

    const res = await fetch(`${API_BASE}/freshness/analyze`, {
      method: 'POST',
      body: formData
    });
    return handleResponse<FreshnessResult>(res);
  },

  // Restaurant Hygiene & Safety
  async analyzeHygiene(file: File, environmentType = 'commercial_kitchen'): Promise<HygieneResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('environment_type', environmentType);

    const res = await fetch(`${API_BASE}/hygiene/analyze`, {
      method: 'POST',
      body: formData
    });
    return handleResponse<HygieneResult>(res);
  },

  // Smart Cooking Assistant
  async cookingChat(message: string, preferences?: any, history?: any[]): Promise<CookingChatResponse> {
    const res = await fetch(`${API_BASE}/cooking/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, preferences, history: history || [] })
    });
    return handleResponse<CookingChatResponse>(res);
  },

  async getSubstitute(ingredient: string, context?: string): Promise<SubstituteResponse> {
    const res = await fetch(`${API_BASE}/cooking/substitute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredient, context })
    });
    return handleResponse<SubstituteResponse>(res);
  },

  // Personalized Meal Planner
  async generateMealPlan(payload: {
    duration_days: number;
    diet_pattern: string;
    allergens_to_avoid: string[];
    target_daily_calories: number;
    macro_ratio?: Record<string, number>;
    meals_per_day?: number;
    include_snacks?: boolean;
    budget_tier?: string;
  }): Promise<MealPlanResult> {
    const res = await fetch(`${API_BASE}/meals/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse<MealPlanResult>(res);
  },

  async listMealPlans(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/meals`);
    return handleResponse<any[]>(res);
  },

  async getMealPlan(id: string): Promise<MealPlanResult> {
    const res = await fetch(`${API_BASE}/meals/${id}`);
    return handleResponse<MealPlanResult>(res);
  },

  async deleteMealPlan(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/meals/${id}`, { method: 'DELETE' });
    return handleResponse<any>(res);
  },

  // History & Audit
  async getHistory(moduleType?: string, page = 1, pageSize = 15): Promise<HistoryListResponse> {
    let url = `${API_BASE}/history?page=${page}&page_size=${pageSize}`;
    if (moduleType && moduleType !== 'all') {
      url += `&module_type=${encodeURIComponent(moduleType)}`;
    }
    const res = await fetch(url);
    return handleResponse<HistoryListResponse>(res);
  },

  async getHistoryDetail(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/history/${id}`);
    return handleResponse<any>(res);
  },

  async deleteHistory(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE' });
    return handleResponse<any>(res);
  },

  async exportHistory(moduleType?: string): Promise<any> {
    let url = `${API_BASE}/history/export`;
    if (moduleType && moduleType !== 'all') {
      url += `?module_type=${encodeURIComponent(moduleType)}`;
    }
    const res = await fetch(url);
    return handleResponse<any>(res);
  },

  // Settings & Profile
  async getSettings(): Promise<SystemSettingsResponse> {
    const res = await fetch(`${API_BASE}/settings`);
    return handleResponse<SystemSettingsResponse>(res);
  },

  async updateProfile(profile: UserProfileSettings): Promise<UserProfileSettings> {
    const res = await fetch(`${API_BASE}/settings/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    return handleResponse<UserProfileSettings>(res);
  }
};
