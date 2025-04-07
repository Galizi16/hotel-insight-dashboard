
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Calendar, 
  HotelIcon, 
  Users, 
  PieChart, 
  BellRing,
  Settings
} from "lucide-react";

const DashboardSidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <HotelIcon className="h-6 w-6 text-white" />
          <h1 className="text-xl font-bold text-white">HotelInsight</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className={isActive("/") ? "bg-sidebar-accent" : ""}>
              <Link to="/" className="flex items-center gap-3 text-white">
                <PieChart size={20} />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild className={isActive("/tarifs") ? "bg-sidebar-accent" : ""}>
              <Link to="/tarifs" className="flex items-center gap-3 text-white">
                <BarChart3 size={20} />
                <span>Tarifs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild className={isActive("/disponibilites") ? "bg-sidebar-accent" : ""}>
              <Link to="/disponibilites" className="flex items-center gap-3 text-white">
                <Calendar size={20} />
                <span>Disponibilités</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild className={isActive("/staff") ? "bg-sidebar-accent" : ""}>
              <Link to="/staff" className="flex items-center gap-3 text-white">
                <Users size={20} />
                <span>Staff</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild className={isActive("/concurrence") ? "bg-sidebar-accent" : ""}>
              <Link to="/concurrence" className="flex items-center gap-3 text-white">
                <BarChart3 size={20} />
                <span>Concurrence</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild className={isActive("/alertes") ? "bg-sidebar-accent" : ""}>
              <Link to="/alertes" className="flex items-center gap-3 text-white">
                <BellRing size={20} />
                <span>Alertes & Rapports</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="flex items-center gap-3 text-white opacity-70 hover:opacity-100 transition-opacity">
                <Settings size={20} />
                <span>Paramètres</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <div className="absolute right-0 top-3 -mr-10">
        <SidebarTrigger />
      </div>
    </Sidebar>
  );
};

export default DashboardSidebar;
