"use client";

import React from "react";
import Sunny from "@/assets/icons/Weather/Sunny.svg";
import Cloudy from "@/assets/icons/Weather/Cloudy.svg";
import PartlyCloudy from "@/assets/icons/Weather/Partly-cloudy.svg";
import Rain from "@/assets/icons/Weather/Rain.svg";
import Snow from "@/assets/icons/Weather/Snow.svg";
import RainThunder from "@/assets/icons/Weather/Rain&Thunderstorm.svg";
import Wind from "@/assets/icons/Weather/Wind.svg";

export type WeatherType =
  | "Sunny"
  | "Cloudy"
  | "PartlyCloudy"
  | "Rain"
  | "Snow"
  | "RainThunder"
  | "Wind";

const WeatherIconMap: Record<
  WeatherType,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  Sunny: Sunny,
  Cloudy: Cloudy,
  PartlyCloudy: PartlyCloudy,
  Rain: Rain,
  Snow: Snow,
  RainThunder: RainThunder,
  Wind: Wind,
};

interface WeatherCardProps {
  date: string;
  condition: string;
  maxTemp: number;
  minTemp: number;
}

// condition을 아이콘 타입으로
const getIconTypeFromCondition = (condition: string): WeatherType => {
  if (condition.includes("맑음")) return "Sunny";
  if (condition.includes("구름")) return "PartlyCloudy";
  if (condition.includes("흐림")) return "Cloudy";
  if (condition.includes("비")) return "Rain";
  if (condition.includes("눈")) return "Snow";
  if (condition.includes("천둥") || condition.includes("번개"))
    return "RainThunder";
  if (condition.includes("바람") || condition.includes("강풍")) return "Wind";

  return "Sunny"; // 기본값
};

export default function WeatherCard({
  date,
  condition,
  maxTemp,
  minTemp,
}: WeatherCardProps) {
  // condition 텍스트에 따른 아이콘 결정
  const weatherType = getIconTypeFromCondition(condition);
  const Icon = WeatherIconMap[weatherType];

  return (
    <div className="flex flex-col items-center justify-between p-4 bg-white rounded-xl h-full">
      {/* 날짜 영역 */}
      <span className="text-[16px] font-semibold text-gray-600 mb-1">
        {date}
      </span>

      {/* 아이콘 영역 */}
      <div className="relative w-16 h-16 ml-5.5 flex items-center justify-center my-1">
        {Icon && <Icon className="w-14 h-14" />}
      </div>

      {/* 기온 정보 */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-sm font-medium text-gray-700">{maxTemp}°</span>
        <span className="text-sm font-medium text-gray-400">{minTemp}°</span>
      </div>
    </div>
  );
}
