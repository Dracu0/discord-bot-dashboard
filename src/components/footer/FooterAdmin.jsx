import React from "react";
import { config } from "config/config";
import Footer from "./Footer";
import { useLocale } from "utils/Language";

export default function AdminFooter() {
    const locale = useLocale();

    return (
        <Footer>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:justify-end md:gap-6">
                {config.footer.map((item, i) => (
                    <a
                        key={i}
                        className="font-medium text-(--text-secondary) transition-colors duration-150 hover:text-(--text-primary)"
                        href={item.url}
                    >
                        {locale(item.name)}
                    </a>
                ))}
            </div>
        </Footer>
    );
}
