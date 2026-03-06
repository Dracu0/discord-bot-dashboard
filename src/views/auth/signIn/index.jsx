import React from "react";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/auth/Banner.jpg";
import { DiscordIcon } from "components/icons/DiscordIcon";
import { config } from "config/config";
import { Locale } from "../../../utils/Language";
import { Button } from "components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "lib/utils";

function SignIn({ loading = false }) {

    const onSignIn = () => {
        window.location.href = `${config.serverUrl}/auth/discord`;
    };

    return (
        <DefaultAuth illustrationBackground={illustration} image={illustration}>
            <div className="flex flex-col items-center justify-center text-center max-w-[440px] w-full">
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
                    {config.name || "Mocotron"}
                </span>
                <p className="text-(--text-muted) text-sm font-normal mb-6">
                    <Locale zh="Discord ???????" en="Discord Bot Dashboard" />
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
                        <Locale zh="????" en="Welcome Back" />
                    </h2>
                    <p className="mb-7 text-(--text-secondary) font-normal text-base leading-[1.6]">
                        <Locale zh="????????????" en="Empower Your Creative Community" />
                    </p>

                    <button
                        onClick={onSignIn}
                        disabled={loading}
                        className={cn(
                            "w-full h-[52px] rounded-(--radius-md) text-base font-semibold text-white",
                            "inline-flex items-center justify-center gap-2",
                            "transition-all duration-150 cursor-pointer",
                            "hover:-translate-y-px active:scale-[0.98]",
                            "disabled:opacity-50 disabled:pointer-events-none"
                        )}
                        style={{ backgroundColor: "#5865F2" }}
                    >
                        {loading ? (
                            <Loader2 className="h-[22px] w-[22px] animate-spin" />
                        ) : (
                            <DiscordIcon size={22} />
                        )}
                        <Locale zh="Discord ??" en="Continue with Discord" />
                    </button>

                    <p className="mt-5 text-(--text-muted) font-normal text-xs">
                        <Locale zh="?????????????" en="Your data stays private and secure" />
                    </p>
                </div>
            </div>
        </DefaultAuth>
    );
}

export default SignIn;
