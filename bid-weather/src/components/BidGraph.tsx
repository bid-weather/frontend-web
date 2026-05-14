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

interface BidGraphProps {
  categoryId: string;
  subcategoryId: string;
}

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

export default function BidGraph({ categoryId, subcategoryId }: BidGraphProps) {
  const [data, setData] = useState<ApiDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setIsLoading(true);
        const queryParams = new URLSearchParams();
        if (categoryId) queryParams.append("categoryId", categoryId);
        if (subcategoryId) queryParams.append("subcategoryId", subcategoryId);

        const res = await fetch(
          `/api/v1/predictions/graph?${queryParams.toString()}`,
        );
        const result = await res.json();

        if (result.graphData) {
          const processedData = [...result.graphData];

          // 기존 더미 데이터 로직과 동일한 연결점 처리 적용
          let lastActualIndex = -1;
          for (let i = 0; i < processedData.length; i++) {
            if (processedData[i].actualCount !== null) {
              lastActualIndex = i;
            }
          }

          if (
            lastActualIndex !== -1 &&
            lastActualIndex + 1 < processedData.length
          ) {
            processedData[lastActualIndex] = {
              ...processedData[lastActualIndex],
              predictCount: processedData[lastActualIndex].actualCount,
            };
          }

          setData(processedData);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("그래프 데이터 조회 실패:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGraphData();
  }, [categoryId, subcategoryId]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 h-[400px] w-full flex items-center justify-center text-gray-400">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 h-[400px] w-full flex items-center justify-center text-gray-400">
        조회된 데이터가 없습니다.
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
