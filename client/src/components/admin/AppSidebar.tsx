import { 
  Building2, 
  FileText, 
  Settings as SettingsIcon, 
  LayoutDashboard, 
  LogOut,
  ChevronRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export function AppSidebar() {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Services", href: "/admin/services", icon: Building2 },
    { name: "Blog Posts", href: "/admin/posts", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: SettingsIcon },
  ];

  return (
    <Sidebar variant="inset" className="bg-sidebar bg-opacity-90 border-r border-sidebar-border">
      <div className="p-6 flex bg-white items-center gap-3 border-b border-sidebar-border">
        <div className="bg-sidebar-primary p-2 rounded-lg text-sidebar-primary-foreground">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-display font-bold text-lg leading-tight tracking-tight">CAC Portal</h2>
          <p className="text-xs text-sidebar-foreground/60 font-medium">Agent Management</p>
        </div>
      </div>
      
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 mt-4 mb-2 px-6">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`mb-1 transition-all ${isActive ? 'bg-sidebar-primary/10 text-sidebar-primary font-semibold' : 'hover:bg-sidebar-accent'}`}
                    >
                      <Link href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/70'}`} />
                        <span>{item.name}</span>
                        {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-white p-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-bold font-display">
            {user?.firstName?.[0] || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-destructive/10 text-destructive font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
