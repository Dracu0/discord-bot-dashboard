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
    description: { zh: "集中調整歡迎、XP、自動化與其餘核心模組。", en: "Adjust welcome, XP, automation, and the rest of the feature stack from one hub." },
    path: "features",
    badge: "blue",
    eyebrow: { zh: "模組", en: "Modules" },
  },
  {
    icon: Hand,
    label: { zh: "管理動作", en: "Manage Actions" },
    description: { zh: "處理建議、工作流與需要你即時決策的佇列。", en: "Handle suggestion reviews, workflows, and the queues that need attention right now." },
    path: "actions",
    badge: "orange",
    eyebrow: { zh: "佇列", en: "Queue" },
  },
  {
    icon: Settings,
    label: { zh: "伺服器設定", en: "Server Settings" },
    description: { zh: "更新語言、偏好與影響整體體驗的基礎配置。", en: "Update language, preferences, and the foundational settings that shape the whole server experience." },
    path: "settings",
    badge: "secondary",
    eyebrow: { zh: "偏好", en: "Preferences" },
  },
];

export default function QuickActions() {
  const { id: serverId } = useContext(GuildContext);
  const locale = useLocale();

  return (
    <Card variant="panel">
      <CardSectionHeader
        title={<Locale zh="工作區捷徑" en="Workspace shortcuts" />}
        description={<Locale zh="把最常用的管理入口維持在同一塊視圖內，減少來回切換。" en="Keep the most-used control surfaces together so you can move between operations without hunting through the sidebar." />}
        action={<Badge variant="secondary">3 <Locale zh="個樞紐" en="hubs" /></Badge>}
      />
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {actions.map(({ icon: Icon, label, description, path, badge, eyebrow }) => (
          <Link key={path} to={`/guild/${serverId}/${path}`} className="group">
            <Card variant="interactive" className="h-full min-h-52 p-5">
              <div className="flex h-full flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-(--border-subtle) bg-(--surface-secondary) text-(--accent-primary)">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant={badge} className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]">
                    {locale(eyebrow)}
                  </Badge>
                </div>

                <CardHeading
                  title={<Locale {...label} />}
                  description={locale(description)}
                  titleClassName="text-base"
                />

                <div className="mt-auto flex items-center gap-2 text-sm font-medium text-(--accent-primary)">
                  <span><Locale zh="打開工作區" en="Open workspace" /></span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Card>
  );
}
