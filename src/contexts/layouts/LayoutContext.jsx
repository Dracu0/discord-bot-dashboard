import {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";

export const LayoutContext = createContext({
    banner: {
        title: null,
        description: null,
        buttons: null
    },
    dataList: null,
    update: () => {}
})

export function useLayoutUpdate(props) {
    const {update} = useContext(LayoutContext)
    const propsRef = useRef(props)
    propsRef.current = props

    useEffect(
        () => update(propsRef.current),
        [update, props]
    )
}

export function LayoutProvider({initial = {}, children}) {
    const [context, setContext] = useState(initial)
    const update = useCallback((next) => setContext(next), [])

    return <LayoutContext.Provider
        value={{
            ...context,
            update
        }}>
        {children}
    </LayoutContext.Provider>
}