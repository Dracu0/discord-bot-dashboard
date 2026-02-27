import {config} from "../../config/config";
import {useMutation, useQueryClient} from "react-query";
import {setFeatureEnabled} from "../internal";
import logger from "utils/logger";

export function fetchAuto(url, {toJson = false, throwError = true, ...options} = {}) {
    const requestId = logger.createRequestId()
    const startedAt = Date.now()
    const request = fetch(`${config.serverUrl}${url}`, {
        credentials: "include",
        headers: {
            'content-type': 'application/json',
            'x-request-id': requestId,
            ...(options.headers || {})
        },
        ...options
    })
    let mapper

    if (toJson) {
        mapper = res => res.json()
    } else {
        mapper = res => res.text().then(() => res)
    }

    return request.then(res => {

        if (res.ok || !throwError) {

            return mapper? mapper(res) : res
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

    return useMutation(
        (enabled) => setFeatureEnabled(serverId, featureId, enabled),
        {
            onSuccess(_, enabled) {
                const modify = (data) => {
                    if (enabled) {
                        return [...data.enabled, featureId]
                    } else {
                        return data.enabled.filter(id => featureId !== id)
                    }
                }

                return client.setQueryData(
                    ["features", serverId],
                    data => ({
                        ...data,
                        enabled: modify(data)
                    })
                )
            }
        }
    )
}