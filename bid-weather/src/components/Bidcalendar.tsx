"use client";

import React, { useMemo, useState } from "react";
import { usePredictionCalendar } from "@/hooks/useApi";
import { usePredictionSse } from "@/hooks/useSse";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

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

interface Props {
  categoryId?: string;
  subcategoryId?: string;
}

export default function BidCalendar({ categoryId, subcategoryId }: Props) {
  usePredictionSse(categoryId, subcategoryId);
  const { data, isLoading } = usePredictionCalendar(categoryId, subcategoryId);

  const predictions = useMemo(() => data?.predictions ?? [], [data]);

  const today = new Date();

  const bidCounts = Object.fromEntries(
    predictions.map((item) => [item.date, item.count]),
  );

  const availableMonths = useMemo(() => {
    return Array.from(
      new Set(
        predictions.map((item) => {
          const d = new Date(item.date);

          return `${d.getFullYear()}-${d.getMonth()}`;
        }),
      ),
    );
  }, [predictions]);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-5 min-h-[400px] flex items-center justify-center">
        <span className="text-gray-400 text-sm">불러오는 중...</span>
      </div>
    );
  }

  const isEmpty = availableMonths.length === 0;

  const current = isEmpty
    ? `${today.getFullYear()}-${today.getMonth()}`
    : availableMonths[currentIndex];

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

  const canGoPrev = !isEmpty && currentIndex > 0;
  const canGoNext = !isEmpty && currentIndex < availableMonths.length - 1;

  return (
    <div className="bg-white rounded-2xl p-5 min-h-[400px] flex flex-col relative">
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

      {isEmpty && (
        <div className="absolute inset-0 bg-white/70 rounded-2xl flex items-center justify-center">
          <span className="text-gray-400 text-sm">예측 대기 중</span>
        </div>
      )}
    </div>
  );
}
