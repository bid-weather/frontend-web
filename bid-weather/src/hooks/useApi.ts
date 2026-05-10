import { useQuery } from "@tanstack/react-query";
import {
  fetchSystemTime,
  fetchCategories,
  fetchSubcategories,
  fetchWeather,
  fetchPredictionGraph,
  fetchPredictionCalendar,
} from "@/lib/api";

export const useSystemTime = () =>
  useQuery({
    queryKey: ["systemTime"],
    queryFn: fetchSystemTime,
    refetchInterval: 60000,
  });

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

export const useSubcategories = (categoryId: string) =>
  useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: () => fetchSubcategories(categoryId),
    enabled: !!categoryId,
  });

export const useWeather = () =>
  useQuery({
    queryKey: ["weather"],
    queryFn: fetchWeather,
  });

export const usePredictionGraph = (categoryId?: string, subcategoryId?: string) =>
  useQuery({
    queryKey: ["predictionGraph", categoryId, subcategoryId],
    queryFn: () => fetchPredictionGraph(categoryId, subcategoryId),
  });

export const usePredictionCalendar = (categoryId?: string, subcategoryId?: string) =>
  useQuery({
    queryKey: ["predictionCalendar", categoryId, subcategoryId],
    queryFn: () => fetchPredictionCalendar(categoryId, subcategoryId),
  });
