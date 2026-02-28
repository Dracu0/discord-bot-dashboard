/// <reference types="vite/client" />

// Allow importing .css files
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

// Allow importing image files
declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

// Module declarations for JS config modules that don't have types yet
declare module "api/internal" {
  export function getFeatures(serverId: string): Promise<import("./api").FeaturesResponse>;
  export function setFeatureEnabled(serverId: string, featureId: string, enabled?: boolean): Promise<Response>;
  export function getFeatureDetail(serverId: string, featureId: string): Promise<import("./api").FeatureDetail>;
  export function updateFeature(serverId: string, featureId: string, updates: Record<string, unknown>): Promise<Response>;
  export function getServerAdvancedDetails(serverId: string): Promise<import("./api").AdvancedDetail>;
  export function getAuditLog(serverId: string, params?: { page?: number; category?: string; action?: string; actorId?: string }): Promise<import("./api").AuditLogResponse>;
  export function getAnalytics(serverId: string, days?: number): Promise<import("./api").AnalyticsData>;
}

declare module "api/internal/auth" {
  export function login(): void;
  export function logout(): Promise<void>;
  export function getUser(): Promise<import("./api").UserInfo | null>;
}

declare module "utils/Language" {
  export function useLocale<T>(value: { en: T; zh?: T }): T;
  export function Locale(props: { en: React.ReactNode; zh?: React.ReactNode }): JSX.Element;
}

declare module "utils/layout-tokens" {
  export const PAGE_PT: string | number;
}
