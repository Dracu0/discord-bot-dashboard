import { Switch, Text } from "@mantine/core";
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
import PairField from "./complex/PairField";
import { OptionTypes } from "../../variables/type";

const PREVIEW_TYPE = "preview";

export function OptionPanel({ value, onChange, option, error }) {
  if (option.type === PREVIEW_TYPE && option.render) {
    return option.render();
  }

  const input = useInput(value, onChange, option, error);
  const inline = option.type === OptionTypes.Boolean;

  return (
    <Card style={{ flexDirection: inline ? "row-reverse" : "column", display: "flex", gap: 20 }}>
      <div style={{ height: "100%" }}>
        <Text fz="lg" fw="bold" mb={4}>
          {option.name}
        </Text>
        {option.description && <Text mb="md">{option.description}</Text>}
        {input}
        {option.helper && (
          <Text fz="xs" c="dimmed" mt={4}>
            {option.helper}
          </Text>
        )}
        {error && (
          <Text fz="xs" c="red" mt={4}>
            {error}
          </Text>
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
                    color="brand"
                    size="md"
                    checked={value}
                    onChange={({ target }) => onChange(target.checked)}
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
                    options={option.choices.map((choice) => ({
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