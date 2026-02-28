import {useMutation, useQueryClient} from "@tanstack/react-query";
import {fetchAuto, resetCsrfToken} from "../utils";
import logger from "utils/logger";

export function hasLoggedIn() {
    return fetchAuto(
        "/auth",
        {
            credentials: "include",
            method: "HEAD",
            throwError: false
        }
    ).then(res => {
        logger.info('auth_check', { loggedIn: res.ok })
        return res.ok
    })
}

export async function logout() {
    return fetchAuto("/auth/signout", {
        method: "POST"
    })
}

export function useLogout() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: () => logout(),
        onSuccess() {
            logger.info('logged_out')
            resetCsrfToken()
            return client.invalidateQueries({ queryKey: ["logged_in"] })
        },
        onError(error) {
            logger.error('logout_failed', { error: error.message })
        }
    })
}