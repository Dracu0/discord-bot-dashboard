import React from "react";
import { homepage } from "variables/links";
import { config } from "config/config";
import { Locale } from "../../utils/Language";

export default function Footer({ children }) {
    return (
        <div
            className="flex flex-col xl:flex-row items-center xl:items-start justify-between px-4 sm:px-6 md:px-[50px] pb-[30px]"
            style={{ zIndex: 1 }}
        >
            <p
                className="text-sm text-center xl:text-start mb-5 xl:mb-0"
                style={{ color: "var(--text-secondary)" }}
            >
                &copy; {new Date().getFullYear()}
                <span className="font-medium ms-1">
                    {config.name} Dashboard.
                    <Locale
                        zh=" \u7248\u6b0a\u6240\u6709\u3002\u57fa\u65bc"
                        en=" All Rights Reserved. Built with"
                    />
                    <a
                        className="mx-1 font-semibold"
                        style={{ color: "var(--accent-primary)" }}
                        href={homepage}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Discord Dashboard
                    </a>
                </span>
            </p>
            {children}
        </div>
    );
}
