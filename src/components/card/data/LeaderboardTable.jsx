import React, { useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import { Crown, Sparkles, Trophy, Medal, ArrowRight } from "lucide-react";
import Card from "components/card/Card";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { GuildContext } from "contexts/guild/GuildContext";
import { useTranslation } from "utils/Language";
import { avatarToUrl } from "api/discord/DiscordApi";
import { CardSectionHeader } from "components/card/primitives";

const RANK_STYLES = {
  1: {
    icon: Crown,
    accent: "linear-gradient(135deg, rgba(251, 191, 36, 0.25), rgba(245, 158, 11, 0.08))",
    border: "rgba(245, 158, 11, 0.35)",
    badge: "warning",
    label: "#1",
  },
  2: {
    icon: Trophy,
    accent: "linear-gradient(135deg, rgba(148, 163, 184, 0.24), rgba(100, 116, 139, 0.08))",
    border: "rgba(148, 163, 184, 0.32)",
    badge: "secondary",
    label: "#2",
  },
  3: {
    icon: Medal,
    accent: "linear-gradient(135deg, rgba(251, 146, 60, 0.24), rgba(194, 65, 12, 0.08))",
    border: "rgba(249, 115, 22, 0.28)",
    badge: "orange",
    label: "#3",
  },
};

function normalizeUser(entry, index) {
  if (!entry) return null;

  return {
    rank: entry.rank ?? index + 1,
    userId: entry.userId ?? entry.id ?? entry.actorId ?? `user-${index}`,
    username: entry.username ?? entry.userName ?? entry.name ?? "Unknown User",
    level: entry.level ?? entry.Level ?? 0,
    xp: entry.xp ?? entry.XP ?? 0,
    avatar: entry.avatar ?? entry.avatarHash ?? null,
  };
}

function getInitials(name) {
  return (name || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatXp(value) {
  return Number(value || 0).toLocaleString();
}

function TopPerformerCard({ user, compact }) {
  const { t } = useTranslation();
  const rankStyle = RANK_STYLES[user.rank] || RANK_STYLES[3];
  const Icon = rankStyle.icon;

  return (
    <div
      className="relative overflow-hidden rounded-xl border p-4 md:p-5"
      style={{
        background: rankStyle.accent,
        borderColor: rankStyle.border,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className={compact ? "h-11 w-11 ring-2 ring-white/50" : "h-13 w-13 ring-2 ring-white/50"}>
            {user.avatar && <AvatarImage src={avatarToUrl(user.userId, user.avatar)} alt={user.username} />}
            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={rankStyle.badge}>{rankStyle.label}</Badge>
              <span className="text-xs text-(--text-secondary)">{t("leaderboard.level")}</span>
            </div>
            <p className="text-(--text-primary) font-bold truncate text-base md:text-lg">{user.username}</p>
            <p className="text-sm text-(--text-secondary)">{t("leaderboard.levelShort", { level: user.level })}</p>
          </div>
        </div>
        <div className="rounded-full p-2" style={{ background: "rgba(255,255,255,0.65)" }}>
          <Icon className="h-4 w-4 md:h-5 md:w-5" style={{ color: "var(--text-primary)" }} />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.12em] text-(--text-muted)">
          <span>{t("leaderboard.totalXp")}</span>
          <span>{formatXp(user.xp)} XP</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/55">
          <div
            className="h-full rounded-full"
            style={{
              width: "100%",
              background: "linear-gradient(90deg, var(--accent-primary), color-mix(in srgb, var(--accent-primary) 65%, white))",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function LeaderboardRow({ user, maxXp }) {
  const { t } = useTranslation();
  const progress = maxXp > 0 ? Math.max(8, Math.round((user.xp / maxXp) * 100)) : 0;
  const isTopThree = user.rank <= 3;

  return (
    <div
      className="rounded-xl border p-3.5 md:p-4 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "var(--surface-primary)",
        borderColor: "var(--border-subtle)",
        boxShadow: "var(--shadow-xs)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
          style={{
            background: isTopThree ? "var(--sidebar-active)" : "var(--surface-secondary)",
            color: isTopThree ? "var(--accent-primary)" : "var(--text-secondary)",
          }}
        >
          #{user.rank}
        </div>

        <Avatar className="h-10 w-10 border border-(--border-subtle)">
          {user.avatar && <AvatarImage src={avatarToUrl(user.userId, user.avatar)} alt={user.username} />}
          <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm md:text-base font-semibold text-(--text-primary) truncate">{user.username}</p>
            <Badge variant="outline">{t("leaderboard.levelShort", { level: user.level })}</Badge>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-(--surface-secondary)">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, var(--accent-primary), color-mix(in srgb, var(--accent-primary) 60%, white))",
              }}
            />
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-base font-bold text-(--text-primary)">{formatXp(user.xp)}</p>
          <p className="text-xs text-(--text-muted)">XP</p>
        </div>
      </div>
    </div>
  );
}

function EmptyLeaderboard({ title }) {
  const { t } = useTranslation();

  return (
    <Card className="w-full overflow-hidden">
      <CardSectionHeader
        className="border-b border-(--border-subtle) pb-4"
        title={title}
        description={t("leaderboard.emptyDescription")}
        icon={
          <div className="rounded-full bg-(--surface-secondary) p-3">
            <Sparkles className="h-5 w-5 text-(--accent-primary)" />
          </div>
        }
      />
      <div className="py-10 text-center">
        <p className="text-(--text-primary) font-semibold">{t("leaderboard.noData")}</p>
        <p className="mt-1 text-sm text-(--text-muted)">{t("leaderboard.emptyHint")}</p>
      </div>
    </Card>
  );
}

export default function LeaderboardTable({
  title,
  users,
  compact = false,
  showViewAll = false,
  total,
  description,
}) {
  const { id: guildId } = useContext(GuildContext);
  const { t } = useTranslation();

  const normalized = useMemo(
    () => (users || []).map(normalizeUser).filter(Boolean).sort((a, b) => a.rank - b.rank),
    [users]
  );

  if (normalized.length === 0) {
    return <EmptyLeaderboard title={title} />;
  }

  const featured = normalized.slice(0, compact ? 1 : 3);
  const remaining = normalized.slice(compact ? 1 : 3, compact ? 5 : normalized.length);
  const maxXp = normalized[0]?.xp || 0;

  return (
    <Card className="w-full overflow-hidden px-0">
      <CardSectionHeader
        className="border-b border-(--border-subtle) px-5 pb-4"
        title={title}
        description={description || t(compact ? "leaderboard.compactDescription" : "leaderboard.description")}
        action={
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{total ?? normalized.length} {t("common.users")}</Badge>
            {showViewAll && guildId && (
              <Button asChild variant="ghost" size="sm" className="shrink-0">
                <Link to={`/guild/${guildId}/leaderboard`}>
                  {t("leaderboard.viewFull")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        }
      />

      <div className="px-5 py-5">
        <div className={compact ? "grid grid-cols-1 gap-3" : "grid grid-cols-1 xl:grid-cols-3 gap-3"}>
          {featured.map((user) => (
            <TopPerformerCard key={user.userId} user={user} compact={compact} />
          ))}
        </div>

        {remaining.length > 0 && (
          <div className="mt-4 flex flex-col gap-3">
            {remaining.map((user) => (
              <LeaderboardRow key={`${user.userId}-${user.rank}`} user={user} maxXp={maxXp} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}