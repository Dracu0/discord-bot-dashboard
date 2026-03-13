import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "components/ui/dialog";
import { Button } from "components/ui/button";
import { Locale, useLocale } from "utils/Language";

export function EmptyModal({ children, isOpen, onClose, size, ...props }) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="sm:max-w-lg"
                style={{
                    maxWidth: size === "xl" ? "48rem" : undefined,
                }}
                {...props}
            >
                {children}
            </DialogContent>
        </Dialog>
    );
}

export default function Modal({ header, children, isOpen, onClose, ...props }) {
    const locale = useLocale();

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="sm:max-w-lg"
                style={{
                    maxWidth: props.size === "xl" ? "48rem" : undefined,
                }}
            >
                <DialogHeader>
                    <DialogTitle style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {locale(header)}
                    </DialogTitle>
                </DialogHeader>

                {children}

                <DialogFooter>
                    <Button onClick={onClose}>
                        <Locale zh="\u95dc\u9589" en="Close" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
