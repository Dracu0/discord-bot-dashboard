import { Sun, Moon, Monitor, Download } from "lucide-react";
import Card from "components/card/Card";
import { useContext } from "react";
import { SettingsContext } from "contexts/SettingsContext";
import { SelectField } from "components/fields/SelectField";
import { Languages, Locale, useLocale } from "utils/Language";
import { SegmentedControl } from "components/ui/segmented-control";
import { Button } from "components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "components/ui/tooltip";

const ACCENT_COLORS = [
  { value: "brand", color: "#8B5CF6", label: "Purple" },
  { value: "blue", color: "#3B82F6", label: "Blue" },
  { value: "teal", color: "#14B8A6", label: "Teal" },
  { value: "green", color: "#10B981", label: "Green" },
  { value: "orange", color: "#F59E0B", label: "Orange" },
  { value: "pink", color: "#EC4899", label: "Pink" },
];

export default function Settings({ ...rest }) {
  const { updateSettings, language, colorScheme, accentColor } = useContext(SettingsContext);
  const locale = useLocale();

  const handleExportSettings = () => {
    const data = { language, colorScheme, accentColor };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dashboard-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="mb-5" {...rest}>
      <span className="block w-full text-(--text-primary) font-bold text-xl font-['Space_Grotesk'] mb-7.5">
        <Locale zh="用戶設置" en="Settings" />
      </span>

      {/* Appearance */}
      <div className="flex flex-col gap-2 mb-5">
        <span className="text-sm font-semibold text-(--text-muted) uppercase tracking-[0.5px]">
          <Locale zh="外觀" en="Appearance" />
        </span>
        <div className="flex items-center justify-between">
          <span className="text-sm text-(--text-primary) font-medium">
            <Locale zh="主題" en="Theme" />
          </span>
          <SegmentedControl
            value={colorScheme}
            onValueChange={(v) => updateSettings({ colorScheme: v })}
            items={[
              { value: 'light', label: <Sun className="h-4 w-4" /> },
              { value: 'auto', label: <Monitor className="h-4 w-4" /> },
              { value: 'dark', label: <Moon className="h-4 w-4" /> },
            ]}
            size="sm"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-(--text-primary) font-medium">
            <Locale zh="強調色" en="Accent Color" />
          </span>
          <TooltipProvider>
            <div className="flex items-center gap-1.5">
              {ACCENT_COLORS.map(({ value, color, label }) => (
                <Tooltip key={value}>
                  <TooltipTrigger asChild>
                    <div
                      className="h-5.5 w-5.5 rounded-full cursor-pointer"
                      style={{
                        backgroundColor: color,
                        outline: (accentColor || "brand") === value
                          ? "2px solid var(--text-primary)"
                          : "2px solid transparent",
                        outlineOffset: 2,
                      }}
                      onClick={() => updateSettings({ accentColor: value })}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top">{label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>
      </div>

      {/* Language */}
      <div className="flex flex-col gap-2 mb-5">
        <span className="text-sm font-semibold text-(--text-muted) uppercase tracking-[0.5px]">
          <Locale zh="語言" en="Language" />
        </span>
        <SelectField
          value={language}
          options={Languages}
          onChange={(lang) =>
            updateSettings({
              language: lang,
            })
          }
        />
      </div>

      {/* Data */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-(--text-muted) uppercase tracking-[0.5px]">
          <Locale zh="資料" en="Data" />
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExportSettings}
        >
          <Download className="h-4 w-4 mr-2" />
          <Locale zh="匯出設定" en="Export Settings" />
        </Button>
      </div>
    </Card>
  );
}
