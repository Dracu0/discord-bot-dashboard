import { SelectField } from "../SelectField";

export default function IdSelectField({ value, onChange, options, placeholder, multiple, error }) {
  return (
    <SelectField
      options={options.map((option) => ({
        label: option.name,
        value: option.id,
      }))}
      placeholder={placeholder || "Select an item"}
      value={value}
      onChange={onChange}
      isMulti={multiple}
      error={error}
    />
  );
}