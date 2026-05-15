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

interface CategoryItem {
  id: string;
  name: string;
}

export default function SearchFilter({
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
}: SearchFilterProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subcategories, setSubcategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. 대분류 목록 조회
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/v1/categories");
        if (!res.ok) throw new Error("대분류 조회 서버 에러");
        const data = await res.json();

        const mappedCategories = (data.categories || []).map((cat: any) => ({
          id: String(cat.id),
          name: cat.categoryName,
        }));

        setCategories(mappedCategories);
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
        const res = await fetch(
          `/api/v1/categories/${selectedCategory}/subcategories`,
        );
        if (!res.ok) throw new Error("소분류 조회 서버 에러");
        const data = await res.json();

        const mappedSub = (data.subcategories || []).map((sub: any) => ({
          id: String(sub.id || sub.subcategoryId || sub),
          name: sub.subcategoryName || sub.name || sub,
        }));

        setSubcategories(mappedSub);
      } catch (error) {
        console.error("소분류 조회 실패", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubcategories();
  }, [selectedCategory]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSelectedSubCategory(""); // 대분류가 바뀌면 소분류 초기화
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubCategory(e.target.value);
  };

  // 선택된 필터 칩(태그) 동적 생성
  const activeFilters = [];
  if (selectedCategory) {
    const catName =
      categories.find((c) => c.id === selectedCategory)?.name || "";
    activeFilters.push({ id: "category", label: catName });
  }
  if (selectedSubCategory) {
    const subName =
      subcategories.find((c) => c.id === selectedSubCategory)?.name || "";
    activeFilters.push({ id: "subcategory", label: subName });
  }

  const handleRemoveFilter = (id: string) => {
    if (id === "category") {
      setSelectedCategory("");
      setSelectedSubCategory("");
    } else if (id === "subcategory") {
      setSelectedSubCategory("");
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
  };

  return (
    <div className="w-full">
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
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
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
                  disabled={!selectedCategory || isLoading}
                  className="appearance-none w-full h-12 px-4 pr-10 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">{isLoading ? "로딩 중..." : "전체"}</option>
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
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
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors shrink-0"
              >
                <IcoReset className="w-6 h-6 text-gray-600 scale-60" />
              </button>

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
