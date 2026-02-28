import { Modal as MantineModal, Button } from "@mantine/core";
import { Locale, useLocale } from "utils/Language";
import { useColorValue } from "../../utils/colors";

export function EmptyModal({ children, isOpen, onClose, size, scrollBehavior, ...props }) {
    const bg = useColorValue("var(--mantine-color-gray-1)", "var(--mantine-color-dark-7)");

    return (
        <MantineModal
            centered
            opened={isOpen}
            onClose={onClose}
            size={size}
            overlayProps={{ backgroundOpacity: 0.3, blur: 16 }}
            radius="lg"
            styles={{
                content: { backgroundColor: bg },
                header: { backgroundColor: bg },
            }}
            scrollAreaComponent={scrollBehavior === "inside" ? undefined : undefined}
            {...props}
        >
            {children}
        </MantineModal>
    );
}

export default function Modal({ header, children, isOpen, onClose, ...props }) {
    const locale = useLocale();

    return (
        <EmptyModal isOpen={isOpen} onClose={onClose} title={<span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{locale(header)}</span>} {...props}>
            {children}

            <MantineModal.CloseButton style={{ position: "absolute", top: 12, right: 12 }} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <Button onClick={onClose}>
                    <Locale zh="關閉" en="Close" />
                </Button>
            </div>
        </EmptyModal>
    );
}