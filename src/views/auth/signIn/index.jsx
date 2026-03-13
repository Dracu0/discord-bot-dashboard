import React from "react";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/auth/Banner.jpg";
import { DiscordIcon } from "components/icons/DiscordIcon";
import { config } from "config/config";
import { Locale } from "../../../utils/Language";
import { Loader2 } from "lucide-react";
import { cn } from "lib/utils";

function SignIn({ loading = false }) {

    const onSignIn = () => {
        window.location.href = `${config.serverUrl}/auth/discord`;
    };

    return (
        <DefaultAuth illustrationBackground={illustration} image={illustration}>
            <div className="flex flex-col items-center justify-center text-center max-w-110 w-full">
                {/* Brand Logo */}
                <span
                    className="text-[40px] md:text-[48px] font-extrabold tracking-[-0.03em] mb-1"
                    style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        background: "linear-gradient(135deg, #2563EB 0%, #60A5FA 50%, #22D3EE 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {config.name || "Cinnetron"}
                </span>
                <p className="text-(--text-muted) text-sm font-normal mb-6">
                    <Locale zh="Discord \u6A5F\u5668\u4EBA\u63A7\u5236\u53F0" en="Cinnetron Dashboard" />
                </p>

                {/* Card */}
                <div
                    className="w-full p-7 md:p-10"
                    style={{
                        backgroundColor: "var(--surface-primary)",
                        borderRadius: "var(--radius-xl)",
                        border: "1px solid var(--border-default)",
                        boxShadow: "var(--shadow-lg)",
                    }}
                >
                    <h2
                        className="text-(--text-primary) text-2xl md:text-[28px] mb-2"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        <Locale zh="\u767b\u5165" en="Sign In" />
                    </h2>
                    <p className="mb-7 text-(--text-secondary) font-normal text-base leading-[1.6]">
                        <Locale zh="\u4f7f\u7528 Discord \u5e33\u865f\u5b58\u53d6\u5100\u8868\u677f\u3002" en="Access the dashboard with your Discord account." />
                    </p>

                    <button
                        onClick={onSignIn}
                        disabled={loading}
                        className={cn(
                            "w-full h-13 rounded-md text-base font-semibold text-white",
                            "inline-flex items-center justify-center gap-2",
                            "transition-all duration-150 cursor-pointer",
                            "hover:-translate-y-px active:scale-[0.98]",
                            "disabled:opacity-50 disabled:pointer-events-none"
                        )}
                        style={{ backgroundColor: "#5865F2" }}
                    >
                        {loading ? (
                            <Loader2 className="h-5.5 w-5.5 animate-spin" />
                        ) : (
                            <DiscordIcon size={22} />
                        )}
                        <Locale zh="\u4F7F\u7528 Discord \u767B\u5165" en="Continue with Discord" />
                    </button>

                    <p className="mt-5 text-(--text-muted) font-normal text-xs">
                        <Locale zh="\u767b\u5165\u6d41\u7a0b\u53d7\u4fdd\u8b77\u3002" en="Secure authentication flow." />
                    </p>
                </div>
            </div>
        </DefaultAuth>
    );
}

export default SignIn;
