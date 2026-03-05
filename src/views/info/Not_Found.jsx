import { Link } from "react-router-dom";
import not_found from "assets/img/info/not_found_404.svg";
import { Locale } from "utils/Language";
import { ArrowLeft } from "lucide-react";
import { Button } from "components/ui/button";

export default function NotFound() {

    return (
        <div className="flex items-center justify-center h-[calc(100vh-90px)] md:h-[calc(100vh-80px)] relative">
            <div className="flex flex-col items-center gap-0">
                <img
                    className="w-[250px] md:w-[350px] mx-auto opacity-80"
                    src={not_found}
                    alt="Not Found"
                />
                <h1
                    className="mt-3 text-5xl md:text-7xl font-extrabold"
                    style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        background: "linear-gradient(to right, var(--accent-primary), #22D3EE)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    404
                </h1>
                <span className="text-lg text-[var(--text-primary)] font-semibold mt-1">
                    <Locale zh="\u627e\u4e0d\u5230\u9801\u9762" en="Page Not Found" />
                </span>
                <span className="text-sm text-[var(--text-secondary)] mt-1 text-center max-w-[360px]">
                    <Locale zh="\u60a8\u8acb\u6c42\u7684\u8cc7\u6e90\u4e0d\u5b58\u5728" en="The page you're looking for doesn't exist or has been moved" />
                </span>
                <Button asChild className="mt-6" size="lg">
                    <Link to="/">
                        <ArrowLeft size={18} className="mr-2" />
                        <Locale zh="\u8fd4\u56de\u9996\u9801" en="Go Home" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
