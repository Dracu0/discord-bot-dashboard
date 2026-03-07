import { Switch } from "components/ui/switch";
import Card from "components/card/Card";
import { SelectField } from "components/fields/SelectField";
import { InputField } from "./impl/InputField";
import MessageBuildCard from "./complex/MessageBuildCard";
import ColorField from "./impl/ColorField";
import { createContext, useContext, useMemo } from "react";
import ArrayField from "./complex/ArrayField";
import TextArea from "./TextArea";
import IdSelectField from "./impl/IdSelectField";
import ImageField from "./impl/ImageField";
import EmojiField from "./impl/EmojiField";
import DurationField from "./impl/DurationField";
import PairField from "./complex/PairField";
import { OptionTypes } from "../../variables/type";
import { cn } from "lib/utils";

const PREVIEW_TYPE = "preview";

function normalizeEnumChoice(choice) {
    if (typeof choice === "string" || typeof choice === "number") {
        return {
            label: String(choice),
            value: String(choice),
        }
    }

    if (choice && typeof choice === "object") {
        return {
            ...choice,
            value: choice.value ?? choice.id ?? choice.key ?? choice.label ?? choice.name ?? "",
            label: choice.label ?? choice.name ?? choice.value ?? choice.id ?? "",
        }
    }

    return {
        label: String(choice ?? ""),
        value: String(choice ?? ""),
    }
}

export function OptionPanel({ value, onChange, option, error }) {
  const input = useInput(value, onChange, option, error);

  if (option.type === PREVIEW_TYPE && option.render) {
    return option.render();
  }

  const inline = option.type === OptionTypes.Boolean;

  return (
        <Card className="rounded-[28px] border border-(--border-subtle) bg-[linear-gradient(180deg,var(--surface-card)_0%,var(--surface-primary)_100%)] p-5 shadow-(--shadow-sm) md:p-6">
            <div className={cn(
                "h-full text-left",
                inline
                    ? "flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5"
                    : "space-y-4"
            )}>
                <div className="min-w-0 flex-1 text-left">
                    <div className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">
                            {inline ? "Toggle" : "Configuration"}
                        </p>
                        <p className="font-['Space_Grotesk'] text-xl font-semibold leading-tight text-(--text-primary)">
                            {option.name}
                        </p>
                        {option.description && (
                            <p className="text-sm leading-6 text-(--text-secondary)">{option.description}</p>
                        )}
                    </div>

                    {!inline && <div className="pt-1">{input}</div>}

                    {option.helper && (
                        <p className="mt-3 text-xs leading-5 text-(--text-muted)">
                            {option.helper}
                        </p>
                    )}
                    {error && (
                        <p className="mt-2 text-xs font-medium leading-5 text-(--status-error)">
                            {error}
                        </p>
                    )}
                </div>

                                {inline && <div className="shrink-0 self-start pt-1 sm:pt-0">{input}</div>}
            </div>
    </Card>
  );
}

export function ToggleRow({ value, onChange, option, error }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-(--border-subtle) bg-(--surface-card) px-5 py-3.5">
            <div className="min-w-0 flex-1">
                <p className="font-['Space_Grotesk'] text-base font-semibold leading-tight text-(--text-primary)">
                    {option.name}
                </p>
                {option.description && (
                    <p className="mt-1 text-sm leading-5 text-(--text-secondary)">{option.description}</p>
                )}
                {error && (
                    <p className="mt-1 text-xs font-medium leading-5 text-(--status-error)">{error}</p>
                )}
            </div>
            <div className="shrink-0">
                <Switch
                    checked={value}
                    onCheckedChange={(checked) => onChange(checked)}
                />
            </div>
        </div>
    );
}

export function useInput(value, onChange, option, error) {
    let field = useMemo(
        () => getInput(value, onChange, option, error),
        [onChange, option, value, error]
    )
    const handlers = useContext(OptionHandlerContext)

    if (field != null) {
        return field
    }
    const handler = handlers && handlers[option.type]

    if (handler) {
        return handler({ value, onChange, option })
    }
}

export function getInput(value, onChange, option, error) {

    switch (option.type) {
        case OptionTypes.Message_Create:
            return (
                <MessageBuildCard value={value} onChange={onChange} />
            );
        case OptionTypes.Array:
            return (
                <ArrayField element={option.element} value={value} onChange={onChange} />
            )
        case OptionTypes.Color:
            return <ColorField
                value={value}
                onChange={onChange}
            />
        case OptionTypes.Boolean:
            return (
                <Switch
                    checked={value}
                    onCheckedChange={(checked) => onChange(checked)}
                />
            );
        case OptionTypes.MultiLine_Text:
            return (
                <TextArea
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    error={error}
                />
            )
        case OptionTypes.Number:
        case OptionTypes.Text:
            const isText = option.type === OptionTypes.Text;

            return (
                <InputField
                    type={isText ? "text" : "number"}
                    value={value ?? (isText ? "" : 0)}
                    placeholder={isText ? "Enter text" : "Enter a number"}
                    onChange={({ target }) =>
                        onChange(isText ? target.value : (isNaN(target.valueAsNumber) ? 0 : target.valueAsNumber))
                    }
                    error={error}
                />
            );
        case OptionTypes.Duration:
            return (
                <DurationField
                    value={value}
                    onChange={onChange}
                    option={option}
                    error={error}
                />
            );
        case OptionTypes.Enum:
            return (
                <SelectField
                    options={(option.choices || []).map(normalizeEnumChoice)}
                    placeholder="Select an item"
                    value={value}
                    onChange={onChange}
                    isMulti={option.multiple}
                    error={error}
                />
            );
        case OptionTypes.Advanced_Enum:
            return (
                <IdSelectField
                    value={value}
                    onChange={onChange}
                    placeholder={option.placeholder}
                    options={option.choices}
                    multiple={option.multiple}
                    error={error}
                />
            )
        case OptionTypes.Image:
            return (
                <ImageField value={value} onChange={onChange} />
            )
        case OptionTypes.Emoji:
            return (
                <EmojiField value={value} onChange={onChange} />
            )
        case OptionTypes.Pair:
            return (
                <PairField element={option.element} value={value} onChange={onChange} />
            )
        default:
            return null;
    }
}

export function OptionField({ value, onChange, option }) {
    return useInput(value, onChange, option)
}

export const OptionHandlerContext = createContext({})
