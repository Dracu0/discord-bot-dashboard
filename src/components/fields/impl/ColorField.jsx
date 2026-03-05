import { HexColorPicker } from "react-colorful";

export default function ColorField({ value, onChange }) {
  const color = value || "#aabbcc";

  return (
    <div className="flex flex-col md:flex-row gap-10">
      <div
        className="min-h-[150px] md:min-h-[200px] flex-1 rounded-lg"
        style={{ background: color }}
      />
      <div className="w-full md:w-[300px] md:max-w-[50%]">
        <HexColorPicker style={{ width: "100%" }} color={color} onChange={onChange} />
      </div>
    </div>
  );
}
