import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Hand, Puzzle, Settings } from "lucide-react";
import { GuildContext } from "contexts/guild/GuildContext";
import { Locale, useLocale } from "utils/Language";
import Card from "components/card/Card";
import { Badge } from "components/ui/badge";
import { CardHeading, CardSectionHeader } from "components/card/primitives";

const actions = [
  {
    icon: Puzzle,
    label: { zh: "管理功能", en: "Manage Features" },
    description: { zh: "快速調整機器人功能與模組。", en: "Configure the feature stack and automation modules." },
    path: "features",
    badge: "blue",
  },
  {
    icon: Hand,
    label: { zh: "管理動作", en: "Manage Actions" },
    description: { zh: "查看任務、審核隊列與管理流程。", en: "Review tasks, moderation flows, and action queues." },
    path: "actions",
    badge: "orange",
  },
  {
    icon: Settings,
    label: { zh: "伺服器設定", en: "Server Settings" },
    description: { zh: "更新語言、偏好與伺服器基礎設定。", en: "Adjust language, preferences, and core server settings." },
    path: "settings",
    badge: "secondary",
  },
];

export default function QuickActions() {
  const { id: serverId } = useContext(GuildContext);
  const locale = useLocale();

  return (
    <div className="mb-6">
      <CardSectionHeader
        className="mb-3"
        title={<Locale zh="快捷操作" en="Quick Actions" />}
        titleClassName="text-sm font-semibold tracking-tight"
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {actions.map(({ icon: Icon, label, description, path, badge }) => (
          <Link key={path} to={`/guild/${serverId}/${path}`} className="group">
            <Card variant="interactive" className="h-full p-4.5">
              <div className="flex h-full flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-(--border-subtle) bg-(--surface-secondary) text-(--accent-primary)">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant={badge} className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]">
                    {locale(label)}
                  </Badge>
                </div>

                <CardHeading
                  title={<Locale {...label} />}
                  description={locale(description)}
                  titleClassName="text-base"
                />

                <div className="mt-auto flex items-center gap-2 text-sm font-medium text-(--accent-primary)">
                  <span><Locale zh="立即前往" en="Open workspace" /></span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
