export interface SystemTimeResponse {
  date: string;
  time: string;
}

export interface CategoriesResponse {
  categories: string[];
}

export interface SubcategoriesResponse {
  subcategories: string[];
}

export interface WeatherDay {
  weatherType: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  humidity: number;
  dailyMaxWindSpeed: number;
}

export interface WeatherResponse {
  [key: string]: WeatherDay;
}

export interface GraphDataItem {
  period: string;
  actualCount: number | null;
  predictCount: number | null;
}

export interface PredictionGraphResponse {
  graphData: GraphDataItem[];
}

export interface PredictionDay {
  date: string;
  count: number;
}

export interface PredictionCalendarResponse {
  predictions: PredictionDay[];
}
