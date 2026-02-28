/** Guild info from GET /guild/:id */
export interface GuildInfo {
  id: string;
  name: string;
  icon: string | null;
  owner_id: string;
  member_count: number;
  presence_count: number;
}

/** Server detail from GET /guild/:id/detail */
export interface ServerDetail {
  name: string;
  icon: string | null;
  members: number;
  online: number;
  mcServers: number;
  suggestionsEnabled: boolean;
  xpEnabled: boolean;
  welcomeEnabled: boolean;
  modLogEnabled: boolean;
}

/** XP leaderboard entry */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  level: number;
  xp: number;
}

/** Mod log entry */
export interface ModAction {
  action: string;
  targetId: string;
  moderatorId: string;
  reason: string;
  createdAt: string;
}

/** Advanced server detail from GET /guild/:id/detail/advanced */
export interface AdvancedDetail {
  xp: {
    totalTrackedUsers: number;
    leaderboard: LeaderboardEntry[];
  };
  suggestions: {
    total: number;
    pending: number;
  };
  moderation: {
    totalActions: number;
    recentActions: ModAction[];
  };
}

/** Audit log entry from GET /guild/:id/audit-log */
export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorTag: string;
  source: "bot" | "dashboard";
  category: string;
  action: string;
  target: string;
  before: unknown;
  after: unknown;
  createdAt: string;
}

/** Paginated audit log response */
export interface AuditLogResponse {
  entries: AuditLogEntry[];
  total: number;
  page: number;
  totalPages: number;
}

/** Analytics response from GET /guild/:id/analytics */
export interface AnalyticsData {
  period: { days: number; since: string };
  moderation: {
    byDay: Array<{ date: string; count: number }>;
    byType: Array<{ action: string; count: number }>;
  };
  suggestions: {
    byStatus: Array<{ status: string; count: number }>;
  };
  xp: {
    levelDistribution: Array<{ range: string; count: number }>;
  };
  tickets: {
    open: number;
    closedRecently: number;
    avgResolutionMs: number | null;
  };
  audit: {
    byCategory: Array<{ category: string; count: number }>;
  };
}

/** Features response from GET /guild/:id/features */
export interface FeaturesResponse {
  enabled: string[];
  data?: Record<string, unknown>;
}

/** Feature detail from GET /guild/:id/feature/:featureId */
export interface FeatureDetail {
  values: Record<string, unknown>;
}

/** Leaderboard paginated response */
export interface LeaderboardResponse {
  users: LeaderboardEntry[];
  total: number;
  page: number;
  totalPages: number;
}

/** Notification item from GET /guild/:id/notification */
export interface Notification {
  type: "info" | "moderation";
  message: string;
  time?: string;
}

/** Discord guild (from auth flow) */
export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

/** User info from auth */
export interface UserInfo {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
}
