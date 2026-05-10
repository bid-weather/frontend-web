"use client";
import React from "react";

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export default function SectionTitle({
  children,
  className = "",
  action,
}: SectionTitleProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <h2 className="text-[16px] font-bold text-gray-800 tracking-tight">
        {children}
      </h2>

      {action}
    </div>
  );
}