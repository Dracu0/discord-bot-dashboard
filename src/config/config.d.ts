import {Option} from "./types/option";
import {DataItem} from "./types/data";
import {MultiLang, TextElement} from "./types/locale";

export declare const config: ConfigType

export type PageState = {
    /**
     * User's Language
     */
    lang: "en" | "zh"
    /**
     * Color scheme determined by the resolved theme
     */
    darkMode: boolean
    /**
     * User-configured color scheme preference
     */
    colorScheme?: "light" | "dark" | "system" | "auto"
}

export type DashboardState = PageState & {
    /**
     * Advanced Data, only exists if `advanced` is true
     */
    advanced: any | undefined
}

export type OptionState = PageState & {
    /**
     * Additional Data, Defined by Server
     */
    data: any
}

export type DashboardDataRow = {
    advanced: boolean,
    count: number,
    label?: string,
    items: (detail: any, state: DashboardState) => DataItem[]
}

type FooterItem = {
    name: MultiLang,
    url: string
}

export type ConfigType = {
    name: string,
    actions: {
        [key: string]: {
            banner?: any,
            name: MultiLang,
            description: TextElement,
            options: (data: any | null, state: OptionState) => Option[]
        }
    },
    features: {
        [key: string]: {
            banner?: any,
            name: MultiLang,
            description: TextElement,
            canToggle?: boolean,
            options: (data: any, state: OptionState) => Option[]
        }
    },
    settings: (data: any) => Option[]
    data: {
        features?: (data: any) => DataItem[],
        dashboard: DashboardDataRow[],
        actions?: (data: any) => DataItem[]
    },
    footer: FooterItem[],
    serverUrl: string,
    inviteUrl: string,
    /**
     * The tutorial or document website of the bot
     */
    tutorialUrl?: string,
}