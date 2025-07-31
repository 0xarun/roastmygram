// API service for communicating with the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface InstagramProfile {
  username: string;
  fullName: string | null;
  bio: string | null;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  profilePicUrl: string | null;
  isPrivate: boolean;
  isVerified: boolean;
  externalUrl: string | null;
  scrapedAt: string;
}

export interface Roast {
  id: string;
  text: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  createdAt: string;
}

export interface RoastResponse {
  success: boolean;
  data: {
    user: User;
    profile: InstagramProfile;
    roast: Roast;
    stats: {
      userRoastCount: number;
      totalUsers: number;
      totalRoasts: number;
    };
    recentRoasts: Roast[];
  };
  message: string;
}

export interface StatsResponse {
  success: boolean;
  data: {
    totalUsers: number;
    totalRoasts: number;
  };
  message: string;
}

export interface UserRoastsResponse {
  success: boolean;
  data: {
    user: User;
    roastCount: number;
    roasts: Roast[];
  };
  message: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get a roast for a username
  async getRoast(username: string): Promise<RoastResponse> {
    return this.request<RoastResponse>('/api/roasts', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
  }

  // Get overall statistics
  async getStats(): Promise<StatsResponse> {
    return this.request<StatsResponse>('/api/roasts/stats');
  }

  // Get roasts for a specific user
  async getUserRoasts(username: string): Promise<UserRoastsResponse> {
    return this.request<UserRoastsResponse>(`/api/roasts/user/${username}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string; timestamp: string }> {
    return this.request('/health');
  }
}

export const apiService = new ApiService(); 