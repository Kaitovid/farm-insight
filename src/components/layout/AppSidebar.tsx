import {
  LayoutDashboard,
  Bird,
  Beef,
  Syringe,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const menuItems = [
  { title: 'Panel de Control', url: '/', icon: LayoutDashboard },
  { title: 'Avicultura', url: '/avicultura', icon: Bird },
  { title: 'Ganadería', url: '/ganaderia', icon: Beef },
  { title: 'Control Sanitario', url: '/sanitario', icon: Syringe },
];

function SidebarContent({ collapsed, onToggle, onNavClick }: { collapsed: boolean; onToggle: () => void; onNavClick?: () => void }) {
  return (
    <>
      {/* Header - Solo visible en desktop */}
      <div className="hidden lg:flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent">
              <Beef className="h-5 w-5 text-sidebar-accent-foreground" />
            </div>
            <span className="font-serif text-lg font-bold text-sidebar-foreground">
              AgroSistem
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            onClick={onNavClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "lg:justify-center lg:px-2"
            )}
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className={cn(collapsed && "lg:hidden")}>{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}

export function AppSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AppSidebarProps) {
  return (
    <>
      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar lg:hidden">
          <SidebarContent collapsed={false} onToggle={onToggle} onNavClick={onMobileClose} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out lg:block",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      </aside>
    </>
  );
}
