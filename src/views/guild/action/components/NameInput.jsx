import { Text } from "@mantine/core";
import { InputField } from "components/fields/impl/InputField";
import Card from "components/card/Card";
import React from "react";
import { Locale, useLocale } from "utils/Language";

export default function NameInput({ value, onChange }) {
    const locale = useLocale();

    return (
        <Card gap={5}>
            <div>
                <label style={{ fontSize: "1.125rem", fontWeight: "bold", display: "block", marginBottom: 4 }}>
                    <Locale zh="任務名稱" en="Task Name" /> *
                </label>
                <InputField
                    value={value}
                    placeholder={locale({ zh: "請輸入文字", en: "Please enter Text" })}
                    onChange={({ target }) => onChange(target.value)}
                />
                <Text fz="sm" c="dimmed" mt={4}>
                    <Locale zh="你必須輸入一個名字" en="You must enter a Name" />
                </Text>
            </div>
        </Card>
    );
}