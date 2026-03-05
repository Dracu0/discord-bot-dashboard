import React, { useContext, useState } from "react";
import {
    Box, Button, Card, Checkbox, Group, Stepper, Stack, Text, Title,
    ThemeIcon, SimpleGrid, Paper, Badge,
} from "@mantine/core";
import { IconRocket, IconPuzzle, IconCheck, IconSettings } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { GuildContext } from "contexts/guild/GuildContext";
import { config } from "config/config";
import { Locale, useLocale } from "utils/Language";
import { setFeatureEnabled } from "api/internal";

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
            } catch (err) {
                console.error("Failed to enable onboarding features:", err);
            } finally {
                setSaving(false);
            }
        }
        navigate(`/guild/${serverId}/features`);
    };

    // Don't show if there are already enabled features
    if (enabledFeatures && enabledFeatures.length > 0) return null;

    return (
        <Paper
            p="xl"
            radius="lg"
            mb={24}
            style={{
                background: "linear-gradient(135deg, var(--surface-card) 0%, var(--surface-secondary) 100%)",
                border: "1px solid var(--border-subtle)",
            }}
        >
            <Stepper
                active={step}
                size="sm"
                color="var(--accent-primary)"
                styles={{
                    stepIcon: { backgroundColor: "var(--surface-secondary)" },
                    stepBody: { color: "var(--text-primary)" },
                }}
            >
                {/* Step 0: Welcome */}
                <Stepper.Step
                    label={locale({ zh: "歡迎", en: "Welcome" })}
                    icon={<IconRocket size={16} />}
                >
                    <Stack align="center" py="lg" gap="md">
                        <ThemeIcon size={64} radius="xl" variant="light" color="violet">
                            <IconRocket size={32} />
                        </ThemeIcon>
                        <Title order={3} c="var(--text-primary)" ff="'Space Grotesk', sans-serif" ta="center">
                            <Locale zh="歡迎使用 Mocotron 儀表板！" en="Welcome to the Mocotron Dashboard!" />
                        </Title>
                        <Text c="var(--text-secondary)" fz="sm" ta="center" maw={500}>
                            <Locale
                                zh="看起來您還沒有為此伺服器配置任何功能。讓我們幫您快速設置！"
                                en="It looks like you haven't configured any features for this server yet. Let's get you set up quickly!"
                            />
                        </Text>
                        <Group mt="md">
                            <Button onClick={() => setStep(1)} size="md">
                                <Locale zh="開始設置" en="Get Started" />
                            </Button>
                            <Button variant="subtle" color="gray" onClick={onDismiss}>
                                <Locale zh="稍後再說" en="Maybe Later" />
                            </Button>
                        </Group>
                    </Stack>
                </Stepper.Step>

                {/* Step 1: Choose features */}
                <Stepper.Step
                    label={locale({ zh: "選擇功能", en: "Choose Features" })}
                    icon={<IconPuzzle size={16} />}
                >
                    <Box py="md">
                        <Text fz="sm" c="var(--text-secondary)" mb="md">
                            <Locale
                                zh="選擇要啟用的功能。您可以隨時在功能面板中更改。"
                                en="Select which features you'd like to enable. You can always change this later in the Features panel."
                            />
                        </Text>
                        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
                            {allFeatures.map(feat => (
                                <Card
                                    key={feat.id}
                                    padding="sm"
                                    radius="md"
                                    withBorder
                                    role="checkbox"
                                    aria-checked={selected.has(feat.id)}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            toggleFeature(feat.id);
                                        }
                                    }}
                                    style={{
                                        cursor: "pointer",
                                        borderColor: selected.has(feat.id) ? "var(--accent-primary)" : "var(--border-subtle)",
                                        background: selected.has(feat.id) ? "var(--surface-secondary)" : "transparent",
                                        transition: "all 0.15s ease",
                                    }}
                                    onClick={() => toggleFeature(feat.id)}
                                >
                                    <Group gap="sm" wrap="nowrap">
                                        <Checkbox
                                            checked={selected.has(feat.id)}
                                            onChange={() => toggleFeature(feat.id)}
                                            size="sm"
                                            styles={{ input: { cursor: "pointer" } }}
                                        />
                                        <Box style={{ flex: 1, minWidth: 0 }}>
                                            <Group gap={6}>
                                                <Text fz="sm" fw={600} c="var(--text-primary)" lineClamp={1}>
                                                    {feat.name}
                                                </Text>
                                                {feat.recommended && (
                                                    <Badge size="xs" color="violet" variant="light">
                                                        <Locale zh="推薦" en="Rec" />
                                                    </Badge>
                                                )}
                                            </Group>
                                            {feat.description && (
                                                <Text fz="xs" c="var(--text-secondary)" lineClamp={2} mt={2}>
                                                    {feat.description}
                                                </Text>
                                            )}
                                        </Box>
                                    </Group>
                                </Card>
                            ))}
                        </SimpleGrid>
                        <Group justify="space-between" mt="lg">
                            <Button variant="default" onClick={() => setStep(0)}>
                                <Locale zh="上一步" en="Back" />
                            </Button>
                            <Button onClick={() => setStep(2)}>
                                <Locale zh="繼續" en="Continue" />
                                {selected.size > 0 && (
                                    <Badge ml="xs" size="xs" color="white" variant="filled" c="dark">
                                        {selected.size}
                                    </Badge>
                                )}
                            </Button>
                        </Group>
                    </Box>
                </Stepper.Step>

                {/* Step 2: Review & Go */}
                <Stepper.Step
                    label={locale({ zh: "完成", en: "Finish" })}
                    icon={<IconCheck size={16} />}
                >
                    <Stack align="center" py="lg" gap="md">
                        <ThemeIcon size={64} radius="xl" variant="light" color="green">
                            <IconSettings size={32} />
                        </ThemeIcon>
                        <Title order={3} c="var(--text-primary)" ff="'Space Grotesk', sans-serif" ta="center">
                            <Locale zh="準備就緒！" en="You're All Set!" />
                        </Title>
                        <Text c="var(--text-secondary)" fz="sm" ta="center" maw={500}>
                            {selected.size > 0 ? (
                                <Locale
                                    zh={`您選擇了 ${selected.size} 個功能。前往功能面板啟用並配置它們。`}
                                    en={`You've selected ${selected.size} feature(s). Head to the Features panel to enable and configure them.`}
                                />
                            ) : (
                                <Locale
                                    zh="您可以隨時在功能面板中啟用功能。"
                                    en="You can enable features anytime from the Features panel."
                                />
                            )}
                        </Text>
                        <Group mt="md">
                            <Button
                                size="md"
                                leftSection={<IconPuzzle size={18} />}
                                onClick={goToFeatures}
                                loading={saving}
                            >
                                <Locale zh="前往功能面板" en="Go to Features" />
                            </Button>
                            <Button variant="default" onClick={() => setStep(1)}>
                                <Locale zh="上一步" en="Back" />
                            </Button>
                        </Group>
                    </Stack>
                </Stepper.Step>
            </Stepper>
        </Paper>
    );
}
