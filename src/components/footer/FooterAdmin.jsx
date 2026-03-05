import React from "react";
import { config } from "config/config";
import Footer from "./Footer";
import { useLocale } from "utils/Language";

export default function AdminFooter() {
    const locale = useLocale();

    return (
        <Footer>
            <div className="flex gap-5 md:gap-11">
                {config.footer.map((item, i) => (
                    <a
                        key={i}
                        className="font-medium"
                        style={{ color: "var(--text-secondary)" }}
                        href={item.url}
                    >
                        {locale(item.name)}
                    </a>
                ))}
            </div>
        </Footer>
    );
}
