import { useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GuildContext } from "contexts/guild/GuildContext";
import { getGuildAssets } from "api/internal";
import { Button } from "components/ui/button";
import { InputField } from "./InputField";
import Card from "components/card/Card";

function buildEmojiMention(emoji) {
  if (!emoji?.id || !emoji?.name) return "";
  return `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`;
}

export default function GuildAssetsPicker({ disabled = false, onInsert }) {
  const { id: serverId } = useContext(GuildContext);
  const [tab, setTab] = useState("emoji");
  const [query, setQuery] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [gifError, setGifError] = useState("");

  const assetsQuery = useQuery({
    queryKey: ["guild_assets", serverId],
    queryFn: () => getGuildAssets(serverId),
    enabled: Boolean(serverId),
    staleTime: 60_000,
  });

  const emojis = useMemo(() => {
    const all = assetsQuery.data?.emojis || [];
    const keyword = query.trim().toLowerCase();
    return all
      .filter((e) => e?.available !== false)
      .filter((e) => !keyword || String(e.name || "").toLowerCase().includes(keyword))
      .slice(0, 120);
  }, [assetsQuery.data, query]);

  const stickers = useMemo(() => {
    const all = assetsQuery.data?.stickers || [];
    const keyword = query.trim().toLowerCase();
    return all
      .filter((s) => s?.available !== false)
      .filter((s) => !keyword || String(s.name || "").toLowerCase().includes(keyword))
      .slice(0, 120);
  }, [assetsQuery.data, query]);

  const insertToken = (token) => {
    if (!token || typeof onInsert !== "function" || disabled) return;
    onInsert(token);
  };

  const insertGifUrl = () => {
    const trimmed = String(gifUrl || "").trim();
    if (!trimmed) {
      setGifError("GIF URL is required.");
      return;
    }

    try {
      const parsed = new URL(trimmed);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        setGifError("Only http/https URLs are supported.");
        return;
      }
      setGifError("");
      insertToken(trimmed);
      setGifUrl("");
    } catch {
      setGifError("Enter a valid URL.");
    }
  };

  return (
    <Card variant="panel" className="mt-2 border border-(--border-subtle) bg-(--surface-primary) p-3.5">
      <div className="mb-2 flex items-center gap-2">
        <Button
          type="button"
          variant={tab === "emoji" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("emoji")}
          disabled={disabled}
        >
          Server Emojis
        </Button>
        <Button
          type="button"
          variant={tab === "sticker" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("sticker")}
          disabled={disabled}
        >
          Server Stickers
        </Button>
        <Button
          type="button"
          variant={tab === "gif" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("gif")}
          disabled={disabled}
        >
          GIF URL
        </Button>
      </div>

      {tab === "gif" ? (
        <div className="mt-1 space-y-2">
          <InputField
            value={gifUrl}
            onChange={(e) => {
              setGifUrl(e.target.value);
              if (gifError) setGifError("");
            }}
            placeholder="https://example.com/animation.gif"
            disabled={disabled}
          />
          <div className="flex items-center gap-2">
            <Button type="button" size="sm" onClick={insertGifUrl} disabled={disabled}>
              Insert GIF URL
            </Button>
            {gifError ? <span className="text-xs text-(--status-error)">{gifError}</span> : null}
          </div>
        </div>
      ) : (
        <InputField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tab === "emoji" ? "Filter emojis" : "Filter stickers"}
          disabled={disabled}
        />
      )}

      <p className="mt-2 text-xs text-(--text-muted)">
        {tab === "emoji"
          ? "Click to insert custom emoji mention into the response."
          : tab === "sticker"
            ? "Click to insert sticker token {{sticker:ID}} into the response."
            : "Paste a GIF URL and insert it into the response."}
      </p>

      {assetsQuery.isLoading ? (
        <p className="mt-2 text-sm text-(--text-muted)">Loading server assets…</p>
      ) : assetsQuery.isError ? (
        <p className="mt-2 text-sm text-(--status-error)">Failed to load server assets.</p>
      ) : tab === "gif" ? (
        <p className="mt-2 text-sm text-(--text-muted)">
          GIF URLs are sent as normal message content and Discord will auto-embed supported links.
        </p>
      ) : tab === "emoji" ? (
        emojis.length > 0 ? (
          <div className="mt-2 grid max-h-48 grid-cols-2 gap-1.5 overflow-y-auto sm:grid-cols-3 lg:grid-cols-4">
            {emojis.map((emoji) => {
              const mention = buildEmojiMention(emoji);
              return (
                <button
                  key={emoji.id}
                  type="button"
                  className="flex items-center gap-2 rounded-md border border-(--border-subtle) bg-(--surface-card) px-2 py-1.5 text-left text-xs hover:bg-(--surface-secondary)"
                  title={mention}
                  onClick={() => insertToken(mention)}
                  disabled={disabled}
                >
                  <img src={emoji.url} alt="" aria-hidden="true" className="h-4.5 w-4.5" />
                  <span className="truncate">{emoji.name}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="mt-2 text-sm text-(--text-muted)">No matching server emojis.</p>
        )
      ) : stickers.length > 0 ? (
        <div className="mt-2 grid max-h-48 grid-cols-1 gap-1.5 overflow-y-auto sm:grid-cols-2">
          {stickers.map((sticker) => {
            const token = `{{sticker:${sticker.id}}}`;
            const canPreview = String(sticker.formatType) !== "3"; // Lottie JSON cannot be previewed as image
            return (
              <button
                key={sticker.id}
                type="button"
                className="flex items-center gap-2 rounded-md border border-(--border-subtle) bg-(--surface-card) px-2 py-1.5 text-left text-xs hover:bg-(--surface-secondary)"
                title={token}
                onClick={() => insertToken(token)}
                disabled={disabled}
              >
                {canPreview ? (
                  <img src={sticker.url} alt="" aria-hidden="true" className="h-5 w-5 rounded" />
                ) : (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-(--surface-secondary) text-[10px] font-semibold">JSON</span>
                )}
                <span className="truncate">{sticker.name}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="mt-2 text-sm text-(--text-muted)">No matching server stickers.</p>
      )}
    </Card>
  );
}
