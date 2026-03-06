import React from "react";
import { CardMetric } from "components/card/primitives";

/**
 * Unified stat card used across Dashboard and Analytics views.
 * Displays a label, large value, optional sublabel, and optional icon/endContent.
 */
export default function StatCard({ label, value, sublabel, startContent, endContent }) {
  return <CardMetric label={label} value={value} sublabel={sublabel} startContent={startContent} endContent={endContent} />;
}
