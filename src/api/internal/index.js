import {fetchAuto} from "../utils";

export * from "./action";
export * from "./auth";

/**
 * Get user dashboard preferences from the server
 */
export async function getUserPreferences() {
  return fetchAuto("/users/preferences", { toJson: true });
}

/**
 * Save user dashboard preferences to the server
 */
export async function saveUserPreferences(prefs) {
  return fetchAuto("/users/preferences", {
    method: "PATCH",
    body: JSON.stringify(prefs),
    toJson: true,
  });
}

/**
 * Get configurable features of a server
 * You may include other data
 *
 * example: {
 *     enabled: [],
 *     data: {} //nullable
 * }
 * @returns {enabled: string[], data: any} an object contains an array of enabled feature ids and custom data
 */
export async function getFeatures(serverId) {

  return await fetchAuto(`/guild/${serverId}/features`, {toJson: true})
}

/**
 * Enable a feature for a server
 */
export async function setFeatureEnabled(serverId, featureId, enabled = true) {

  return fetchAuto(`/guild/${serverId}/feature/${featureId}/enabled`, {
    method: "PATCH",
    body: JSON.stringify({ enabled }),
  })
}

/**
 *
 * @param serverId
 * @param featureId
 * @returns {Promise<{values: any}>} a map of option values
 */
export async function getFeatureDetail(serverId, featureId) {
  return fetchAuto(`/guild/${serverId}/feature/${featureId}`, {toJson: true})
}

/**
 * Update Feature options value
 *
 * @return any The updated option values
 */
export function updateFeatureOptions(serverId, featureId, options) {

  return fetchAuto(`/guild/${serverId}/feature/${featureId}`, {
    method: "PATCH",
    body: JSON.stringify(Object.fromEntries(options)),
    toJson: true
  })
}

/**
 * Create a new item in a collection-based feature
 */
export function createFeatureItem(serverId, featureId, data) {
  return fetchAuto(`/guild/${serverId}/feature/${featureId}/items`, {
    method: "POST",
    body: JSON.stringify(data),
    toJson: true
  })
}

/**
 * Update an existing item in a collection-based feature
 */
export function updateFeatureItem(serverId, featureId, itemId, data) {
  return fetchAuto(`/guild/${serverId}/feature/${featureId}/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    toJson: true
  })
}

/**
 * Delete an item from a collection-based feature
 */
export function deleteFeatureItem(serverId, featureId, itemId) {
  return fetchAuto(`/guild/${serverId}/feature/${featureId}/items/${itemId}`, {
    method: "DELETE",
  })
}

/**
 * Get configuration settings values of a server
 * @return {values: any}
 */
export async function getSettings(serverId) {
  return fetchAuto(`/guild/${serverId}/settings`, {
    toJson: true
  })
}

/**
 *
 * @return {Promise<any>} updated option values
 */
export async function updateSettingsOptions(serverId, changes) {
  return fetchAuto(`/guild/${serverId}/settings`, {
    method: "PATCH",
    body: JSON.stringify(
        Object.fromEntries(changes)
    ),
    toJson: true
  })
}

/**
 * Normal server details
 */
export function getServerDetails(serverId) {
  return fetchAuto(`/guild/${serverId}/detail`, {
    toJson: true
  })
}

/**
 * Advanced Details of server
 */
export async function getServerAdvancedDetails(serverId) {
  return fetchAuto(`/guild/${serverId}/detail/advanced`, {
    toJson: true
  })
}

/**
 * Get guild assets (custom emojis and stickers)
 */
export async function getGuildAssets(serverId) {
  return fetchAuto(`/guild/${serverId}/assets`, {
    toJson: true
  })
}

/**
 * get Notifications of server
 */
export async function getNotifications(serverId) {
  return fetchAuto(`/guild/${serverId}/notification`, {
    toJson: true
  })
}

/**
 * get Audit Log entries for a server
 */
export async function getAuditLog(serverId, { page = 1, category, action, actorId } = {}) {
  const params = new URLSearchParams({ page: String(page) });
  if (category) params.set('category', category);
  if (action) params.set('action', action);
  if (actorId) params.set('actorId', actorId);

  return fetchAuto(`/guild/${serverId}/audit-log?${params}`, {
    toJson: true
  })
}

/**
 * Get analytics data for a server
 */
export async function getAnalytics(serverId, days = 30) {
  return fetchAuto(`/guild/${serverId}/analytics?days=${days}`, {
    toJson: true
  })
}

/**
 * Get paginated XP leaderboard
 */
export async function getLeaderboard(serverId, page = 1) {
  return fetchAuto(`/guild/${serverId}/leaderboard?page=${page}`, {
    toJson: true
  })
}