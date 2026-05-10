"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const options = [
  { key: "rain", label: "강수량" },
  { key: "humidity", label: "습도" },
  { key: "wind", label: "풍속" },
];

export default function WeatherToggle({ value, onChange }: Props) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`px-3 py-1 text-[12px] rounded-md transition-all ${
            value === opt.key
              ? "bg-white text-gray-800 font-semibold shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
