"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface ApiDataPoint {
  period: string;
  actualCount: number | null;
  predictCount: number | null;
}

const generateDummyData = (): ApiDataPoint[] => {
  const data: ApiDataPoint[] = [];
  let currentVal = 20;
  let year = 2025;
  let month = 4;

  // 실제 데이터 구간
  for (let i = 0; i < 12; i++) {
    currentVal = Math.max(5, currentVal + Math.floor(Math.random() * 20 - 10));
    const period = `${year}-${String(month).padStart(2, "0")}`;
    data.push({ period, actualCount: currentVal, predictCount: null });
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  // 연결점 처리
  const lastActualIndex = data.length - 1;
  const lastActualValue = data[lastActualIndex].actualCount as number;
  data[lastActualIndex].predictCount = lastActualValue;

  // 예측 데이터 구간
  let predictVal = lastActualValue;
  for (let i = 0; i < 5; i++) {
    predictVal = Math.max(5, predictVal + Math.floor(Math.random() * 20 - 8));
    const period = `${year}-${String(month).padStart(2, "0")}`;
    data.push({ period, actualCount: null, predictCount: predictVal });
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const filteredPayload =
      payload.length > 1
        ? payload.filter((p: any) => p.dataKey === "predictCount")
        : payload;

    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-100">
        <p className="text-gray-700 font-bold mb-2">{label}</p>
        {filteredPayload.map((entry: any, index: number) => (
          <p key={index} className="text-sm m-0" style={{ color: entry.color }}>
            {entry.dataKey === "actualCount" ? "실제 데이터" : "예측 데이터"} :{" "}
            {entry.value} 건
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function BidGraph() {
  const [data, setData] = useState<ApiDataPoint[]>([]);

  useEffect(() => {
    setData(generateDummyData());
  }, []);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 h-[400px] w-full flex items-center justify-center text-gray-400">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  const splitPoint = data.find(
    (d) => d.actualCount !== null && d.predictCount !== null,
  )?.period;

  const formatXAxis = (tickItem: any) => {
    if (!tickItem || typeof tickItem !== "string") return "";
    const parts = tickItem.split("-");
    if (parts.length < 2) return tickItem;
    return `${parseInt(parts[1], 10)}월`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 h-[400px] w-full">
      <ResponsiveContainer width="99%" height="100%" minWidth={0}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid stroke="#F3F4F6" vertical={false} />

          <XAxis
            dataKey="period"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9CA3AF" }}
            dy={10}
            tickFormatter={formatXAxis}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9CA3AF" }}
            dx={-10}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#f3f4f6", strokeWidth: 1 }}
          />

          {splitPoint && (
            <ReferenceLine
              x={splitPoint}
              stroke="#E5E7EB"
              strokeDasharray="3 3"
            />
          )}

          <Line
            type="linear"
            dataKey="actualCount"
            stroke="#4B5563"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4, fill: "#4B5563", strokeWidth: 0 }}
          />

          <Line
            type="linear"
            dataKey="predictCount"
            stroke="#3B82F6"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4, fill: "#3B82F6", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
