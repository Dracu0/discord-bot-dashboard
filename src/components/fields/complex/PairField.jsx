import { OptionField } from "../OptionPanel";

const FALLBACK_OPTION = { id: "_fallback", type: "string" };

export default function PairField({ element, value, onChange }) {
  const [first, second] = value || [];

  const firstOpt = element?.first || FALLBACK_OPTION;
  const secondOpt = element?.second || FALLBACK_OPTION;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="w-fit">
        <OptionField
          option={firstOpt}
          value={first}
          onChange={(v) => onChange([v, second])}
        />
      </div>
      <div className="w-full">
        <OptionField
          option={secondOpt}
          value={second}
          onChange={(v) => onChange([first, v])}
        />
      </div>
    </div>
  );
}
