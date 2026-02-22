// API client for NutriDash Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request<{
      user: any;
      token: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async register(email: string, password: string, name: string) {
    const response = await this.request<{
      user: any;
      token: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    this.clearToken();
    // Optionally call logout endpoint
    // await this.request('/auth/logout', { method: 'POST' });
  }

  // Users
  async getProfile() {
    return this.request<{ user: any }>('/users/profile');
  }

  async updateProfile(data: any) {
    return this.request<{ user: any }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Meals
  async getMeals(params: {
    page?: number;
    limit?: number;
    search?: string;
    dietType?: string;
    mealTime?: string;
    planType?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const query = searchParams.toString();
    return this.request<{ meals: any[]; pagination: any }>(
      `/meals${query ? `?${query}` : ''}`
    );
  }

  async getMeal(id: string) {
    return this.request<any>(`/meals/${id}`);
  }

  // Cart
  async getCart() {
    return this.request<{
      items: any[];
      summary: {
        subtotal: number;
        totalItems: number;
        totalCalories: number;
        totalProtein: number;
      };
    }>('/cart');
  }

  async addToCart(mealId: string, quantity: number) {
    return this.request<{ cartItem: any }>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ mealId, quantity }),
    });
  }

  async updateCartItem(id: string, quantity: number) {
    return this.request<{ cartItem: any }>(`/cart/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(id: string) {
    return this.request(`/cart/items/${id}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart', {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders(params: { page?: number; limit?: number; status?: string } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const query = searchParams.toString();
    return this.request<{ orders: any[]; pagination: any }>(
      `/orders${query ? `?${query}` : ''}`
    );
  }

  async createOrder(data: {
    deliveryAddress: any;
    paymentMethod: string;
    couponCode?: string;
    scheduledFor?: string;
    paymentDetails?: any;
  }) {
    return this.request<{ order: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrder(id: string) {
    return this.request<{ order: any }>(`/orders/${id}`);
  }

  async cancelOrder(id: string) {
    return this.request<{ order: any }>(`/orders/${id}/cancel`, {
      method: 'PUT',
    });
  }

  async trackOrder(id: string) {
    return this.request<any>(`/orders/${id}/track`);
  }

  // Recommendations
  async getRecommendations() {
    return this.request<{
      recommendations: any[];
      userProfile: any;
    }>('/recommendations');
  }

  async refreshRecommendations() {
    return this.request<{
      recommendations: any[];
      userProfile: any;
    }>('/recommendations/refresh', {
      method: 'POST',
    });
  }

  // Ratings
  async createRating(mealId: string, rating: number, review?: string) {
    return this.request<{ rating: any }>('/ratings', {
      method: 'POST',
      body: JSON.stringify({ mealId, rating, review }),
    });
  }

  async getMealRatings(mealId: string, page = 1, limit = 10) {
    return this.request<{
      ratings: any[];
      pagination: any;
      avgRating: number;
      totalRatings: number;
    }>(`/ratings/meal/${mealId}?page=${page}&limit=${limit}`);
  }

  // Progress
  async addWeightEntry(weight: number, date: string, notes?: string) {
    return this.request<{ weightEntry: any }>('/progress/weight', {
      method: 'POST',
      body: JSON.stringify({ weight, date, notes }),
    });
  }

  async getWeightHistory(limit = 30) {
    return this.request<{ weightEntries: any[] }>(`/progress/weight?limit=${limit}`);
  }

  async getAnalytics(period = 30) {
    return this.request<any>(`/progress/analytics?period=${period}`);
  }

  // Notifications
  async getNotifications(page = 1, limit = 20, unreadOnly = false) {
    return this.request<{
      notifications: any[];
      pagination: any;
      unreadCount: number;
    }>(`/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`);
  }

  async markNotificationRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsRead() {
    return this.request('/notifications/mark-all-read', {
      method: 'PUT',
    });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;

// Export types for TypeScript
export type { ApiResponse };