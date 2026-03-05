import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLocale } from "utils/Language";
import { Circle } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "components/ui/tooltip";
import { cn } from "lib/utils";

function hasSegment(pathname, segment) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.includes(segment);
}

function endsWithSegment(pathname, segment) {
  const segments = pathname.split("/").filter(Boolean);
  return segments[segments.length - 1] === segment;
}

export function SidebarLinks({ routes, collapsed, onNavigate }) {
  const locale = useLocale();

  const grouped = [];
  let lastCategory = null;

  routes.forEach((route, index) => {
    const cat = route.category ? locale(route.category) : null;
    if (cat && cat !== lastCategory) {
      grouped.push({ type: "category", label: cat, key: `cat-${index}` });
      lastCategory = cat;
    }
    grouped.push({ type: "route", route, key: `route-${index}` });
  });

  return grouped.map((item) => {
    if (item.type === "category") {
      if (collapsed) return null;
      return (
        <div key={item.key} className="mt-[18px] mb-2 px-1">
          <span
            className="text-[11px] font-bold uppercase"
            style={{
              color: "var(--text-muted)",
              fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
              letterSpacing: "1.5px",
            }}
          >
            {item.label}
          </span>
        </div>
      );
    }
    return (
      <RouteItem
        key={item.key}
        route={item.route}
        collapsed={collapsed}
        onNavigate={onNavigate}
      />
    );
  });
}

function RouteItem({ route, collapsed, onNavigate }) {
  const location = useLocation();
  const active = endsWithSegment(location.pathname, route.path);
  const includes = hasSegment(location.pathname, route.path);

  return (
    <>
      <Item
        name={route.name}
        path={route.path}
        active={active}
        icon={route.icon}
        collapsed={collapsed}
        onNavigate={onNavigate}
      />

      {!collapsed && (
        <div className="flex flex-col pl-6">
          {includes &&
            route.items &&
            route.items.map((item, key) => {
              const path = `${route.path}/${item.path}`;
              return (
                <Item
                  key={key}
                  path={path}
                  active={hasSegment(location.pathname, item.path)}
                  name={item.name}
                  icon={<Circle size={8} />}
                  collapsed={false}
                  onNavigate={onNavigate}
                />
              );
            })}
        </div>
      )}
    </>
  );
}

function Item({ active, name, path, icon, collapsed, onNavigate }) {
  const locale = useLocale();
  const label = locale(name);

  const button = (
    <button
      type="button"
      onClick={onNavigate}
      className={cn(
        "w-full my-0.5 flex items-center border-0 cursor-pointer transition-all duration-200",
        collapsed
          ? "py-2.5 px-0 justify-center"
          : "py-1.5 px-2.5 justify-start"
      )}
      style={{
        borderRadius: "var(--radius-md)",
        background: active ? "var(--sidebar-active)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!active)
          e.currentTarget.style.background = "var(--sidebar-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = active
          ? "var(--sidebar-active)"
          : "transparent";
      }}
    >
      <div
        className={cn(
          "flex items-center w-full",
          collapsed ? "gap-0 justify-center" : "gap-2.5 justify-start"
        )}
      >
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            color: active ? "var(--accent-primary)" : "var(--text-muted)",
            width: collapsed ? 24 : 20,
          }}
        >
          {icon}
        </div>
        {!collapsed && (
          <span
            className="flex-1 text-sm truncate text-left"
            style={{
              color: active ? "var(--text-primary)" : "var(--text-secondary)",
              fontWeight: active ? 600 : 400,
              fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
            }}
          >
            {label}
          </span>
        )}
        {!collapsed && active && (
          <div
            className="shrink-0"
            style={{
              width: 4,
              height: 20,
              borderRadius: 4,
              background: "var(--accent-primary)",
            }}
          />
        )}
      </div>
    </button>
  );

  return (
    <NavLink to={path} style={{ textDecoration: "none" }}>
      {collapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        button
      )}
    </NavLink>
  );
}

export default SidebarLinks;
