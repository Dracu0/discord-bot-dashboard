import { Alert, Button, Group, Transition } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useAlertBg, useSuccessBg, useTextColor } from "../../utils/colors";
import { Locale } from "../../utils/Language";
import { contentWidth } from "../../utils/layout-tokens";

function BaseAlert({ isOpen, children }) {
    const alertBg = useAlertBg();
    const mainText = useTextColor();

    return (
        <Transition mounted={isOpen} transition="slide-up" duration={200}>
            {(styles) => (
                <Alert
                    icon={<IconAlertTriangle size={20} />}
                    color="yellow"
                    style={{
                        ...styles,
                        position: "fixed",
                        bottom: 40,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: contentWidth,
                        maxWidth: "95vw",
                        zIndex: 40,
                        backdropFilter: "blur(16px)",
                        backgroundColor: alertBg,
                        color: mainText,
                        borderRadius: 20,
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

export function SaveAlert({ saving, visible, disabled, onSave, onDiscard }) {
    const brand = useSuccessBg();

    return (
        <BaseAlert isOpen={visible}>
            {disabled
                ? <Locale zh="請修正所有錯誤后再保存" en="Please fix errors before saving" />
                : <Locale zh="您有一些未保存的更改" en="You have some unsaved Changes" />
            }

            <Group ml="auto">
                <Button style={{ backgroundColor: brand }} loading={saving} disabled={disabled} onClick={onSave}>
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
    const brand = useSuccessBg();

    return (
        <BaseAlert isOpen={visible}>
            <Locale zh="您現在可以創建任務了" en="You can create the Task Now" />

            <Button ml="auto" style={{ backgroundColor: brand }} loading={loading} onClick={onSubmit}>
                <Locale zh="發布任務" en="Publish" />
            </Button>
        </BaseAlert>
    );
}