import { InputField } from "components/fields/impl/InputField";
import Card from "components/card/Card";
import React from "react";
import { Locale, useLocale } from "utils/Language";

export default function NameInput({ value, onChange }) {
    const locale = useLocale();

    return (
        <Card className="gap-1">
            <div>
                <label className="text-lg font-bold block mb-1">
                    <Locale zh="任務名稱" en="Task Name" /> *
                </label>
                <InputField
                    value={value}
                    placeholder={locale({ zh: "請輸入文字", en: "Please enter Text" })}
                    onChange={({ target }) => onChange(target.value)}
                />
                <span className="text-sm text-[var(--text-secondary)] mt-1 block">
                    <Locale zh="你必須輸入一個名字" en="You must enter a Name" />
                </span>
            </div>
        </Card>
    );
}
