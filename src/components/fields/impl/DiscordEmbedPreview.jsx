const SAMPLE_PLACEHOLDERS = {
  "{user}": "@SampleUser",
  "{server}": "My Server",
  "{membercount}": "142",
};

function replacePlaceholders(text) {
  if (!text) return "";
  let result = text;
  for (const [key, value] of Object.entries(SAMPLE_PLACEHOLDERS)) {
    result = result.replaceAll(key, value);
  }
  return result;
}

export default function DiscordEmbedPreview({ message, color, isEmbed }) {
  const bgPrimary = "var(--discord-bg-primary, #2b2d31)";
  const bgSecondary = "var(--discord-bg-secondary, #1e1f22)";
  const textPrimary = "var(--discord-text-primary, #dbdee1)";
  const textMuted = "var(--discord-text-muted, #949ba4)";

  const resolved = replacePlaceholders(message);
  const accentColor = color || "#00aa00";

  if (!isEmbed) {
    return (
      <PreviewWrapper bg={bgSecondary} textColor={textMuted}>
        <div
          className="rounded-lg"
          style={{
            padding: "8px 16px",
            backgroundColor: bgPrimary,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-6 h-6 rounded-full shrink-0"
              style={{
                background: "linear-gradient(135deg, #5865f2, #eb459e)",
              }}
            />
            <span className="text-sm font-medium" style={{ color: textPrimary }}>
              Cinnetron
            </span>
            <span className="text-xs" style={{ color: textMuted }}>
              BOT
            </span>
            <span className="text-xs" style={{ color: textMuted }}>
              Today at 12:00 PM
            </span>
          </div>
          <p className="text-sm whitespace-pre-wrap" style={{ color: textPrimary }}>
            {resolved || "No message content"}
          </p>
        </div>
      </PreviewWrapper>
    );
  }

  return (
    <PreviewWrapper bg={bgSecondary} textColor={textMuted}>
      <div
        className="rounded-lg"
        style={{
          padding: "8px 16px",
          backgroundColor: bgPrimary,
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-6 h-6 rounded-full shrink-0"
            style={{
              background: "linear-gradient(135deg, #5865f2, #eb459e)",
            }}
          />
          <span className="text-sm font-medium" style={{ color: textPrimary }}>
            Cinnetron
          </span>
          <span className="text-xs" style={{ color: textMuted }}>
            BOT
          </span>
          <span className="text-xs" style={{ color: textMuted }}>
            Today at 12:00 PM
          </span>
        </div>

        <div
          className="rounded"
          style={{
            borderLeft: `4px solid ${accentColor}`,
            padding: "8px 16px 8px 12px",
            backgroundColor: bgSecondary,
            maxWidth: 520,
          }}
        >
          <p className="text-sm whitespace-pre-wrap" style={{ color: textPrimary }}>
            {resolved || "No embed content"}
          </p>
        </div>
      </div>
    </PreviewWrapper>
  );
}

function PreviewWrapper({ bg, textColor, children }) {
  return (
    <div className="rounded-lg overflow-hidden">
      <div
        style={{
          backgroundColor: bg,
          padding: "8px 12px",
          borderBottom: "1px solid rgba(128,128,128,0.15)",
        }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: textColor }}
        >
          Preview
        </span>
      </div>
      <div style={{ backgroundColor: bg, padding: 8 }}>{children}</div>
    </div>
  );
}
