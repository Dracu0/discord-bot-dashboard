import {createContext, useEffect, useRef, useState} from "react";
import {useTheme} from "next-themes";
import {getUserPreferences, saveUserPreferences} from "api/internal";

// Accent color palettes — each maps to CSS custom property overrides
const ACCENT_PALETTES = {
    brand: {
        "--color-brand-300": "#C4B5FD",
        "--color-brand-400": "#A78BFA",
        "--color-brand-500": "#8B5CF6",
        "--color-brand-600": "#7C3AED",
    },
    blue: {
        "--color-brand-300": "#93C5FD",
        "--color-brand-400": "#60A5FA",
        "--color-brand-500": "#3B82F6",
        "--color-brand-600": "#2563EB",
    },
    teal: {
        "--color-brand-300": "#5EEAD4",
        "--color-brand-400": "#2DD4BF",
        "--color-brand-500": "#14B8A6",
        "--color-brand-600": "#0D9488",
    },
    green: {
        "--color-brand-300": "#6EE7B7",
        "--color-brand-400": "#34D399",
        "--color-brand-500": "#10B981",
        "--color-brand-600": "#059669",
    },
    orange: {
        "--color-brand-300": "#FCD34D",
        "--color-brand-400": "#FBBF24",
        "--color-brand-500": "#F59E0B",
        "--color-brand-600": "#D97706",
    },
    pink: {
        "--color-brand-300": "#F9A8D4",
        "--color-brand-400": "#F472B6",
        "--color-brand-500": "#EC4899",
        "--color-brand-600": "#DB2777",
    },
};

function applyAccentPalette(accent) {
    const root = document.documentElement;
    const palette = ACCENT_PALETTES[accent] || ACCENT_PALETTES.brand;
    for (const [prop, value] of Object.entries(palette)) {
        root.style.setProperty(prop, value);
    }
}

export const SettingsContext = createContext({
    updateSettings: (_settings) => {},
    language: "en",
    colorScheme: "system",
    sidebarCollapsed: false,
    accentColor: "brand",
})

export function SettingsProvider({children}) {
    const { setTheme } = useTheme();
    const serverSyncTimer = useRef(null);
    const hasFetchedServer = useRef(false);
    const isInitialMerge = useRef(true);

    const [settings, setSetting] = useState(() => ({
        language: "en",
        colorScheme: getItem("colorScheme", "system"),
        sidebarCollapsed: getItem("sidebarCollapsed", false),
        accentColor: getItem("accentColor", "brand"),
        updateSettings: (v) => {
            setSetting(prev => ({
                ...prev,
                ...v,
                language: "en",
            }))
        }
    }))

    // On mount: fetch preferences from server and merge (server wins over localStorage)
    useEffect(() => {
        if (hasFetchedServer.current) return;
        hasFetchedServer.current = true;

        getUserPreferences()
            .then(prefs => {
                if (prefs && typeof prefs === "object") {
                    isInitialMerge.current = true;
                    setSetting(prev => ({
                        ...prev,
                        ...(prefs.colorScheme ? { colorScheme: prefs.colorScheme } : {}),
                        ...(prefs.accentColor ? { accentColor: prefs.accentColor } : {}),
                        ...(typeof prefs.sidebarCollapsed === "boolean" ? { sidebarCollapsed: prefs.sidebarCollapsed } : {}),
                        language: "en",
                    }));
                }
            })
            .catch(() => {
                // Not logged in or network error — use localStorage values
            });
    }, []);

    // Persist to localStorage + theme immediately, debounce server save
    useEffect(() => {
            try {
                localStorage.setItem("lang", "en")
                localStorage.setItem("colorScheme", JSON.stringify(settings.colorScheme))
                localStorage.setItem("sidebarCollapsed", JSON.stringify(settings.sidebarCollapsed))
                localStorage.setItem("accentColor", JSON.stringify(settings.accentColor))
            } catch {
                // localStorage quota exceeded — settings will not persist this session
            }
            // Map "auto" to "system" for next-themes compatibility
            const themeValue = settings.colorScheme === "auto" ? "system" : settings.colorScheme;
            setTheme(themeValue)

            // Apply accent color palette to CSS custom properties
            applyAccentPalette(settings.accentColor)

            // Skip server save for the initial merge from server data
            if (isInitialMerge.current) {
                isInitialMerge.current = false;
                return;
            }

            // Debounce server save (500ms)
            if (serverSyncTimer.current) clearTimeout(serverSyncTimer.current);
            serverSyncTimer.current = setTimeout(() => {
                saveUserPreferences({
                    colorScheme: settings.colorScheme,
                    accentColor: settings.accentColor,
                    sidebarCollapsed: settings.sidebarCollapsed,
                }).catch(() => {});
            }, 500);

            return () => {
                if (serverSyncTimer.current) clearTimeout(serverSyncTimer.current);
            };
        },
        [settings, setTheme]
    )

    return <SettingsContext.Provider value={settings}>
        {children}
    </SettingsContext.Provider>
}

function getItem(key, initial) {
    let result;
    try {
        result = localStorage.getItem(key)
    } catch {
        return initial
    }

    if (result == null) {
        return initial
    }
    switch (typeof initial) {
        case "undefined":
        case "string":
            return result
        default:
            try {
                return JSON.parse(result)
            } catch {
                return initial
            }
    }
}
