import { Text, SegmentedControl, Stack, Group } from "@mantine/core";
import { IconSun, IconMoon, IconDeviceDesktop } from "@tabler/icons-react";
import Card from "components/card/Card";
import SwitchField from "components/fields/impl/SwitchField";
import { useContext } from "react";
import { SettingsContext } from "contexts/SettingsContext";
import { SelectField } from "components/fields/SelectField";
import { Languages, Locale, useLocale } from "utils/Language";

export default function Settings({ ...rest }) {
  const { updateSettings, devMode, fixedWidth, language, colorScheme } = useContext(SettingsContext);
  const locale = useLocale();

  const Switch = ({ label, isChecked, onChange, ...props }) => {
    return (
      <SwitchField
        reversed={true}
        fz="sm"
        mb={20}
        label={locale(label)}
        isChecked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
        {...props}
      />
    );
  };

  return (
    <Card mb={20} {...rest}>
      <Text
        w="100%"
        c="var(--text-primary)"
        fw="bold"
        fz="xl"
        ff="'Space Grotesk', sans-serif"
        mb={30}
      >
        <Locale zh="用戶設置" en="Settings" />
      </Text>

      {/* Appearance */}
      <Stack gap="sm" mb={20}>
        <Text fz="sm" fw={600} c="var(--text-muted)" tt="uppercase" lts="0.5px">
          <Locale zh="外觀" en="Appearance" />
        </Text>
        <Group justify="space-between" align="center">
          <Text fz="sm" c="var(--text-primary)" fw={500}>
            <Locale zh="主題" en="Theme" />
          </Text>
          <SegmentedControl
            value={colorScheme}
            onChange={(v) => updateSettings({ colorScheme: v })}
            data={[
              { value: 'light', label: <IconSun size={16} /> },
              { value: 'auto', label: <IconDeviceDesktop size={16} /> },
              { value: 'dark', label: <IconMoon size={16} /> },
            ]}
            size="xs"
          />
        </Group>
      </Stack>

      {/* General */}
      <Stack gap="sm" mb={20}>
        <Text fz="sm" fw={600} c="var(--text-muted)" tt="uppercase" lts="0.5px">
          <Locale zh="一般" en="General" />
        </Text>
        <Switch
          label={{ zh: "固定屏幕最小寬度", en: "Fixed Screen Min-Width" }}
          isChecked={fixedWidth}
          onChange={(v) =>
            updateSettings({
              fixedWidth: v,
            })
          }
        />
        <Switch
          label={{ zh: "開發者模式", en: "Developer Mode" }}
          isChecked={devMode}
          onChange={(e) =>
            updateSettings({
              devMode: e,
            })
          }
        />
      </Stack>

      {/* Language */}
      <Stack gap="sm">
        <Text fz="sm" fw={600} c="var(--text-muted)" tt="uppercase" lts="0.5px">
          <Locale zh="語言" en="Language" />
        </Text>
        <SelectField
          value={language}
          options={Languages}
          onChange={(lang) =>
            updateSettings({
              language: lang,
            })
          }
        />
      </Stack>
    </Card>
  );
}
