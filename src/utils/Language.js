import {useCallback, useContext} from "react";
import {SettingsContext} from "../contexts/SettingsContext";
import { en, zh } from "../locales";

const locales = { en, zh };

export const Languages = [
    { label: "Chinese", value: "zh"},
    { label: "English", value: "en"}
]

/**
 *
 * @param lang {string}
 * @param props? {string | {[key: string]: string}}
 * @return {string}
 */
export function locale(lang, props) {
    if (props == null) return props

    if (typeof props === "string")
        return props

    return props[lang] || props["en"]
}

/**
 * @return {(props: string | {[key: string]: string}) => string}
 */
export function useLocale() {
    const {language} = useContext(SettingsContext)

    return (props) => locale(language, props)
}

/**
 * @param props {{[key: string]: string}}
 * @constructor
 */
export function Locale(props) {
    const {language} = useContext(SettingsContext)

    return props[language] || props["en"]
}

/**
 * Translation hook that reads from centralized locale files.
 * Supports parameter interpolation: t("dashboard.welcome", { username: "John" })
 *
 * @return {{ t: (key: string, params?: Record<string, string|number>) => string, language: string }}
 */
export function useTranslation() {
    const {language} = useContext(SettingsContext)
    const messages = locales[language] || locales.en;
    const fallback = locales.en;

    const t = useCallback((key, params) => {
        let text = messages[key] ?? fallback[key] ?? key;
        if (params) {
            for (const [k, v] of Object.entries(params)) {
                text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
            }
        }
        return text;
    }, [messages, fallback]);

    return { t, language };
}