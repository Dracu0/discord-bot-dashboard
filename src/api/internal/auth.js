import {useMutation, useQueryClient} from "react-query";
import {fetchAuto} from "../utils";
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

    return useMutation(
        () => logout(),
        {
            onSuccess() {
                logger.info('logged_out')
                return client.invalidateQueries("logged_in")
            },
            onError(error) {
                logger.error('logout_failed', { error: error.message })
            }
        }
    )
}