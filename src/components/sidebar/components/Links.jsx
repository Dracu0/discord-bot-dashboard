import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLocale } from "utils/Language";
import { ChevronRight, Circle } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "components/ui/tooltip";
import { cn } from "lib/utils";

function routeIsActive(pathname, segment) {
  return pathname.includes(`/${segment}`);
}

export function SidebarLinks({ routes, collapsed, onNavigate }) {
  const locale = useLocale();

  const grouped = [];
  let lastCategory = null;

  (routes || []).forEach((route, index) => {
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
        <div key={item.key} className="mt-4.5 mb-2 px-1">
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
  const active = routeIsActive(location.pathname, route.path);

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
        <div className="mt-1 flex flex-col gap-1 pl-4">
          {active &&
            route.items &&
            route.items.map((item, key) => {
              const path = `${route.path}/${item.path}`;
              return (
                <Item
                  key={key}
                  path={path}
                  active={routeIsActive(location.pathname, item.path)}
                  name={item.name}
                  icon={<ChevronRight size={14} />}
                  collapsed={false}
                  onNavigate={onNavigate}
                  nested
                />
              );
            })}
        </div>
      )}
    </>
  );
}

function Item({ active, name, path, icon, collapsed, onNavigate, nested = false }) {
  const locale = useLocale();
  const label = locale(name);

  const button = ({ isActive }) => (
    <div
      className={cn(
        "group relative my-0.5 flex w-full items-center transition-all duration-200",
        collapsed
          ? "justify-center rounded-2xl px-0 py-3"
          : nested
            ? "justify-start rounded-2xl px-3 py-2"
            : "justify-start rounded-2xl px-3.5 py-3"
      )}
    >
      {isActive && !collapsed && (
        <span className="absolute inset-y-2 left-1.5 w-1 rounded-full bg-(--accent-primary)" />
      )}
      <div
        className={cn(
          "flex w-full items-center",
          collapsed ? "justify-center gap-0" : nested ? "justify-start gap-2" : "justify-start gap-3"
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-center transition-colors duration-150",
            collapsed ? "w-6" : nested ? "w-4" : "w-5",
            isActive ? "text-(--accent-primary)" : "text-(--text-muted) group-hover:text-(--text-primary)"
          )}
        >
          {icon}
        </div>
        {!collapsed && (
          <span
            className={cn(
              "flex-1 truncate text-left font-['Space_Grotesk'] text-sm transition-colors duration-150",
              isActive ? "font-semibold text-(--text-primary)" : "font-medium text-(--text-secondary) group-hover:text-(--text-primary)",
              nested && "text-[13px]"
            )}
          >
            {label}
          </span>
        )}
        {!collapsed && !nested && (
          <ChevronRight
            size={16}
            className={cn(
              "shrink-0 transition-all duration-150",
              isActive ? "translate-x-0 text-(--accent-primary)" : "text-(--text-muted) opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"
            )}
          />
        )}
      </div>
    </div>
  );

  return (
    <NavLink
      to={path}
      onClick={onNavigate}
      style={{ textDecoration: "none" }}
      className={({ isActive }) => cn(
        collapsed ? "block" : "block rounded-2xl",
        isActive
          ? "bg-(--sidebar-active) shadow-[inset_0_0_0_1px_rgba(99,102,241,0.12)]"
          : "hover:bg-(--sidebar-hover)"
      )}
    >
      {collapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{button({ isActive: active })}</TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        button({ isActive: active })
      )}
    </NavLink>
  );
}

export default SidebarLinks;
