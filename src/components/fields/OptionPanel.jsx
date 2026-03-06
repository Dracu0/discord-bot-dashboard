import { Switch } from "components/ui/switch";
import { Card } from "components/ui/card";
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
import PairField from "./complex/PairField";
import { OptionTypes } from "../../variables/type";

const PREVIEW_TYPE = "preview";

export function OptionPanel({ value, onChange, option, error }) {
  const input = useInput(value, onChange, option, error);

  if (option.type === PREVIEW_TYPE && option.render) {
    return option.render();
  }

  const inline = option.type === OptionTypes.Boolean;

  return (
    <Card className={inline ? "flex flex-row-reverse gap-5" : "flex flex-col gap-5"}>
      <div className="h-full">
        <p className="text-lg font-bold mb-1 text-(--text-primary)">
          {option.name}
        </p>
        {option.description && (
          <p className="mb-4 text-(--text-primary)">{option.description}</p>
        )}
        {input}
        {option.helper && (
          <p className="text-xs text-(--text-muted) mt-1">
            {option.helper}
          </p>
        )}
        {error && (
          <p className="text-xs text-(--status-error) mt-1">
            {error}
          </p>
        )}
      </div>
    </Card>
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
        case OptionTypes.Enum:
            return (
                <SelectField
                    options={(option.choices || []).map((choice) => ({
                        label: choice,
                        value: choice,
                    }))}
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
