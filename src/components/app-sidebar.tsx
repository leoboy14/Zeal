import * as React from "react"
import {
  LayoutDashboard,
  Users,
  FileVideo,
  FolderOpen,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  UserCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import logo from "../assets/logo_zeal_black.png"

const mainMenuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "editors", label: "Editors", icon: Users },
  { id: "projects", label: "Projects", icon: FileVideo },
  { id: "drive-links", label: "Drive Links", icon: FolderOpen },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
]

const bottomMenuItems = [
  { id: "settings", label: "Settings", icon: Settings },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeTab: string
  setActiveTab: (id: string) => void
}

export function AppSidebar({ activeTab, setActiveTab, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar" {...props}>
      <SidebarHeader className="border-b border-sidebar-border h-14 flex items-center px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <img src={logo} alt="Zeal" className="size-5 object-contain" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">
            <span className="truncate font-semibold text-sidebar-foreground">Zeal Highlights</span>
            <span className="truncate text-xs text-muted-foreground uppercase tracking-wider">Admin Portal</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                    tooltip={item.label}
                    className={cn(
                      "transition-all duration-200",
                      activeTab === item.id && "bg-primary/10 text-primary hover:bg-primary/15"
                    )}
                  >
                    <item.icon className={activeTab === item.id ? "text-primary" : "text-sidebar-foreground"} />
                    <span className="font-medium">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {bottomMenuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                tooltip={item.label}
                className={cn(
                  activeTab === item.id && "bg-primary/10 text-primary hover:bg-primary/15"
                )}
              >
                <item.icon className={activeTab === item.id ? "text-primary" : "text-sidebar-foreground"} />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarSeparator className="my-2" />
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-3 overflow-hidden">
              <div className="size-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <UserCircle className="size-5 text-muted-foreground" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">
                <span className="truncate font-medium text-foreground">Admin</span>
                <span className="truncate text-xs text-muted-foreground">admin@zeal.com</span>
              </div>
              <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground group-data-[collapsible=icon]:hidden">
                <LogOut className="size-4" />
              </button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={`mx-2 h-px bg-sidebar-border ${className}`} {...props} />
}
