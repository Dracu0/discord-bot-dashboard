import React, { useState } from "react";
import { Alert, ActionIcon, Button, Group, Tooltip, Box } from "@mantine/core";
import { IconAlertTriangle, IconArrowBackUp, IconArrowForwardUp } from "@tabler/icons-react";

// Inline presentational version (avoids SettingsContext dependency)
function SaveAlertPresentation({ visible, disabled, saving, canUndo, canRedo }) {
    const [open, setOpen] = useState(visible);
    return open ? (
        <Alert
            icon={<IconAlertTriangle size={20} />}
            color="yellow"
            role="status"
            style={{
                position: "fixed",
                bottom: 40,
                left: "50%",
                transform: "translateX(-50%)",
                width: "min(800px, 95vw)",
                zIndex: 40,
                backdropFilter: "blur(16px)",
                backgroundColor: "rgba(30,30,50,0.9)",
                color: "white",
                borderRadius: 12,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
            }}
        >
            {disabled ? "Please fix errors before saving" : "You have some unsaved Changes"}
            <Group ml="auto" gap="xs">
                <Tooltip label="Undo (Ctrl+Z)" position="top">
                    <ActionIcon variant="subtle" color="gray" disabled={!canUndo} aria-label="Undo">
                        <IconArrowBackUp size={18} />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Redo (Ctrl+Shift+Z)" position="top">
                    <ActionIcon variant="subtle" color="gray" disabled={!canRedo} aria-label="Redo">
                        <IconArrowForwardUp size={18} />
                    </ActionIcon>
                </Tooltip>
                <Button color="green" loading={saving} disabled={disabled} onClick={() => setOpen(false)}>
                    Save Now
                </Button>
                <Button variant="default" onClick={() => setOpen(false)}>
                    Discard
                </Button>
            </Group>
        </Alert>
    ) : (
        <Box ta="center" py="xl">
            <Button onClick={() => setOpen(true)}>Show Save Alert</Button>
        </Box>
    );
}

export default {
    title: "Dashboard/SaveAlert",
};

export const Default = () => <SaveAlertPresentation visible canUndo canRedo />;
export const Saving = () => <SaveAlertPresentation visible saving canUndo canRedo />;
export const WithErrors = () => <SaveAlertPresentation visible disabled />;
export const NoUndoRedo = () => <SaveAlertPresentation visible />;
