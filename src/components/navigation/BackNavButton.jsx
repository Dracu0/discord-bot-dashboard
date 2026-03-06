import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Locale } from "utils/Language";
import { Button } from "components/ui/button";

export default function BackNavButton({ to, zh = "\u8fd4\u56de", en = "Back", ariaLabel }) {
    return (
        <Button
            asChild
            aria-label={ariaLabel || en}
            size="sm"
            variant="outline"
            className="min-h-11 md:min-h-10"
        >
            <Link to={to}>
                <ArrowLeft size={16} className="mr-1.5" />
                <Locale zh={zh} en={en} />
            </Link>
        </Button>
    );
}
