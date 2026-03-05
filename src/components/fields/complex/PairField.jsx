import { OptionField } from "../OptionPanel";

export default function PairField({ element, value, onChange }) {
  const [first, second] = value || [];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="w-fit">
        <OptionField
          option={element.first}
          value={first}
          onChange={(v) => onChange([v, second])}
        />
      </div>
      <div className="w-full">
        <OptionField
          option={element.second}
          value={second}
          onChange={(v) => onChange([first, v])}
        />
      </div>
    </div>
  );
}
