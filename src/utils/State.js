import {useContext} from "react";
import {SettingsContext} from "../contexts/SettingsContext";
import {useComputedColorScheme} from "@mantine/core";

export function usePageState(add) {
    const {language} = useContext(SettingsContext)
    const colorScheme = useComputedColorScheme('dark')

    return {
        darkMode: colorScheme === "dark",
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