import RainfallChart from "@/components/RainfallChart";
import BidCalendar from "@/components/Bidcalendar";
import SectionTitle from "@/components/SectionTitle";

export default function Home() {
  return (
    <>
      <div className="bg-white rounded-2xl px-6 py-5 mb-6 shadow-sm">
        <p className="text-gray-300 text-sm text-center">[ 검색 영역 ]</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-20">
        <div>
          <SectionTitle>지난 7일 날씨</SectionTitle>
        </div>

        <div>
          <SectionTitle>지난 7일 강수량</SectionTitle>
          <RainfallChart />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <SectionTitle>입찰 공고 건 수 추이 및 예측 그래프</SectionTitle>
        </div>

        <div>
          <SectionTitle>입찰 공고 건 수 예측 달력</SectionTitle>
          <BidCalendar />
        </div>
      </div>
    </>
  );
}
