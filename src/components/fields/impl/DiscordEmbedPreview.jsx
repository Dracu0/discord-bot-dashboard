import { Box, Group, Text, Title } from "@mantine/core";
import { useColorValue } from "../../../utils/colors";

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
  const bgPrimary = useColorValue("#ffffff", "#2b2d31");
  const bgSecondary = useColorValue("#f2f3f5", "#1e1f22");
  const textPrimary = useColorValue("#060607", "#dbdee1");
  const textMuted = useColorValue("#5c5e66", "#949ba4");

  const resolved = replacePlaceholders(message);
  const accentColor = color || "#00aa00";

  if (!isEmbed) {
    return (
      <PreviewWrapper bg={bgSecondary} textColor={textMuted}>
        <Box
          style={{
            padding: "8px 16px",
            backgroundColor: bgPrimary,
            borderRadius: 8,
          }}
        >
          <Group gap={8} align="center" mb={4}>
            <Box
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #5865f2, #eb459e)",
                flexShrink: 0,
              }}
            />
            <Text fz="sm" fw={500} c={textPrimary}>
              Mocotron
            </Text>
            <Text fz="xs" c={textMuted}>
              BOT
            </Text>
            <Text fz="xs" c={textMuted}>
              Today at 12:00 PM
            </Text>
          </Group>
          <Text fz="sm" c={textPrimary} style={{ whiteSpace: "pre-wrap" }}>
            {resolved || "No message content"}
          </Text>
        </Box>
      </PreviewWrapper>
    );
  }

  return (
    <PreviewWrapper bg={bgSecondary} textColor={textMuted}>
      <Box
        style={{
          padding: "8px 16px",
          backgroundColor: bgPrimary,
          borderRadius: 8,
        }}
      >
        <Group gap={8} align="center" mb={4}>
          <Box
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #5865f2, #eb459e)",
              flexShrink: 0,
            }}
          />
          <Text fz="sm" fw={500} c={textPrimary}>
            Mocotron
          </Text>
          <Text fz="xs" c={textMuted}>
            BOT
          </Text>
          <Text fz="xs" c={textMuted}>
            Today at 12:00 PM
          </Text>
        </Group>

        <Box
          style={{
            borderLeft: `4px solid ${accentColor}`,
            borderRadius: 4,
            padding: "8px 16px 8px 12px",
            backgroundColor: bgSecondary,
            maxWidth: 520,
          }}
        >
          <Text fz="sm" c={textPrimary} style={{ whiteSpace: "pre-wrap" }}>
            {resolved || "No embed content"}
          </Text>
        </Box>
      </Box>
    </PreviewWrapper>
  );
}

function PreviewWrapper({ bg, textColor, children }) {
  return (
    <Box style={{ borderRadius: 8, overflow: "hidden" }}>
      <Box
        style={{
          backgroundColor: bg,
          padding: "8px 12px",
          borderBottom: "1px solid rgba(128,128,128,0.15)",
        }}
      >
        <Text fz="xs" fw={600} c={textColor} tt="uppercase" lts={0.5}>
          Preview
        </Text>
      </Box>
      <Box style={{ backgroundColor: bg, padding: 8 }}>{children}</Box>
    </Box>
  );
}
