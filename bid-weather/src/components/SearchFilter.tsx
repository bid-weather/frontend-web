"use client";

import React, { useState, useEffect } from "react";
import IcoReset from "@/assets/icons/Filter/ico_reset.svg";
import IcoDelete from "@/assets/icons/Filter/ico_delete_fill.svg";
import IcoAngle from "@/assets/icons/Filter/ico_angle.svg";

interface SearchFilterProps {
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedSubCategory: string;
  setSelectedSubCategory: (val: string) => void;
}

export default function SearchFilter({
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
}: SearchFilterProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. 대분류 목록 조회
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/v1/categories");
        const data = await res.json();
        setCategories(data.categories || []); // 명세서 기반 매핑
      } catch (error) {
        console.error("대분류 조회 실패", error);
      }
    };
    fetchCategories();
  }, []);

  // 2. 소분류 목록 조회 (대분류 변경 시)
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedCategory) {
        setSubcategories([]);
        return;
      }
      try {
        setIsLoading(true);
        // 명세서에 따라 Path Variable 적용
        const res = await fetch(
          `/api/v1/categories/${selectedCategory}/subcategories`,
        );
        const data = await res.json();
        setSubcategories(data.subcategories || []);
      } catch (error) {
        console.error("소분류 조회 실패", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubcategories();
  }, [selectedCategory]);

  // 대분류 변경 핸들러
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSelectedSubCategory(""); // 대분류가 바뀌면 소분류 초기화
  };

  // 소분류 변경 핸들러
  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubCategory(e.target.value);
  };

  // 선택된 필터 칩(태그)을 위해 배열 동적 생성
  const activeFilters = [];
  if (selectedCategory)
    activeFilters.push({ id: "category", label: selectedCategory });
  if (selectedSubCategory)
    activeFilters.push({ id: "subcategory", label: selectedSubCategory });

  // 특정 필터 삭제 핸들러
  const handleRemoveFilter = (id: string) => {
    if (id === "category") {
      setSelectedCategory("");
      setSelectedSubCategory(""); // 대분류를 지우면 소속된 소분류도 함께 지움
    } else if (id === "subcategory") {
      setSelectedSubCategory("");
    }
  };

  // 필터 전체 초기화 핸들러
  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
  };

  return (
    <div className="w-full">
      {/* 검색 입력폼 (Search Top Box) */}
      <div className="bg-white rounded-2xl p-6 md:px-8 md:py-5">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-4/5">
            {/* 업종 분류 (대분류) */}
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
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="appearance-none w-full h-12 px-4 pr-10 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                >
                  <option value="">전체</option>
                  {/* API에서 받아온 대분류 데이터 렌더링 */}
                  {categories.map((category, idx) => (
                    <option key={idx} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <IcoAngle className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* 세부 업종 (소분류) */}
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
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  disabled={!selectedCategory || isLoading} // 대분류 선택 전이거나 로딩 중일 때 비활성화
                  className="appearance-none w-full h-12 px-4 pr-10 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">{isLoading ? "로딩 중..." : "전체"}</option>
                  {/* API에서 받아온 소분류 데이터 렌더링 */}
                  {subcategories.map((sub, idx) => (
                    <option key={idx} value={sub}>
                      {sub}
                    </option>
                  ))}
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
    </div>
  );
}
