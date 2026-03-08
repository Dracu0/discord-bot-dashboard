import {fetchAuto} from "../utils";

/**
 * Only fetch when config.data.actions is not null
 *
 * @returns a custom data object
 */
export async function getActionsData(serverId) {
    return fetchAuto(`/guild/${serverId}/actions`, {
        toJson: true
    })
}

/**
 * @returns {Promise<{tasks: Array<{createdAt: Date, id: number, status: string}>, total: number, page: number, totalPages: number}>} paginated tasks
 */
export function getActionDetail(serverId, actionId, page = 1, filters = {}) {
    const params = new URLSearchParams({ page: String(page) });
    for (const [key, value] of Object.entries(filters)) {
        if (value) params.set(key, value);
    }
    return fetchAuto(`/guild/${serverId}/action/${actionId}?${params}`,
        { toJson: true }
    )
}

/**
 *
 * @return {Promise<{createdAt: Date, values: any, name: string, id: number}>} The added task detail
 */
export function addTask(serverId, actionId, name, options) {
    return fetchAuto(`/guild/${serverId}/action/${actionId}`,
        {
            method: "POST",
            body: JSON.stringify({
                name,
                options: Object.fromEntries(options)
            }),
            toJson: true
        }
    )
}

/**
 * @returns {Promise<{createdAt: Date, values: any, name: string, id: number}>} Task Info and option values
 */
export function getTaskDetail(serverId, actionId, taskId) {
    return fetchAuto(`/guild/${serverId}/action/${actionId}/${taskId}`,
        { toJson: true }
    )
}

/**
 * @return {*} Updated Task options
 */
export function updateTask(serverId, actionId, taskId, name, options) {
    return fetchAuto(`/guild/${serverId}/action/${actionId}/${taskId}`,
        {
            method: "PATCH",
            body: JSON.stringify({
                name,
                options: Object.fromEntries(options)
            }),
            toJson: true
        }
    )
}

export async function deleteTask(serverId, actionId, taskId) {
    return fetchAuto(`/guild/${serverId}/action/${actionId}/${taskId}`,
        {
            method: "DELETE",
        }
    )
}