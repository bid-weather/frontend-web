"use client";

import React from "react";

interface RainfallData {
  date: number;
  level: "many" | "normal" | "few" | "none";
  mm: number;
}

const seed = [72, 15, 3, 88, 42, 20, 55];

function generateData(): RainfallData[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const mm = seed[i];
    const level =
      mm >= 70 ? "many" : mm >= 40 ? "normal" : mm >= 15 ? "few" : "none";
    return { date: d.getDate(), level, mm };
  });
}

const data: RainfallData[] = generateData();

const BAR_MAX_HEIGHT = 100; // px

export default function RainfallChart() {
  return (
    <div className="bg-white rounded-2xl p-5">
      <div className="flex gap-0">
        {/* Y-axis labels */}
        <div
          className="flex flex-col justify-between pr-2 text-[11px] text-gray-400 text-right shrink-0"
          style={{ height: `${BAR_MAX_HEIGHT}px`, paddingBottom: "0px" }}
        >
          {["많음", "보통", "적음"].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex-1 flex flex-col">
          {/* Bars */}
          <div
            className="flex items-end gap-[6px] border-b border-gray-100"
            style={{ height: `${BAR_MAX_HEIGHT}px` }}
          >
            {data.map(({ date, mm }) => {
              const heightPx = Math.max((mm / 100) * BAR_MAX_HEIGHT, 3);
              return (
                <div
                  key={date}
                  className="flex-1 flex items-end justify-center"
                >
                  <div
                    className="w-[15px] rounded-t-sm bg-blue-500 transition-all duration-500"
                    style={{ height: `${heightPx}px` }}
                  />
                </div>
              );
            })}
          </div>

          {/* X-axis labels */}
          <div className="flex gap-[6px] pt-1">
            {data.map(({ date }) => (
              <div
                key={date}
                className="flex-1 text-center text-[11px] text-gray-400"
              >
                {date}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
