"use client";

import React from "react";

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
  0: "bg-gray-100 text-gray-400",
  1: "bg-blue-200 text-blue-700",
  2: "bg-blue-400 text-white",
  3: "bg-blue-600 text-white",
};

function formatKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function BidCalendar() {
  const today = new Date();

  // 빠른 조회용 map
  const bidCounts = Object.fromEntries(
    predictions.map((item) => [item.date, item.count]),
  );

  // 오늘 포함 31일 생성
  const days = Array.from({ length: 31 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    return {
      date,
      key: formatKey(date),
    };
  });

  // 시작 요일 전 빈칸 추가
  const firstDay = days[0].date.getDay();

  const cells: ({ empty: true } | { empty: false; date: Date; key: string })[] =
    [];

  for (let i = 0; i < firstDay; i++) {
    cells.push({ empty: true });
  }

  days.forEach((day) => {
    cells.push({
      empty: false,
      date: day.date,
      key: day.key,
    });
  });

  // 주 단위로 자르기
  const weeks = [];

  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="bg-white rounded-2xl p-5 h-[400px] flex flex-col">
      {/* Weekdays */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="text-center text-[11px] text-gray-400 py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="flex flex-col gap-y-2 flex-1">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="grid grid-cols-7">
            {week.map((cell, idx) => {
              if (cell.empty) {
                return <div key={idx} className="h-[52px]" />;
              }

              const count = bidCounts[cell.key];
              const intensity = getIntensity(count);

              const isToday = cell.date.toDateString() === today.toDateString();

              return (
                <div key={idx} className="flex flex-col items-center py-[2px]">
                  {/* 날짜 */}
                  <span className="text-[11px] mb-[4px] text-gray-500">
                    {cell.date.getDate()}
                  </span>

                  {/* count */}
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      text-[11px] font-semibold transition-all
                      ${intensityClasses[intensity]}
                      ${isToday ? "ring-2 ring-blue-400 ring-offset-1" : ""}
                    `}
                  >
                    {count ?? "-"}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
