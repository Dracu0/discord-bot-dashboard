import {config} from "../../config/config";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {setFeatureEnabled} from "../internal";
import logger from "utils/logger";
import { toast } from "sonner";

// CSRF token management — fetched once per session, included in all state-changing requests
let csrfToken = null;
let csrfFetching = null;
const DEFAULT_API_TIMEOUT_MS = 30_000;

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

function getRequestTimeoutMs() {
    const raw = Number(import.meta.env.VITE_API_TIMEOUT_MS);
    if (Number.isFinite(raw) && raw >= 1000) {
        return Math.round(raw);
    }
    return DEFAULT_API_TIMEOUT_MS;
}

async function parseErrorBody(res) {
    const text = await res.text().catch(() => '');
    if (!text) {
        return {
            message: `Request failed with status ${res.status}`,
            details: null,
        };
    }

    try {
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === 'object') {
            if (typeof parsed.message === 'string' && parsed.message) {
                return { message: parsed.message, details: parsed };
            }
            if (typeof parsed.error === 'string' && parsed.error) {
                return { message: parsed.error, details: parsed };
            }
        }
    } catch {
        // fallback to plain text below
    }

    return {
        message: text,
        details: null,
    };
}

export function fetchAuto(url, {toJson = false, throwError = true, ...options} = {}) {
    const requestId = logger.createRequestId()
    const startedAt = Date.now()
    const method = (options.method || 'GET').toUpperCase();
    const needsCsrf = !['GET', 'HEAD', 'OPTIONS'].includes(method);
    const timeoutMs = getRequestTimeoutMs();

    const doFetch = (token) => {
        const controller = new AbortController();
        const externalSignal = options.signal;
        let abortHandler = null;
        const timeoutHandle = setTimeout(() => {
            controller.abort(new DOMException(`Request timed out after ${timeoutMs}ms`, 'AbortError'));
        }, timeoutMs);

        if (externalSignal) {
            if (externalSignal.aborted) {
                controller.abort(externalSignal.reason);
            } else {
                abortHandler = () => controller.abort(externalSignal.reason);
                externalSignal.addEventListener('abort', abortHandler, { once: true });
            }
        }

        const headers = {
            'x-request-id': requestId,
            ...(token ? { 'x-csrf-token': token } : {}),
            ...(options.headers || {}),
        };

        const hasBody = options.body != null;
        const isFormDataBody = typeof globalThis.FormData !== 'undefined' && options.body instanceof globalThis.FormData;
        const hasContentTypeHeader = Object.keys(headers).some((key) => key.toLowerCase() === 'content-type');

        if (hasBody && !isFormDataBody && !hasContentTypeHeader) {
            headers['content-type'] = 'application/json';
        }

        return fetch(`${config.serverUrl}${url}`, {
            credentials: "include",
            headers,
            ...options,
            signal: controller.signal,
        }).finally(() => {
            clearTimeout(timeoutHandle);
            if (externalSignal && abortHandler) {
                externalSignal.removeEventListener('abort', abortHandler);
            }
        });
    };

    const request = needsCsrf
        ? ensureCsrfToken().then(token => doFetch(token))
        : doFetch(null);

    return request.then(async res => {
        // On CSRF failure, re-fetch token and retry once
        // Only retry if the 403 is actually a CSRF rejection, not a permission error
        if (needsCsrf && res.status === 403) {
            const clone = res.clone();
            const body = await clone.json().catch(() => ({}));
            const isCsrfError = typeof body.error === 'string' && body.error.includes('CSRF');
            if (isCsrfError) {
                csrfToken = null;
                return fetchCsrfToken().then(newToken => {
                    if (!newToken) return res;
                    return doFetch(newToken);
                });
            }
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
            return parseErrorBody(res).then(({ message, details }) => {
                logger.error('api_request_failed', {
                    requestId,
                    url,
                    method: options.method || 'GET',
                    status: res.status,
                    durationMs: Date.now() - startedAt,
                    error: message,
                    details,
                })
                const error = new Error(message);
                error.status = res.status;
                if (details) {
                    error.details = details;
                }
                throw error
            })
        }
    }).catch(err => {
        if (!(err instanceof Error)) {
            throw err
        }

        const isTimeout = err.name === 'AbortError' || /timed out/i.test(err.message);
        const isNetworkLikeTypeError = err.name === 'TypeError' && /fetch|network|load failed/i.test(err.message);
        const isNetwork = err.message === 'Failed to fetch' || isNetworkLikeTypeError || isTimeout;
        if (!isNetwork) {
            throw err;
        }

        const message = isTimeout ? `Request timed out after ${timeoutMs}ms` : err.message;

        logger.error('api_network_error', {
            requestId,
            url,
            method: options.method || 'GET',
            durationMs: Date.now() - startedAt,
            error: message,
            timeoutMs,
        })

        const networkError = new Error(message);
        networkError.code = isTimeout ? 'REQUEST_TIMEOUT' : 'NETWORK_ERROR';
        throw networkError;
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