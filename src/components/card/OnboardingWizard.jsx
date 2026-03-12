import React, { useContext, useState } from "react";
import { Rocket, Puzzle, Check, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GuildContext } from "contexts/guild/GuildContext";
import { config } from "config/config";
import { Locale, useLocale } from "utils/Language";
import { setFeatureEnabled } from "api/internal";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import { Stepper, StepperStep } from "components/ui/stepper";
import Card from "components/card/Card";
import { toast } from "sonner";

const RECOMMENDED_FEATURES = ["welcome", "xp", "modlog", "automod"];

export default function OnboardingWizard({ enabledFeatures, onDismiss }) {
  const locale = useLocale();
  const navigate = useNavigate();
  const { id: serverId } = useContext(GuildContext);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(new Set(RECOMMENDED_FEATURES));
  const [saving, setSaving] = useState(false);

  const allFeatures = Object.entries(config.features).map(([id, feat]) => ({
    id,
    name: typeof feat.name === "object" ? locale(feat.name) : feat.name,
    description: typeof feat.description === "object" ? locale(feat.description) : feat.description,
    recommended: RECOMMENDED_FEATURES.includes(id),
  }));

  const toggleFeature = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const goToFeatures = async () => {
    if (selected.size > 0) {
      setSaving(true);
      try {
        await Promise.all(
          [...selected].map(featureId => setFeatureEnabled(serverId, featureId, true))
        );
        toast.success(`${selected.size} feature${selected.size > 1 ? "s" : ""} enabled`);
      } catch (err) {
        console.error("Failed to enable onboarding features:", err);
        toast.error("Failed to enable some features");
      } finally {
        setSaving(false);
      }
    }
    navigate(`/guild/${serverId}/features`);
  };

  // Don't show if there are already enabled features
  if (enabledFeatures && enabledFeatures.length > 0) return null;

  return (
    <Card variant="panel" className="mb-6 rounded-[28px] p-6">
      <Stepper activeStep={step} size="sm">
        {/* Step 0: Welcome */}
        <StepperStep
          label={locale({ zh: "歡迎", en: "Welcome" })}
          icon={<Rocket className="h-4 w-4" />}
        >
          <div className="flex flex-col items-center py-6 gap-4">
            <div
              className="flex items-center justify-center h-16 w-16 rounded-full"
              style={{ background: "var(--surface-secondary)" }}
            >
              <Rocket className="h-8 w-8 text-violet-500" />
            </div>
            <h3 className="text-(--text-primary) font-['Space_Grotesk'] text-center m-0 text-lg font-semibold">
              <Locale zh="初始化設定" en="Initial Setup" />
            </h3>
            <p className="text-(--text-secondary) text-sm text-center max-w-125 m-0">
              <Locale
                zh="此伺服器尚未啟用功能，請先選擇要啟用的模組。"
                en="No features are configured for this server yet. Select the modules to enable."
              />
            </p>
            <div className="flex items-center gap-3 mt-4">
              <Button size="lg" onClick={() => setStep(1)}>
                <Locale zh="開始" en="Start" />
              </Button>
              <Button variant="ghost" onClick={onDismiss}>
                <Locale zh="稍後再說" en="Maybe Later" />
              </Button>
            </div>
          </div>
        </StepperStep>

        {/* Step 1: Choose features */}
        <StepperStep
          label={locale({ zh: "選擇功能", en: "Choose Features" })}
          icon={<Puzzle className="h-4 w-4" />}
        >
          <div className="py-4">
            <p className="text-sm text-(--text-secondary) mb-4 m-0">
              <Locale
                zh="選擇要啟用的功能，可稍後再調整。"
                en="Select features to enable. You can adjust them later."
              />
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {allFeatures.map(feat => (
                <div
                  key={feat.id}
                  role="checkbox"
                  aria-checked={selected.has(feat.id)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleFeature(feat.id);
                    }
                  }}
                  className="p-3 rounded-md border cursor-pointer transition-all duration-150"
                  style={{
                    borderColor: selected.has(feat.id) ? "var(--accent-primary)" : "var(--border-subtle)",
                    background: selected.has(feat.id) ? "var(--surface-secondary)" : "transparent",
                  }}
                  onClick={() => toggleFeature(feat.id)}
                >
                  <div className="flex items-center gap-2 flex-nowrap">
                    <Checkbox
                      checked={selected.has(feat.id)}
                      onCheckedChange={() => toggleFeature(feat.id)}
                      className="cursor-pointer shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-(--text-primary) line-clamp-1">
                          {feat.name}
                        </span>
                        {feat.recommended && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-violet-500/20 text-violet-400">
                            <Locale zh="推薦" en="Rec" />
                          </Badge>
                        )}
                      </div>
                      {feat.description && (
                        <span className="text-xs text-(--text-secondary) line-clamp-2 mt-0.5 block">
                          {feat.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(0)}>
                <Locale zh="上一步" en="Back" />
              </Button>
              <Button onClick={() => setStep(2)}>
                <Locale zh="繼續" en="Continue" />
                {selected.size > 0 && (
                  <Badge className="ml-2 text-xs px-1.5 py-0 bg-white text-black">
                    {selected.size}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </StepperStep>

        {/* Step 2: Review & Go */}
        <StepperStep
          label={locale({ zh: "完成", en: "Finish" })}
          icon={<Check className="h-4 w-4" />}
        >
          <div className="flex flex-col items-center py-6 gap-4">
            <div
              className="flex items-center justify-center h-16 w-16 rounded-full"
              style={{ background: "var(--surface-secondary)" }}
            >
              <Settings className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-(--text-primary) font-['Space_Grotesk'] text-center m-0 text-lg font-semibold">
              <Locale zh="設定完成" en="Setup Complete" />
            </h3>
            <p className="text-(--text-secondary) text-sm text-center max-w-125 m-0">
              {selected.size > 0 ? (
                <Locale
                  zh={`已選擇 ${selected.size} 個功能。前往功能面板完成設定。`}
                  en={`${selected.size} feature(s) selected. Open Features to finish configuration.`}
                />
              ) : (
                <Locale
                  zh="可隨時在功能面板啟用功能。"
                  en="You can enable features anytime from the Features panel."
                />
              )}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <Button
                size="lg"
                onClick={goToFeatures}
                disabled={saving}
              >
                {saving && (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                <Puzzle className="h-4.5 w-4.5 mr-2" />
                <Locale zh="前往功能面板" en="Go to Features" />
              </Button>
              <Button variant="outline" onClick={() => setStep(1)}>
                <Locale zh="上一步" en="Back" />
              </Button>
            </div>
          </div>
        </StepperStep>
      </Stepper>
    </Card>
  );
}
