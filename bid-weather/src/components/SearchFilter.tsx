"use client";

import React, { useState } from "react";
import IcoReset from "@/assets/icons/Filter/ico_reset.svg";
import IcoDelete from "@/assets/icons/Filter/ico_delete_fill.svg";
import IcoAngle from "@/assets/icons/Filter/ico_angle.svg";

export default function SearchFilter() {
  // 선택된 필터 상태 관리 (예시 데이터)
  const [activeFilters, setActiveFilters] = useState([
    { id: 1, label: "대전광역시" },
    { id: 2, label: "공사" },
    { id: 3, label: "수해/침수 예방" },
  ]);

  // 필터 삭제 핸들러
  const handleRemoveFilter = (id: number) => {
    setActiveFilters((prev) => prev.filter((filter) => filter.id !== id));
  };

  // 필터 초기화 핸들러
  const handleResetFilters = () => {
    setActiveFilters([]);
  };

  return (
    <div className="w-full">
      {/* 검색 입력폼 (Search Top Box) */}
      <div className="bg-white rounded-2xl p-6 md:px-8 md:py-5">
        <div className="flex flex-col gap-4">
          {/* 필터 폼 (Select Boxes) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-4/5">
            <div className="flex items-center gap-3 w-full">
              <label
                className="text-[15px] font-bold text-gray-900 shrink-0 w-16"
                htmlFor="appl-sch-sel1"
              >
                지역
              </label>
              <div className="relative flex-1">
                <select
                  id="appl-sch-sel1"
                  className="appearance-none w-full h-12 px-4 pr-10 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                >
                  <option value="">전체</option>
                  <option value="daejeon">대전광역시</option>
                  <option value="seoul">서울특별시</option>
                </select>
                <IcoAngle className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-3 w-full">
              <label
                className="text-[15px] font-bold text-gray-900 shrink-0 w-16"
                htmlFor="appl-sch-sel2"
              >
                업종 분류
              </label>
              <div className="relative flex-1">
                <select
                  id="appl-sch-sel2"
                  className="appearance-none w-full h-12 px-4 pr-10 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                >
                  <option value="">전체</option>
                  <option value="construction">공사</option>
                  <option value="goods">물품</option>
                </select>
                <IcoAngle className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-3 w-full">
              <label
                className="text-[15px] font-bold text-gray-900 shrink-0 w-16"
                htmlFor="appl-sch-sel3"
              >
                세부 업종
              </label>
              <div className="relative flex-1">
                <select
                  id="appl-sch-sel3"
                  className="appearance-none w-full h-12 px-4 pr-10 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                >
                  <option value="">전체</option>
                  <option value="flood-prevention">수해/침수 예방</option>
                  <option value="disaster-recovery">재해 긴급 복구</option>
                </select>
                <IcoAngle className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* 선택된 필터 칩 (Filter Chip) */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm font-bold text-gray-800 shrink-0">
              선택된 필터{" "}
              <span className="ml-1 text-blue-600">{activeFilters.length}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* 새로고침(초기화) 버튼 */}
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors shrink-0"
                aria-label="새로고침"
              >
                <IcoReset className="w-6 h-6 text-gray-600 scale-60" />
              </button>

              {/* 태그 리스트 */}
              <div className="flex flex-wrap items-center gap-2">
                {activeFilters.map((filter) => (
                  <span
                    key={filter.id}
                    className="inline-flex items-center gap-0.5 pl-3 pr-1.5 py-1.5 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700"
                  >
                    {filter.label}
                    <button
                      type="button"
                      onClick={() => handleRemoveFilter(filter.id)}
                      className="relative flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                      aria-label="삭제"
                    >
                      <IcoDelete className="absolute w-5 h-5 fill-current scale-75" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* //검색 입력폼 */}
    </div>
  );
}
