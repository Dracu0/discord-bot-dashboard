import { useCallback } from "react";
import { en } from "../locales";

const locales = { en };

export const Languages = [
    { label: "English", value: "en" }
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

    return props["en"]
}

/**
 * @return {(props: string | {[key: string]: string}) => string}
 */
export function useLocale() {
    return (props) => locale("en", props)
}

/**
 * @param props {{[key: string]: string}}
 * @constructor
 */
export function Locale(props) {
    return props["en"]
}

/**
 * Translation hook that reads from centralized locale files.
 * Supports parameter interpolation: t("dashboard.welcome", { username: "John" })
 *
 * @return {{ t: (key: string, params?: Record<string, string|number>) => string, language: string }}
 */
export function useTranslation() {
    const messages = locales.en;
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

    return { t, language: "en" };
}