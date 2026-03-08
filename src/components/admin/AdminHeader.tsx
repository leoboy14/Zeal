import React, { useEffect, useState } from 'react';
import { Menu, Search, Sun, Moon, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useLocation } from 'react-router-dom';

interface AdminHeaderProps {
  setIsMobileMenuOpen: (val: boolean) => void;
}

export default function AdminHeader({ setIsMobileMenuOpen }: AdminHeaderProps) {
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check initial logic or document class
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setIsDark(!isDark);
  };

  // Simple title mapping based on route
  const getPageContext = () => {
    const path = location.pathname;
    if (path.includes('/admin/projects')) return { title: 'Projects', description: 'Manage and track your video production pipeline.' };
    if (path.includes('/admin/clients')) return { title: 'Clients', description: 'Manage client relationships and contact details.' };
    if (path.includes('/admin/editors')) return { title: 'Editors', description: "Monitor your team's availability and assignments." };
    if (path.includes('/admin/qa')) return { title: 'QA & Feedback', description: 'Review videos and manage client feedback.' };
    if (path.includes('/admin/settings')) return { title: 'Settings', description: 'Configure application defaults and global preferences.' };
    return { title: 'Overview', description: 'Overview and key metrics' };
  };

  const { title, description } = getPageContext();

  return (
    <header className="h-14 border-b shrink-0 flex items-center justify-between px-4 md:px-6 bg-background text-foreground sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden sm:flex flex-col">
          <h1 className="text-sm font-bold uppercase tracking-tight">{title}</h1>
          <p className="text-[10px] text-muted-foreground leading-tight font-medium opacity-70">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
        <div className="relative w-full max-w-xs hidden sm:flex items-center">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="pl-9 bg-muted/50 border-transparent focus-visible:ring-1 rounded-full h-9"
          />
        </div>
        
        {/* Mobile Search Icon */}
        <Button variant="ghost" size="icon" className="sm:hidden text-muted-foreground">
          <Search className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground transition-transform active:scale-95">
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-destructive">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
