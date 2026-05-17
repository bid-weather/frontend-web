"use client";

import React from "react";
import { useWeather } from "@/hooks/useApi";

const BAR_MAX_HEIGHT = 100;

interface Props {
  type: string;
}

export default function RainfallChart({ type }: Props) {
  const { data: weatherData, isLoading } = useWeather();

  const chartColor =
    type === "rain"
      ? "bg-blue-500"
      : type === "humidity"
        ? "bg-cyan-500"
        : "bg-emerald-500";

  const data = React.useMemo(() => {
    if (!weatherData) return [];
    const today = new Date();
    const keys = Object.keys(weatherData).sort((a, b) => {
      const numA = parseInt(a.replace("ago", ""));
      const numB = parseInt(b.replace("ago", ""));
      return numB - numA;
    });
    return keys.map((key) => {
      const daysAgo = parseInt(key.replace("ago", ""));
      const date = new Date(today);
      date.setDate(today.getDate() - daysAgo);
      const day = weatherData[key];
      return {
        label: `${date.getMonth() + 1}/${date.getDate()}`,
        rain: day?.precipitation ?? 0,
        humidity: day?.humidity ?? 0,
        wind: day?.dailyMaxWindSpeed ?? 0,
      };
    });
  }, [weatherData]);

  if (isLoading) {
    return (
      <div
        className="bg-white rounded-2xl p-5 flex items-center justify-center"
        style={{ height: "140px" }}
      >
        <span className="text-gray-400 text-sm">불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5">
      <div className="flex gap-0">
        {/* Y-axis */}
        <div
          className="relative pr-3 text-[11px] text-gray-400 text-right shrink-0"
          style={{ height: `${BAR_MAX_HEIGHT}px`, width: "36px" }}
        >
          {[
            {
              label: type === "rain" ? "많음" : type === "humidity" ? "높음" : "강함",
              top: "20%",
            },
            { label: "보통", top: "48%" },
            {
              label: type === "rain" ? "적음" : type === "humidity" ? "낮음" : "약함",
              top: "77%",
            },
          ].map(({ label, top }) => (
            <span
              key={label}
              className="absolute right-3 -translate-y-1/2"
              style={{ top }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 flex flex-col relative">
          {/* Grid */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {[15, 40, 65].map((top, i) => (
              <div
                key={i}
                className="absolute w-full border-t border-gray-200"
                style={{ top: `${top}%` }}
              />
            ))}
          </div>

          {/* Bars */}
          <div
            className="flex items-end gap-[6px] border-b border-gray-100 z-10"
            style={{ height: `${BAR_MAX_HEIGHT}px` }}
          >
            {data.map((item) => {
              const value =
                type === "rain"
                  ? item.rain
                  : type === "humidity"
                    ? item.humidity
                    : item.wind;

              const unit =
                type === "rain" ? "mm" : type === "humidity" ? "%" : "m/s";
              const max =
                type === "rain"
                  ? 50
                  : type === "humidity"
                    ? 100
                    : 20;

              const heightPx =
                value > 0 ? Math.max((value / max) * BAR_MAX_HEIGHT, 4) : 0;

              return (
                <div
                  key={item.label}
                  className="flex-1 flex items-end justify-center group relative"
                >
                  {value > 0 && (
                    <>
                      <div className="absolute bottom-full mb-1 hidden group-hover:block z-20">
                        <div className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                          {value}
                          {unit}
                        </div>
                      </div>
                      <div
                        className={`w-[15px] rounded-t-sm transition-all duration-500 cursor-pointer ${chartColor}`}
                        style={{ height: `${heightPx}px` }}
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* X-axis */}
          <div className="flex gap-[6px] pt-1">
            {data.map((item) => (
              <div
                key={item.label}
                className="flex-1 text-center text-[11px] text-gray-400"
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
