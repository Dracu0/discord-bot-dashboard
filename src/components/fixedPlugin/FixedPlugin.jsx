import React, { useMemo } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "components/ui/button";

export default function FixedPlugin(props) {
    const { ...rest } = props;
    const { resolvedTheme, setTheme } = useTheme();

    const isRtl = useMemo(() => document.documentElement.dir === "rtl", []);

    const toggleColorScheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    return (
        <Button
            {...rest}
            variant="ghost"
            size="icon"
            onClick={toggleColorScheme}
            className="rounded-full"
            style={{
                position: "fixed",
                right: isRtl ? undefined : 35,
                left: isRtl ? 35 : undefined,
                bottom: 30,
                zIndex: 50,
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 50%, #22D3EE 100%)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                boxShadow: "0 4px 24px rgba(124, 58, 237, 0.4)",
                transition: "all 0.25s ease",
            }}
        >
            {resolvedTheme === "light" ? (
                <Moon size={22} color="white" />
            ) : (
                <Sun size={22} color="white" />
            )}
        </Button>
    );
}
