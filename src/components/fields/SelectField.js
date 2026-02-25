import { Select as BaseSelect } from "chakra-react-select";
import { useColorModeValue } from "@chakra-ui/react";
import { useNeuRaised } from "../../utils/colors";

export function SelectField({ value, onChange, options, ...props }) {
  const selected =
    value != null &&
    Array.isArray(options) &&
    options.find(
      (option) =>
        option.value === value ||
        (Array.isArray(value) && value.includes(option.value))
    );

  const brandColor = useColorModeValue("secondaryGray.300", "brand.400");
  const bgColor = useColorModeValue("secondaryGray.300", "navy.900");
  const neuShadow = useNeuRaised();
  const menuBorderColor = useColorModeValue("rgba(255,255,255,0.6)", "rgba(139,92,246,0.1)");

  return (
    <BaseSelect
      menuPortalTarget={document.body}
      menuShouldScrollIntoView={false}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 1500 }),
      }}
      chakraStyles={{
        dropdownIndicator: (provided) => ({
          ...provided,
          background: "brand",
        }),
        menu: (provided) => ({
          ...provided,
          boxShadow: neuShadow,
          border: "1px solid",
          borderColor: menuBorderColor,
          borderRadius: "16px",
          overflow: "hidden",
        }),
        menuList: (provided) => ({
          ...provided,
          background: bgColor,
          borderRadius: "16px",
        }),
      }}
      focusBorderColor={brandColor}
      selectedOptionStyle="check"
      {...props}
      value={selected}
      onChange={(e) =>
        onChange != null &&
        onChange(Array.isArray(e) ? e.map((option) => option.value) : e.value)
      }
      options={options}
    />
  );
}
