import { NavLink } from "react-router-dom";
import { Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/components/layout/nav-items";
import { useMessagesStore } from "@/lib/messages-store";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const newMessageCount = useMessagesStore(
    (s) => s.items.filter((m) => m.status === "new").length,
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Waves className="h-[18px] w-[18px]" />
        </span>
        <span className="text-sm font-semibold tracking-tight">
          Aurelia Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const badge =
            item.href === "/messages" && newMessageCount > 0
              ? newMessageCount
              : null;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-border p-4 text-xs text-muted-foreground">
        Aurelia Outdoor &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
