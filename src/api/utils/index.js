import {config} from "../../config/config";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {setFeatureEnabled} from "../internal";
import logger from "utils/logger";
import { toast } from "sonner";

// CSRF token management — fetched once per session, included in all state-changing requests
let csrfToken = null;
let csrfFetching = null;

async function fetchCsrfToken() {
    if (csrfFetching) return csrfFetching;
    csrfFetching = fetch(`${config.serverUrl}/csrf-token`, { credentials: 'include' })
        .then(r => r.json())
        .then(data => { csrfToken = data.token; csrfFetching = null; return csrfToken; })
        .catch(() => { csrfFetching = null; return null; });
    return csrfFetching;
}

async function ensureCsrfToken() {
    if (csrfToken) return csrfToken;
    return fetchCsrfToken();
}

// Reset CSRF token on auth change (e.g. logout)
export function resetCsrfToken() { csrfToken = null; }

export function fetchAuto(url, {toJson = false, throwError = true, ...options} = {}) {
    const requestId = logger.createRequestId()
    const startedAt = Date.now()
    const method = (options.method || 'GET').toUpperCase();
    const needsCsrf = !['GET', 'HEAD', 'OPTIONS'].includes(method);

    const doFetch = (token) => fetch(`${config.serverUrl}${url}`, {
        credentials: "include",
        headers: {
            'content-type': 'application/json',
            'x-request-id': requestId,
            ...(token ? { 'x-csrf-token': token } : {}),
            ...(options.headers || {})
        },
        ...options
    });

    const request = needsCsrf
        ? ensureCsrfToken().then(token => doFetch(token))
        : doFetch(null);

    return request.then(res => {
        // On CSRF failure, re-fetch token and retry once
        if (needsCsrf && res.status === 403) {
            csrfToken = null;
            return fetchCsrfToken().then(newToken => {
                if (!newToken) return res;
                return doFetch(newToken);
            });
        }
        return res;
    }).then(res => {
        if (res.ok || !throwError) {
            logger.info('api_request_ok', {
                requestId,
                url,
                method: options.method || 'GET',
                status: res.status,
                durationMs: Date.now() - startedAt,
            })

            return toJson ? res.json() : res
        } else {
            return res.text().then(s => {
                logger.error('api_request_failed', {
                    requestId,
                    url,
                    method: options.method || 'GET',
                    status: res.status,
                    durationMs: Date.now() - startedAt,
                    error: s,
                })
                const error = new Error(s);
                throw error
            })
        }
    }).catch(err => {
        if (!(err instanceof Error) || err.message !== 'Failed to fetch') {
            throw err
        }

        logger.error('api_network_error', {
            requestId,
            url,
            method: options.method || 'GET',
            durationMs: Date.now() - startedAt,
            error: err.message,
        })

        throw err
    })
}

export function useEnableFeatureMutation(serverId, featureId) {
    const client = useQueryClient()

    return useMutation({
        mutationFn: (enabled) => setFeatureEnabled(serverId, featureId, enabled),
        onSuccess(_, enabled) {
            logger.info('feature_toggled', { serverId, featureId, enabled })

            const modify = (data) => {
                if (enabled) {
                    return [...data.enabled, featureId]
                } else {
                    return data.enabled.filter(id => featureId !== id)
                }
            }

            client.setQueryData(
                ["features", serverId],
                data => data ? {
                    ...data,
                    enabled: modify(data)
                } : data
            )

            client.invalidateQueries({ queryKey: ["features", serverId] })
            client.invalidateQueries({ queryKey: ["server_detail", serverId] })
            toast.success(enabled ? "Feature enabled" : "Feature disabled");
        },
        onError(error) {
            logger.error('feature_toggle_failed', { serverId, featureId, error: error.message })
            toast.error("Failed to toggle feature");
        }
    })
}