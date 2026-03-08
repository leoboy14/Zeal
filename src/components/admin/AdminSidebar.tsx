import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Scissors, 
  Settings, 
  Menu, 
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessageSquare
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; // Might not be installed, but I'll add an SR-only class instead just in case.
import Logo from '../../assets/logo.png';
import LogoBlack from '../../assets/logo_zeal_black.png';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
  { icon: Users, label: 'Clients', path: '/admin/clients' },
  { icon: Scissors, label: 'Editors', path: '/admin/editors' },
  { icon: MessageSquare, label: 'QA Feedback', path: '/admin/qa' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed?: (val: boolean) => void;
  isMobile: boolean;
  isOpen?: boolean;
  setIsOpen?: (val: boolean) => void;
}

export default function AdminSidebar({ 
  isCollapsed, 
  setIsCollapsed, 
  isMobile, 
  isOpen, 
  setIsOpen 
}: AdminSidebarProps) {
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background border-r text-foreground">
      {/* Header */}
      <div className={cn(
        "h-14 flex items-center border-b shrink-0 relative",
        isCollapsed ? "justify-center px-2" : "px-4 justify-between"
      )}>
        <div className={cn("flex items-center gap-2.5 overflow-hidden", isCollapsed && "justify-center")}>
          <div className="w-6 h-6 flex items-center justify-center shrink-0 overflow-hidden relative rounded-sm bg-foreground/5 p-1">
             <img src={LogoBlack} alt="Zeal Logo Mark Light" className="w-full h-auto object-contain dark:hidden" />
             <img src={Logo} alt="Zeal Logo Mark Dark" className="w-full h-auto object-contain hidden dark:block" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-semibold text-xs leading-tight text-foreground tracking-tight">Zeal Labs</span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider scale-95 origin-left opacity-60">Admin</span>
            </div>
          )}
        </div>
        {!isMobile && setIsCollapsed && (
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "transition-all",
              isCollapsed ? "absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 border-2 border-background z-50" : "ml-auto"
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 overflow-y-auto px-3 space-y-1">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => {
            const isActive = item.path === '/admin' 
              ? location.pathname === '/admin' 
              : location.pathname.startsWith(item.path);
              
            return (
              <Tooltip key={item.path} disableHoverableContent>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.path}
                    className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all relative overflow-hidden group w-full uppercase tracking-wider",
                        isActive 
                          ? "bg-muted text-foreground" 
                          : "text-muted-foreground/70 hover:bg-muted/30 hover:text-foreground"
                      )}
                    onClick={() => {
                      if (isMobile && setIsOpen) setIsOpen(false);
                    }}
                  >
                    <item.icon className={cn("h-3.5 w-3.5 shrink-0 transition-colors opacity-80", isActive ? "text-foreground" : "")} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                </TooltipTrigger>
                {isCollapsed && !isMobile && (
                  <TooltipContent side="right">{item.label}</TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>

      {/* Footer - User Profile */}
      <div className="p-4 border-t shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback><Users className="h-3.5 w-3.5" /></AvatarFallback>
              </Avatar>
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium leading-none text-foreground">Admin User</span>
                <span className="text-xs text-muted-foreground mt-1 truncate">admin@zeallabs.com</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
             <Avatar className="h-7 w-7 shrink-0 grayscale opacity-70">
                <AvatarFallback className="bg-muted text-[10px]">AD</AvatarFallback>
              </Avatar>
             <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive">
               <LogOut className="h-3.5 w-3.5" />
             </Button>
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="p-0 w-72">
          {/* Hidden title for screen readers */}
          <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div 
      className={cn(
         "h-screen transition-all duration-300 ease-in-out shrink-0 relative",
         isCollapsed ? "w-[64px]" : "w-[220px]"
      )}
    >
      <SidebarContent />
    </div>
  );
}
