"use client";

import React, { useMemo, useState } from "react";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// 예시 데이터
const predictions = [
  { date: "2026-05-04", count: 12 },
  { date: "2026-05-05", count: 45 },
  { date: "2026-05-06", count: 8 },
  { date: "2026-05-07", count: 23 },
  { date: "2026-05-08", count: 31 },
  { date: "2026-05-09", count: 5 },
  { date: "2026-05-10", count: 18 },
  { date: "2026-05-11", count: 27 },
  { date: "2026-05-12", count: 39 },
  { date: "2026-05-13", count: 41 },
  { date: "2026-05-14", count: 16 },
  { date: "2026-05-15", count: 9 },
  { date: "2026-05-16", count: 14 },
  { date: "2026-05-17", count: 29 },
  { date: "2026-05-18", count: 33 },
  { date: "2026-05-19", count: 21 },
  { date: "2026-05-20", count: 11 },
  { date: "2026-05-21", count: 25 },
  { date: "2026-05-22", count: 37 },
  { date: "2026-05-23", count: 42 },
  { date: "2026-05-24", count: 19 },
  { date: "2026-05-25", count: 7 },
  { date: "2026-05-26", count: 15 },
  { date: "2026-05-27", count: 28 },
  { date: "2026-05-28", count: 36 },
  { date: "2026-05-29", count: 44 },
  { date: "2026-05-30", count: 20 },
  { date: "2026-05-31", count: 13 },
  { date: "2026-06-01", count: 24 },
  { date: "2026-06-02", count: 32 },
  { date: "2026-06-03", count: 40 },
];

function getIntensity(count: number | undefined): 0 | 1 | 2 | 3 {
  if (!count) return 0;
  if (count < 10) return 1;
  if (count < 30) return 2;
  return 3;
}

const intensityClasses = {
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
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0",
  )}`;
}

export default function BidCalendar() {
  const today = new Date();

  // 빠른 조회용
  const bidCounts = Object.fromEntries(
    predictions.map((item) => [item.date, item.count]),
  );

  // 존재하는 month 추출
  const availableMonths = useMemo(() => {
    return Array.from(
      new Set(
        predictions.map((item) => {
          const d = new Date(item.date);

          return `${d.getFullYear()}-${d.getMonth()}`;
        }),
      ),
    );
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const current = availableMonths[currentIndex];

  const [year, month] = current.split("-").map(Number);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const cells: {
    day: number;
    monthType: "prev" | "cur" | "next";
  }[] = [];

  // 이전달 채우기
  const prevMonthDays = getDaysInMonth(year, month - 1);

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({
      day: prevMonthDays - i,
      monthType: "prev",
    });
  }

  // 현재달
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      monthType: "cur",
    });
  }

  // 다음달 채우기
  const remaining = 42 - cells.length;

  for (let d = 1; d <= remaining; d++) {
    cells.push({
      day: d,
      monthType: "next",
    });
  }

  // week 단위로 분리
  const weeks = [];

  for (let i = 0; i < 42; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  // 마지막 주가 전부 next면 제거
  const lastWeek = weeks[weeks.length - 1];

  if (lastWeek.every((cell) => cell.monthType === "next")) {
    weeks.pop();
  }

  // 6주 여부
  const isSixWeeks = weeks.length === 6;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < availableMonths.length - 1;

  return (
    <div className="bg-white rounded-2xl p-5 min-h-[400px] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => canGoPrev && setCurrentIndex((v) => v - 1)}
          disabled={!canGoPrev}
          className={`
            w-7 h-7 rounded-full flex items-center justify-center
            transition-all
            ${
              canGoPrev
                ? "hover:bg-gray-100 text-gray-500"
                : "text-gray-300 cursor-not-allowed"
            }
          `}
        >
          ‹
        </button>

        <span className="text-[14px] font-semibold text-gray-700">
          {year}년 {month + 1}월
        </span>

        <button
          onClick={() => canGoNext && setCurrentIndex((v) => v + 1)}
          disabled={!canGoNext}
          className={`
            w-7 h-7 rounded-full flex items-center justify-center
            transition-all
            ${
              canGoNext
                ? "hover:bg-gray-100 text-gray-500"
                : "text-gray-300 cursor-not-allowed"
            }
          `}
        >
          ›
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="text-center text-[11px] text-gray-400 py-[2px]"
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="flex flex-col gap-y-0.5 flex-1">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="grid grid-cols-7">
            {week.map((cell, idx) => {
              const isCur = cell.monthType === "cur";

              const key = isCur
                ? toKey(year, month, cell.day)
                : cell.monthType === "next"
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
                <div key={idx} className="flex flex-col items-center py-[1px]">
                  {/* 날짜 */}
                  <span
                    className={`text-[11px] mb-[2px] ${
                      isCur ? "text-gray-500" : "text-gray-300"
                    }`}
                  >
                    {cell.day}
                  </span>

                  {/* Count */}
                  {isCur && count ? (
                    <div
                      className={`
                        ${
                          isSixWeeks
                            ? "w-6 h-6 text-[10px]"
                            : "w-8 h-8 text-[11px]"
                        }
                        rounded-full flex items-center justify-center
                        font-semibold transition-all
                        ${intensityClasses[intensity]}
                        ${isToday ? "ring-2 ring-blue-400 ring-offset-1" : ""}
                      `}
                    >
                      {count}
                    </div>
                  ) : (
                    <div
                      className={`
                        ${isSixWeeks ? "w-6 h-6" : "w-8 h-8"}
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
