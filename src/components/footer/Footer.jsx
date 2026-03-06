import React from "react";
import { homepage } from "variables/links";
import { config } from "config/config";
import { Locale } from "../../utils/Language";

export default function Footer({ children }) {
    return (
        <footer className="px-4 pb-7 pt-4 sm:px-5 md:px-6 xl:px-7.5" style={{ zIndex: 1 }}>
            <div className="mx-auto flex flex-col gap-4 rounded-[28px] border border-(--border-subtle) bg-(--surface-card) px-5 py-4 shadow-(--shadow-sm) lg:flex-row lg:items-center lg:justify-between md:px-6">
                <p className="text-center text-sm leading-6 text-(--text-secondary) lg:text-left">
                    &copy; {new Date().getFullYear()}
                    <span className="ms-1 font-medium">
                        {config.name} Dashboard.
                        <Locale
                            zh=" \u7248\u6b0a\u6240\u6709\u3002\u57fa\u65bc"
                            en=" All Rights Reserved. Built with"
                        />
                        <a
                            className="mx-1 font-semibold text-(--accent-primary)"
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
        </footer>
    );
}
