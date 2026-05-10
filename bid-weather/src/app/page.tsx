"use client";
import { useState } from "react";
import SearchFilter from "@/components/SearchFilter";
import RainfallChart from "@/components/RainfallChart";
import BidCalendar from "@/components/Bidcalendar";
import SectionTitle from "@/components/SectionTitle";
import WeeklyWeather from "@/components/WeeklyWeather";
import BidGraph from "@/components/BidGraph";
import WeatherToggle from "@/components/WeatherToggle";

export default function Home() {
  const [weatherType, setWeatherType] = useState("rain");

  return (
    <>
      <div className="mb-6">
        <SearchFilter />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-20">
        <div className="lg:col-span-3">
          <SectionTitle>지난 7일 날씨</SectionTitle>
          <WeeklyWeather />
        </div>

        <div className="lg:col-span-2">
          <SectionTitle
            action={
              <WeatherToggle value={weatherType} onChange={setWeatherType} />
            }
          >
            지난 7일 기상 정보
          </SectionTitle>

          <RainfallChart type={weatherType} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <SectionTitle>입찰 공고 건 수 추이 및 예측 그래프</SectionTitle>
          <BidGraph />
        </div>

        <div>
          <SectionTitle>입찰 공고 건 수 예측 달력</SectionTitle>
          <BidCalendar />
        </div>
      </div>
    </>
  );
}
