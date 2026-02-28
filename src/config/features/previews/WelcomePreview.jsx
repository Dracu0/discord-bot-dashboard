import DiscordEmbedPreview from "../../../components/fields/impl/DiscordEmbedPreview";
import { useConfigValue } from "../../../components/fields/ConfigPanel";

export default function WelcomePreview({ messageId, colorId, embedId, label }) {
  const message = useConfigValue(messageId);
  const color = useConfigValue(colorId);
  const isEmbed = useConfigValue(embedId);

  return (
    <DiscordEmbedPreview
      message={message || `${label} message preview`}
      color={color}
      isEmbed={isEmbed ?? true}
    />
  );
}
