import {createContext, useEffect, useState} from "react";
import {useTheme} from "next-themes";

export const SettingsContext = createContext({
    updateSettings: (settings) => {},
    devMode: null,
    fixedWidth: null,
    language: "en",
    colorScheme: "system",
    sidebarCollapsed: false,
    accentColor: "brand",
})

export function SettingsProvider({children}) {
    const { setTheme } = useTheme();
    const [settings, setSetting] = useState(() => ({
        devMode: getItem("dev_mode", false),
        fixedWidth: getItem("fixedWidth", true),
        language: getItem("lang", "en"),
        colorScheme: getItem("colorScheme", "system"),
        sidebarCollapsed: getItem("sidebarCollapsed", false),
        accentColor: getItem("accentColor", "brand"),
        updateSettings: (v) => {
            setSetting(prev => ({
                ...prev,
                ...v
            }))
        }
    }))

    useEffect(() => {
            try {
                localStorage.setItem("lang", settings.language)
                localStorage.setItem("dev_mode", settings.devMode)
                localStorage.setItem("fixedWidth", settings.fixedWidth)
                localStorage.setItem("colorScheme", JSON.stringify(settings.colorScheme))
                localStorage.setItem("sidebarCollapsed", JSON.stringify(settings.sidebarCollapsed))
                localStorage.setItem("accentColor", JSON.stringify(settings.accentColor))
            } catch {
                // localStorage quota exceeded — settings will not persist this session
            }
            // Map "auto" to "system" for next-themes compatibility
            const themeValue = settings.colorScheme === "auto" ? "system" : settings.colorScheme;
            setTheme(themeValue)
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
