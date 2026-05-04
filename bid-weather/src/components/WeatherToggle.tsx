"use client";

const options = [
  { label: "강수", value: "rain" },
  { label: "습도", value: "humidity" },
  { label: "풍속", value: "wind" },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function WeatherToggle({ value, onChange }: Props) {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
      {options.map((option) => {
        const active = value === option.value;

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              px-3 py-1 text-[12px] rounded-md transition-all
              ${
                active
                  ? "bg-white shadow-sm text-gray-900 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
