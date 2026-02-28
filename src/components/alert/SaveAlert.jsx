import { Alert, ActionIcon, Button, Group, Tooltip, Transition } from "@mantine/core";
import { IconAlertTriangle, IconArrowBackUp, IconArrowForwardUp } from "@tabler/icons-react";
import { Locale } from "../../utils/Language";
import { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";
import { contentWidth, contentWidthCollapsed } from "../../utils/layout-tokens";

function BaseAlert({ isOpen, children }) {
    const { sidebarCollapsed } = useContext(SettingsContext);
    const width = sidebarCollapsed ? contentWidthCollapsed : contentWidth;

    return (
        <Transition mounted={isOpen} transition="slide-up" duration={200}>
            {(styles) => (
                <Alert
                    icon={<IconAlertTriangle size={20} />}
                    color="yellow"
                    role="status"
                    aria-live="polite"
                    style={{
                        ...styles,
                        position: "fixed",
                        bottom: 40,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width,
                        maxWidth: "95vw",
                        zIndex: 40,
                        backdropFilter: "blur(16px)",
                        backgroundColor: "var(--surface-overlay)",
                        color: "var(--text-primary)",
                        borderRadius: "var(--radius-lg)",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    {children}
                </Alert>
            )}
        </Transition>
    );
}

export function SaveAlert({ saving, visible, disabled, onSave, onDiscard, canUndo, canRedo, onUndo, onRedo }) {
    return (
        <BaseAlert isOpen={visible}>
            {disabled
                ? <Locale zh="請修正所有錯誤后再保存" en="Please fix errors before saving" />
                : <Locale zh="您有一些未保存的更改" en="You have some unsaved Changes" />
            }

            <Group ml="auto" gap="xs">
                {onUndo && (
                    <Tooltip label="Undo (Ctrl+Z)" position="top">
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            disabled={!canUndo}
                            onClick={onUndo}
                            aria-label="Undo"
                        >
                            <IconArrowBackUp size={18} />
                        </ActionIcon>
                    </Tooltip>
                )}
                {onRedo && (
                    <Tooltip label="Redo (Ctrl+Shift+Z)" position="top">
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            disabled={!canRedo}
                            onClick={onRedo}
                            aria-label="Redo"
                        >
                            <IconArrowForwardUp size={18} />
                        </ActionIcon>
                    </Tooltip>
                )}
                <Button style={{ backgroundColor: "var(--status-success)" }} loading={saving} disabled={disabled} onClick={onSave}>
                    <Locale zh="立即保存" en="Save Now" />
                </Button>
                <Button variant="default" onClick={onDiscard}>
                    <Locale zh="放棄更改" en="Discard" />
                </Button>
            </Group>
        </BaseAlert>
    );
}

export function SubmitAlert({ loading, visible, onSubmit }) {
    return (
        <BaseAlert isOpen={visible}>
            <Locale zh="您現在可以創建任務了" en="You can create the Task Now" />

            <Button ml="auto" style={{ backgroundColor: "var(--status-success)" }} loading={loading} onClick={onSubmit}>
                <Locale zh="發布任務" en="Publish" />
            </Button>
        </BaseAlert>
    );
}