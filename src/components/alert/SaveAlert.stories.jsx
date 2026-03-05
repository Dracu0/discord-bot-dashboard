import React, { useState } from "react";
import { AlertTriangle, Undo2, Redo2 } from "lucide-react";
import { Button } from "components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import { Spinner } from "components/ui/spinner";
import { cn } from "lib/utils";

// Inline presentational version (avoids SettingsContext dependency)
function SaveAlertPresentation({ visible, disabled, saving, canUndo, canRedo }) {
    const [open, setOpen] = useState(visible);
    return open ? (
        <div
            role="status"
            className={cn(
                "fixed bottom-10 left-1/2 -translate-x-1/2 w-[min(800px,95vw)] z-40",
                "backdrop-blur-xl bg-[rgba(30,30,50,0.9)] text-white rounded-xl",
                "flex flex-row items-center gap-3 px-4 py-3"
            )}
        >
            <AlertTriangle size={20} className="text-amber-400 shrink-0" />
            <span className="text-sm">
                {disabled ? "Please fix errors before saving" : "You have some unsaved Changes"}
            </span>
            <div className="flex items-center gap-2 ml-auto">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                disabled={!canUndo}
                                aria-label="Undo"
                                className="text-gray-400 hover:text-white"
                            >
                                <Undo2 size={18} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Undo (Ctrl+Z)</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                disabled={!canRedo}
                                aria-label="Redo"
                                className="text-gray-400 hover:text-white"
                            >
                                <Redo2 size={18} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Redo (Ctrl+Shift+Z)</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Button
                    variant="success"
                    disabled={disabled || saving}
                    onClick={() => setOpen(false)}
                >
                    {saving && <Spinner size="sm" />}
                    Save Now
                </Button>
                <Button variant="outline" onClick={() => setOpen(false)}>
                    Discard
                </Button>
            </div>
        </div>
    ) : (
        <div className="text-center py-6">
            <Button onClick={() => setOpen(true)}>Show Save Alert</Button>
        </div>
    );
}

export default {
    title: "Dashboard/SaveAlert",
};

export const Default = () => <SaveAlertPresentation visible canUndo canRedo />;
export const Saving = () => <SaveAlertPresentation visible saving canUndo canRedo />;
export const WithErrors = () => <SaveAlertPresentation visible disabled />;
export const NoUndoRedo = () => <SaveAlertPresentation visible />;
