"use client";
import React, { useEffect, useState } from "react";
import WeatherCard from "./WeatherCard";

// 상태로 관리할 가공된 날씨 데이터 타입
interface MappedWeather {
  date: string;
  condition: string;
  max: number;
  min: number;
}

export default function WeeklyWeather() {
  const [weeklyWeather, setWeeklyWeather] = useState<MappedWeather[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch("/api/v1/weather");
        const data = await res.json();

        const today = new Date();
        const mappedData: MappedWeather[] = [7, 6, 5, 4, 3, 2, 1].map((num) => {
          const key = `${num}ago`;
          const rawData = data[key];

          // API 응답이 배열일 경우를 대비한 안전한 접근
          const dayData = Array.isArray(rawData) ? rawData[0] : rawData;

          const targetDate = new Date(today);
          targetDate.setDate(today.getDate() - num);

          return {
            date: targetDate.getDate().toString(),
            condition: dayData?.weatherType || "맑음",
            max: parseInt(dayData?.maxTemp || "0", 10),
            min: parseInt(dayData?.minTemp || "0", 10),
          };
        });

        setWeeklyWeather(mappedData);
      } catch (error) {
        console.error("날씨 정보 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (isLoading)
    return (
      <div className="mt-4 text-gray-500">날씨 정보를 불러오는 중입니다...</div>
    );

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
