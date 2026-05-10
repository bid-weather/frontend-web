import apiClient from "./axios";
import type {
  SystemTimeResponse,
  CategoriesResponse,
  SubcategoriesResponse,
  WeatherResponse,
  PredictionGraphResponse,
  PredictionCalendarResponse,
} from "@/types/api";

export const fetchSystemTime = () =>
  apiClient.get<SystemTimeResponse>("/api/v1/system/time").then((res) => res.data);

export const fetchCategories = () =>
  apiClient.get<CategoriesResponse>("/api/v1/categories").then((res) => res.data);

export const fetchAllSubcategories = () =>
  apiClient.get<SubcategoriesResponse>("/api/v1/subcategories").then((res) => res.data);

export const fetchSubcategories = (categoryId: string) =>
  apiClient
    .get<SubcategoriesResponse>(`/api/v1/categories/${categoryId}/subcategories`)
    .then((res) => res.data);

export const fetchWeather = () =>
  apiClient.get<WeatherResponse>("/api/v1/weather").then((res) => res.data);

export const fetchPredictionGraph = (categoryId?: string, subcategoryId?: string) =>
  apiClient
    .get<PredictionGraphResponse>("/api/v1/predictions/graph", {
      params: { categoryId, subcategoryId },
    })
    .then((res) => res.data);

export const fetchPredictionCalendar = (categoryId?: string, subcategoryId?: string) =>
  apiClient
    .get<PredictionCalendarResponse>("/api/v1/predictions/calendar", {
      params: { categoryId, subcategoryId },
    })
    .then((res) => res.data);
