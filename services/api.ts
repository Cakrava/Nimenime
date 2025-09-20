import { API_BASE_URL } from '../constants';
import { Anime, AnimeFull, Genre, User, ApiResponse } from '../types';

const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async <T,>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

const apiFetch = async <T,>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
  });
  return handleResponse<T>(response);
};

// Auth
export const registerUser = (data: any) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) });
export const loginUser = (data: any) => apiFetch<{token: string}>('/auth/login', { method: 'POST', body: JSON.stringify(data) });

// User
export const getUserProfile = () => apiFetch<ApiResponse<User>>('/user/profile');
export const getUserFavorites = () => apiFetch<ApiResponse<Anime[]>>('/user/favorites');

// Anime
export const getTopAnime = (filter: string, limit: number) => apiFetch<ApiResponse<Anime[]>>(`/top/anime?filter=${filter}&limit=${limit}`);
export const getSeasonNow = (limit: number) => apiFetch<ApiResponse<Anime[]>>(`/seasons/now?limit=${limit}`);
export const getCompletedAnime = (limit: number) => apiFetch<ApiResponse<Anime[]>>(`/anime?status=complete&order_by=score&sort=desc&limit=${limit}`);
export const getAnimeById = (id: string) => apiFetch<ApiResponse<AnimeFull>>(`/anime/${id}/full`);
export const getGenres = () => apiFetch<ApiResponse<Genre[]>>('/genres/anime');
export const getAnimeList = (params: Record<string, string | number>) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiFetch<ApiResponse<Anime[]>>(`/anime?${query}`);
};
export const getSchedule = (day: string) => apiFetch<ApiResponse<Anime[]>>(`/schedules?filter=${day}`);
export const searchAnime = (query: string, page: number = 1) => getAnimeList({ q: query, page, limit: 20 });