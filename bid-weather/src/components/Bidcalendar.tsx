"use client";

import React, { useState } from "react";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// 임시 데이터
const bidCounts: Record<string, number> = {
  "2026-04-05": 5,
  "2026-04-06": 6,
  "2026-04-07": 7,
  "2026-04-08": 8,
  "2026-04-09": 9,
  "2026-04-10": 10,
  "2026-04-11": 11,
  "2026-04-12": 12,
  "2026-04-13": 13,
  "2026-04-14": 14,
  "2026-04-15": 15,
  "2026-04-16": 16,
  "2026-04-17": 17,
  "2026-04-18": 18,
  "2026-04-19": 19,
  "2026-04-20": 20,
  "2026-04-21": 21,
  "2026-04-22": 22,
  "2026-04-23": 23,
  "2026-04-24": 24,
  "2026-04-25": 25,
  "2026-04-26": 26,
  "2026-04-27": 27,
  "2026-04-28": 28,
  "2026-04-29": 30,
  "2026-04-30": 31,
  "2026-05-03": 3,
  "2026-05-04": 4,
  "2026-05-05": 5,
  "2026-05-06": 6,
  "2026-05-07": 7,
  "2026-05-08": 8,
  "2026-05-09": 9,
  "2026-05-10": 10,
  "2026-05-11": 11,
  "2026-05-12": 12,
  "2026-05-13": 13,
  "2026-05-14": 14,
  "2026-05-15": 15,
  "2026-05-16": 16,
};

// Intensity: 0=none, 1=light, 2=medium, 3=dark
function getIntensity(count: number | undefined): 0 | 1 | 2 | 3 {
  if (!count) return 0;
  if (count < 8) return 1;
  if (count < 20) return 2;
  return 3;
}

const intensityClasses: Record<0 | 1 | 2 | 3, string> = {
  0: "bg-transparent text-gray-400",
  1: "bg-blue-200 text-blue-700",
  2: "bg-blue-400 text-white",
  3: "bg-blue-600 text-white",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function toKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function BidCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Build calendar grid (6 rows x 7 cols)
  const cells: { day: number; month: "prev" | "cur" | "next" }[] = [];

  // Previous month fill
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, month: "prev" });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month: "cur" });
  }
  // Next month fill
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, month: "next" });
  }

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  };

  return (
    <div className="bg-white rounded-2xl p-5">
      {/* Month navigation */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={prevMonth}
          className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
        >
          ‹
        </button>
        <span className="text-[14px] font-semibold text-gray-700">
          {year}년 {month + 1}월
        </span>
        <button
          onClick={nextMonth}
          className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
        >
          ›
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="text-center text-[11px] font-medium text-gray-400 py-1"
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((cell, idx) => {
          const isCur = cell.month === "cur";
          const key = isCur
            ? toKey(year, month, cell.day)
            : cell.month === "next"
              ? toKey(
                  month === 11 ? year + 1 : year,
                  (month + 1) % 12,
                  cell.day,
                )
              : toKey(
                  month === 0 ? year - 1 : year,
                  (month - 1 + 12) % 12,
                  cell.day,
                );

          const count = bidCounts[key];
          const intensity = isCur ? getIntensity(count) : 0;
          const isToday =
            isCur &&
            cell.day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          return (
            <div key={idx} className="flex flex-col items-center py-[2px]">
              {/* Date number row */}
              <span
                className={`text-[11px] mb-[2px] ${
                  isCur ? "text-gray-500" : "text-gray-300"
                }`}
              >
                {cell.day}
              </span>
              {/* Circle badge */}
              {isCur && count ? (
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all ${intensityClasses[intensity]} ${
                    isToday ? "ring-2 ring-blue-400 ring-offset-1" : ""
                  }`}
                >
                  {count}
                </div>
              ) : (
                <div className="w-7 h-7" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
