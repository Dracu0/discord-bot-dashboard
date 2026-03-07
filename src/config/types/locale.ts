import React from "react";

export type MultiLang = string | {
    en: string
    [lang: string]: string
}

export type TextElement = string | React.ReactNode