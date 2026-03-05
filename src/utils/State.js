import {useContext} from "react";
import {SettingsContext} from "../contexts/SettingsContext";
import {useTheme} from "next-themes";

export function usePageState(add) {
    const {language} = useContext(SettingsContext)
    const {resolvedTheme} = useTheme()

    return {
        darkMode: resolvedTheme === "dark",
        lang: language,
        ...add
    }
}

/**
 * @param children {(state: PageState) => any}
 * @return {*}
 * @constructor
 */
export function WithState({children}) {
    const state = usePageState()

    return children(state)
}
