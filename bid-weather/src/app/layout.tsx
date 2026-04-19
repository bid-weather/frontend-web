import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2", // public 폴더 기준 경로
  display: "swap",
  weight: "45 920", // 가변 폰트(Variable)인 경우 가중치 범위 지정 가능
  variable: "--font-pretendard", // CSS 변수명 정의 (Tailwind 연동용)
});

export const metadata: Metadata = {
  title: "BidWeather",
  description: "입찰 공고 날씨 분석 서비스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${pretendard.variable} bg-[#D6E0EB]`}>
      <body
        className={`${pretendard.className} min-h-screen flex flex-col bg-[#EEF2F7]`}
      >
        <Header />
        <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
