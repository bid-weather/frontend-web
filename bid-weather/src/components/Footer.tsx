import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-4">
      <div className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col items-center gap-1">
        <p className="text-[15px] text-gray-400">
          © 2026 BidWeather. All rights reserved.
        </p>
        <p className="text-[11px] text-gray-300 text-center mt-20">
          본 저작물은 행정안전부에서 2024년 작성하여 공공누리 제1유형으로 개방한
          &apos;범정부 UI/UX 디자인시스템(KRDS)&apos;을 이용하였으며, 해당
          저작물은 &apos;KRDS 디자인시스템 홈페이지(www.krds.go.kr)에서 무료로
          다운받으실 수 있습니다.
        </p>
      </div>
    </footer>
  );
}
