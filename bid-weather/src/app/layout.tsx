import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
    <html lang="ko" className="bg-[#D6E0EB]">
      <body className="min-h-screen flex flex-col bg-[#EEF2F7]">
        <Header />
        <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
