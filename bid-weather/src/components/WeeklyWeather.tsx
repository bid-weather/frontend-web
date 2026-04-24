"use client";

import React from "react";
import WeatherCard from "./WeatherCard";

interface RawWeatherData {
  maxTemp: string;
  minTemp: string;
  rain: string;
  humidity: string;
  dayMaxWindSpeed: string;
  condition: string;
}

export default function WeeklyWeather() {
  // 더미 데이터
  const serverData: Record<string, RawWeatherData> = {
    "1ago": {
      maxTemp: "24",
      minTemp: "11",
      rain: "0",
      humidity: "45",
      dayMaxWindSpeed: "2",
      condition: "맑음",
    },
    "2ago": {
      maxTemp: "18",
      minTemp: "5",
      rain: "0",
      humidity: "50",
      dayMaxWindSpeed: "15",
      condition: "강풍",
    },
    "3ago": {
      maxTemp: "20",
      minTemp: "8",
      rain: "100",
      humidity: "95",
      dayMaxWindSpeed: "12",
      condition: "비",
    },
    "4ago": {
      maxTemp: "22",
      minTemp: "10",
      rain: "0",
      humidity: "85",
      dayMaxWindSpeed: "5",
      condition: "흐림",
    },
    "5ago": {
      maxTemp: "25",
      minTemp: "12",
      rain: "0",
      humidity: "40",
      dayMaxWindSpeed: "3",
      condition: "구름 조금",
    },
    "6ago": {
      maxTemp: "28",
      minTemp: "14",
      rain: "0",
      humidity: "70",
      dayMaxWindSpeed: "4",
      condition: "맑음",
    },
    "7ago": {
      maxTemp: "30",
      minTemp: "15",
      rain: "80",
      humidity: "90",
      dayMaxWindSpeed: "8",
      condition: "비",
    },
  };

  const today = new Date();

  // 날짜 계산 및 데이터 맵핑
  const weeklyWeather = [7, 6, 5, 4, 3, 2, 1].map((num) => {
    const key = `${num}ago`;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - num);

    const dayData = serverData[key];

    return {
      date: targetDate.getDate().toString(),
      condition: dayData?.condition || "맑음",
      max: parseInt(dayData?.maxTemp || "0"),
      min: parseInt(dayData?.minTemp || "0"),
    };
  });

  return (
    <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mt-4">
      {weeklyWeather.map((weather, idx) => (
        <WeatherCard
          key={idx}
          date={weather.date}
          condition={weather.condition}
          maxTemp={weather.max}
          minTemp={weather.min}
        />
      ))}
    </div>
  );
}
