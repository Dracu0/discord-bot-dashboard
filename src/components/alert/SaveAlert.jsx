import { Button } from "components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "components/ui/tooltip";
import { AlertTriangle, Undo2, Redo2 } from "lucide-react";
import { cn } from "lib/utils";
import { Locale } from "../../utils/Language";

function BaseAlert({ isOpen, children }) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={cn(
                "fixed bottom-10 left-1/2 -translate-x-1/2 z-40 w-[calc(100vw-2rem)] sm:w-auto sm:max-w-[95vw]",
                "flex flex-wrap items-center gap-3 px-4 py-3",
                "transition-all duration-200 ease-out",
                isOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
            )}
            style={{
                backdropFilter: "blur(16px)",
                backgroundColor: "var(--surface-overlay)",
                color: "var(--text-primary)",
                borderRadius: "var(--radius-lg)",
            }}
        >
            <AlertTriangle size={20} className="shrink-0 text-yellow-500" />
            {children}
        </div>
    );
}

export function SaveAlert({ saving, visible, disabled, errorCount = 0, changeCount = 0, onSave, onDiscard, canUndo, canRedo, onUndo, onRedo }) {
    return (
        <BaseAlert isOpen={visible}>
            <div className="min-w-0">
                <span className="block text-sm font-medium">
                    {disabled
                        ? <Locale zh="\u8acb\u4fee\u6b63\u932f\u8aa4\u5f8c\u518d\u4fdd\u5b58" en="Fix validation errors before saving" />
                        : <Locale zh="\u60a8\u6709\u672a\u4fdd\u5b58\u7684\u8b8a\u66f4" en="You have unsaved changes" />
                    }
                </span>
                <span className="block text-xs text-(--text-secondary)">
                    {disabled
                        ? `${errorCount} error${errorCount === 1 ? "" : "s"} detected`
                        : `${changeCount} field${changeCount === 1 ? "" : "s"} changed`
                    }
                    {" · "}
                    <Locale zh="快捷鍵：Ctrl+S 保存" en="Shortcut: Ctrl+S to save" />
                </span>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
                <TooltipProvider>
                    {onUndo && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={!canUndo}
                                    onClick={onUndo}
                                    aria-label="Undo"
                                >
                                    <Undo2 size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Undo (Ctrl+Z)</TooltipContent>
                        </Tooltip>
                    )}
                    {onRedo && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={!canRedo}
                                    onClick={onRedo}
                                    aria-label="Redo"
                                >
                                    <Redo2 size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Redo (Ctrl+Shift+Z)</TooltipContent>
                        </Tooltip>
                    )}
                </TooltipProvider>
                <Button
                    style={{ backgroundColor: "var(--status-success)" }}
                    disabled={saving || disabled}
                    onClick={onSave}
                >
                    {saving && (
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    <Locale zh="\u7acb\u5373\u4fdd\u5b58" en="Save Now" />
                </Button>
                <Button variant="outline" onClick={onDiscard}>
                    <Locale zh="\u653e\u68c4\u66f4\u6539" en="Discard" />
                </Button>
            </div>
        </BaseAlert>
    );
}

export function SubmitAlert({ loading, visible, onSubmit }) {
    return (
        <BaseAlert isOpen={visible}>
            <span>
                <Locale zh="\u60a8\u73fe\u5728\u53ef\u4ee5\u5275\u5efa\u4efb\u52d9\u4e86" en="You can create the Task Now" />
            </span>

            <Button
                className="ml-auto"
                style={{ backgroundColor: "var(--status-success)" }}
                disabled={loading}
                onClick={onSubmit}
            >
                {loading && (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                <Locale zh="\u767c\u5e03\u4efb\u52d9" en="Publish" />
            </Button>
        </BaseAlert>
    );
}
