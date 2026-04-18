import React from "react";

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionTitle({
  children,
  className = "",
}: SectionTitleProps) {
  return (
    <h2
      className={`text-[16px] font-bold text-gray-800 mb-4 tracking-tight ${className}`}
    >
      {children}
    </h2>
  );
}
