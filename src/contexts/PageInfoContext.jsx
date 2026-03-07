import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {useLocation} from "react-router-dom";
import routes from "../routes";
import {useLocale} from "../utils/Language";

export const PageInfoContext = createContext({
    routes: null,
    toggleSidebar: null,
    setToggleSidebar: null,
    info: null,
    setInfo: null
});

const DEFAULT_SECTION = {zh: "頁面", en: "Pages"};

function normalizePageInfo(value) {
    if (value == null) {
        return {};
    }

    if (Array.isArray(value)) {
        const trail = value.filter(Boolean);

        return {
            trail,
            title: trail[trail.length - 1] || null,
        };
    }

    if (typeof value === "string") {
        return {
            title: value,
            trail: [value],
        };
    }

    if (typeof value === "object") {
        const trail = Array.isArray(value.trail)
            ? value.trail.filter(Boolean)
            : value.title
                ? [value.title]
                : [];

        return {
            ...value,
            trail,
            title: value.title ?? trail[trail.length - 1] ?? null,
        };
    }

    return {};
}

function resolveRouteInfo(routeList, pathname, locale) {
    const segments = pathname.split("/").filter(Boolean);
    const guildIndex = segments.indexOf("guild");
    const scopedSegments = guildIndex >= 0
        ? segments.slice(guildIndex + 2)
        : segments;
    const [topLevel, nestedItem, nestedMode] = scopedSegments;

    const route = routeList.find((entry) => entry.path === topLevel);
    if (!route) {
        return {
            section: locale(DEFAULT_SECTION),
            trail: [],
            title: null,
        };
    }

    const trail = [locale(route.name)].filter(Boolean);

    if (nestedItem && route.items) {
        const matchedItem = route.items.find((item) => item.path === nestedItem);
        if (matchedItem) {
            trail.push(locale(matchedItem.name));
        }
    }

    if (topLevel === "actions") {
        if (nestedMode === "task") {
            trail.push(locale({zh: "任務", en: "Task"}));
        } else if (nestedMode === "add") {
            trail.push(locale({zh: "新任務", en: "New Task"}));
        }
    }

    return {
        section: route.category ? locale(route.category) : locale(DEFAULT_SECTION),
        trail,
        title: trail[trail.length - 1] ?? null,
    };
}

export function usePageInfo(name) {
    const {setInfo} = useContext(PageInfoContext);
    const normalized = useMemo(() => normalizePageInfo(name), [name]);
    const signature = JSON.stringify(normalized);

    useEffect(() => {
        if (typeof setInfo === "function") {
            setInfo(normalized);
        }
    }, [setInfo, signature])
}

export function PageInfoProvider({children}) {
    const location = useLocation();
    const locale = useLocale();
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [info, setInfo] = useState({})

    const routeInfo = useMemo(
        () => resolveRouteInfo(routes, location.pathname, locale),
        [location.pathname, locale]
    );

    const resolvedInfo = useMemo(() => {
        const trail = info.trail?.length
            ? info.trail
            : info.title
                ? [info.title]
                : routeInfo.trail;

        return {
            section: info.section ?? routeInfo.section,
            title: info.title ?? trail[trail.length - 1] ?? routeInfo.title,
            trail,
        };
    }, [info, routeInfo]);

    return <PageInfoContext.Provider
        value={{
            routes,
            toggleSidebar,
            setToggleSidebar,
            info: resolvedInfo,
            setInfo
        }}>
        {children}
    </PageInfoContext.Provider>
}