import Card from "components/card/Card";
import React from "react";

/**
 * Unified stat card used across Dashboard and Analytics views.
 * Displays a label, large value, optional sublabel, and optional icon/endContent.
 */
export default function StatCard({ label, value, sublabel, startContent, endContent }) {
  return (
    <Card className="py-4 px-5">
      <div className="flex items-center gap-3">
        {startContent}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-xs uppercase font-bold text-(--text-secondary) leading-none">
            {label}
          </span>
          <span className="text-2xl font-bold text-(--text-primary) font-['Space_Grotesk'] mt-1 leading-none">
            {value ?? "\u2014"}
          </span>
          {sublabel && (
            <span className="text-xs text-(--text-secondary) mt-1">
              {sublabel}
            </span>
          )}
        </div>
        {endContent && (
          <div className="ms-auto shrink-0">{endContent}</div>
        )}
      </div>
    </Card>
  );
}
