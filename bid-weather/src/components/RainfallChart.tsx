"use client";

import React from "react";

const data = [
  {
    date: 1,
    rain: 80,
    humidity: 90,
    wind: 8,
  },
  {
    date: 2,
    rain: 20,
    humidity: 60,
    wind: 3,
  },
  {
    date: 3,
    rain: 55,
    humidity: 72,
    wind: 5,
  },
  {
    date: 4,
    rain: 90,
    humidity: 95,
    wind: 9,
  },
  {
    date: 5,
    rain: 35,
    humidity: 58,
    wind: 4,
  },
  {
    date: 6,
    rain: 10,
    humidity: 40,
    wind: 2,
  },
  {
    date: 7,
    rain: 70,
    humidity: 88,
    wind: 7,
  },
];

const BAR_MAX_HEIGHT = 100;

interface Props {
  type: string;
}

export default function RainfallChart({ type }: Props) {
  const chartColor =
    type === "rain"
      ? "bg-blue-500"
      : type === "humidity"
        ? "bg-cyan-500"
        : "bg-emerald-500";

  return (
    <div className="bg-white rounded-2xl p-5">
      <div className="flex gap-0">
        {/* Y-axis */}
        <div
          className="flex flex-col justify-between pr-3 text-[11px] text-gray-400 text-right shrink-0"
          style={{ height: `${BAR_MAX_HEIGHT}px` }}
        >
          {["많음", "보통", "적음", ""].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 flex flex-col relative">
          {/* Grid */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {[25, 50, 75].map((top, i) => (
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

              const max = type === "wind" ? 10 : 100;

              const heightPx = Math.max((value / max) * BAR_MAX_HEIGHT, 3);

              return (
                <div
                  key={item.date}
                  className="flex-1 flex items-end justify-center"
                >
                  <div
                    className={`w-[15px] rounded-t-sm transition-all duration-500 ${chartColor}`}
                    style={{ height: `${heightPx}px` }}
                  />
                </div>
              );
            })}
          </div>

          {/* X-axis */}
          <div className="flex gap-[6px] pt-1">
            {data.map((item) => (
              <div
                key={item.date}
                className="flex-1 text-center text-[11px] text-gray-400"
              >
                {item.date}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
