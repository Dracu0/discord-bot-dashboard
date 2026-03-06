import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "lib/utils";
import { SettingsContext } from "../../contexts/SettingsContext";
import { SIDEBAR_FULL, SIDEBAR_COLLAPSED, PAGE_PT } from "../../utils/layout-tokens";

export default function NavAlert({ rootText, childText, children, clip = true }) {
    const { sidebarCollapsed } = useContext(SettingsContext);
    const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_FULL;
    const navRef = useRef(null);

    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useLayoutEffect(() => {
        const node = navRef.current;
        if (!node) return undefined;

        const applyOffset = () => {
            const rect = node.getBoundingClientRect();
            const safeOffset = Math.ceil(rect.bottom + 20);
            document.documentElement.style.setProperty("--page-top-offset", `${safeOffset}px`);
        };

        applyOffset();

        const observer = typeof ResizeObserver !== "undefined"
            ? new ResizeObserver(() => applyOffset())
            : null;

        observer?.observe(node);
        window.addEventListener("resize", applyOffset);

        return () => {
            observer?.disconnect();
            window.removeEventListener("resize", applyOffset);
            document.documentElement.style.setProperty("--page-top-offset", PAGE_PT);
        };
    }, [rootText, childText, children, clip, sidebarWidth]);

    const breadcrumbItems = [];
    breadcrumbItems.push({
        key: "root",
        content: rootText,
        className: "text-sm font-semibold",
        style: { color: "var(--accent-primary)" },
    });
    if (Array.isArray(childText)) {
        childText.forEach((text, i) =>
            breadcrumbItems.push({
                key: i,
                content: text,
                className: "text-sm",
                style: { color: "var(--text-secondary)" },
            })
        );
    } else {
        breadcrumbItems.push({
            key: "child",
            content: childText,
            className: "text-sm",
            style: { color: "var(--text-secondary)" },
        });
    }

    return (
        <div
            ref={navRef}
            className={cn(
                "nav-alert fixed z-(--z-sticky) pb-2 pt-2 px-3 md:px-2.5 xl:ps-3 min-h-16 top-3 md:top-4",
                clip ? "nav-alert--clip" : "nav-alert--full"
            )}
            style={{
                backdropFilter: "blur(20px) saturate(180%)",
                borderRadius: "var(--radius-lg)",
                border: `1px solid ${scrolled ? "var(--navbar-border)" : "transparent"}`,
                transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                lineHeight: "25.6px",
                background: "var(--navbar-bg)",
                left: clip ? `${sidebarWidth + 20}px` : "5vw",
                right: clip ? "20px" : "5vw",
            }}
        >
            <div className="flex w-full flex-col md:flex-row xl:items-center">
                <div className="mb-2 md:mb-0">
                    <nav aria-label="Breadcrumb" className="mb-1.25 min-w-0 overflow-hidden">
                        <ol className="flex items-center gap-1 text-sm">
                            {breadcrumbItems.map((item, i) => (
                                <li key={item.key} className="inline-flex min-w-0 items-center gap-1">
                                    {i > 0 && <span className="text-sm" style={{ color: "var(--text-secondary)" }}>/</span>}
                                    <span
                                        className={cn(item.className, i === breadcrumbItems.length - 1 && "truncate")}
                                        style={item.style}
                                        aria-current={i === breadcrumbItems.length - 1 ? "page" : undefined}
                                    >
                                        {item.content}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </nav>
                    <p
                        className="font-bold text-2xl md:text-[34px] truncate"
                        style={{
                            color: "var(--text-primary)",
                            fontFamily: "'Space Grotesk', sans-serif",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {Array.isArray(childText)
                            ? childText[childText.length - 1]
                            : childText}
                    </p>
                </div>
                <div
                    className="flex items-center flex-row ms-auto w-full md:w-auto p-2.5 gap-1.5 flex-wrap md:flex-nowrap"
                    style={{
                        borderRadius: "var(--radius-lg)",
                        background: "var(--surface-primary)",
                        border: "1px solid var(--border-subtle)",
                        overflow: "visible",
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
