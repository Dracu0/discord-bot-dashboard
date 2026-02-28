import { Select, MultiSelect } from "@mantine/core";

export function SelectField({ value, onChange, options, isMulti, ...props }) {
  const mantineData = Array.isArray(options)
    ? options.map((opt) => ({
        value: String(opt.value),
        label: opt.label || String(opt.value),
      }))
    : [];

  if (isMulti) {
    const multiValue = Array.isArray(value) ? value.map(String) : [];
    return (
      <MultiSelect
        data={mantineData}
        value={multiValue}
        onChange={(vals) => onChange && onChange(vals)}
        searchable
        {...props}
      />
    );
  }

  return (
    <Select
      data={mantineData}
      value={value != null ? String(value) : null}
      onChange={(val) => onChange && onChange(val)}
      searchable
      {...props}
    />
  );
}
