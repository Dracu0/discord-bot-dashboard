import { Text, SegmentedControl, Stack, Group, ColorSwatch, Button, Tooltip } from "@mantine/core";
import { IconSun, IconMoon, IconDeviceDesktop, IconDownload } from "@tabler/icons-react";
import Card from "components/card/Card";
import SwitchField from "components/fields/impl/SwitchField";
import { useContext } from "react";
import { SettingsContext } from "contexts/SettingsContext";
import { SelectField } from "components/fields/SelectField";
import { Languages, Locale, useLocale } from "utils/Language";

const ACCENT_COLORS = [
  { value: "brand", color: "#8B5CF6" },
  { value: "blue", color: "#3B82F6" },
  { value: "teal", color: "#14B8A6" },
  { value: "green", color: "#10B981" },
  { value: "orange", color: "#F59E0B" },
  { value: "pink", color: "#EC4899" },
];

export default function Settings({ ...rest }) {
  const { updateSettings, devMode, fixedWidth, language, colorScheme, accentColor } = useContext(SettingsContext);
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

  const handleExportSettings = () => {
    const data = { language, fixedWidth, devMode, colorScheme, accentColor };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dashboard-settings.json";
    a.click();
    URL.revokeObjectURL(url);
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
        <Group justify="space-between" align="center">
          <Text fz="sm" c="var(--text-primary)" fw={500}>
            <Locale zh="強調色" en="Accent Color" />
          </Text>
          <Group gap={6}>
            {ACCENT_COLORS.map(({ value, color }) => (
              <Tooltip key={value} label={value} position="top">
                <ColorSwatch
                  color={color}
                  size={22}
                  onClick={() => updateSettings({ accentColor: value })}
                  style={{
                    cursor: "pointer",
                    outline: (accentColor || "brand") === value
                      ? "2px solid var(--text-primary)"
                      : "2px solid transparent",
                    outlineOffset: 2,
                  }}
                />
              </Tooltip>
            ))}
          </Group>
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
      <Stack gap="sm" mb={20}>
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

      {/* Data */}
      <Stack gap="sm">
        <Text fz="sm" fw={600} c="var(--text-muted)" tt="uppercase" lts="0.5px">
          <Locale zh="資料" en="Data" />
        </Text>
        <Button
          variant="light"
          color="gray"
          size="sm"
          leftSection={<IconDownload size={16} />}
          onClick={handleExportSettings}
        >
          <Locale zh="匯出設定" en="Export Settings" />
        </Button>
      </Stack>
    </Card>
  );
}
