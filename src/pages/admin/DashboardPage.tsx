import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  FolderKanban, 
  Clock, 
  CheckCircle, 
  Plus, 
  FileText, 
  CreditCard, 
  Settings,
  MoreVertical,
  Scissors,
  ExternalLink,
  Copy
} from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';

// Helper component for stat cards
interface StatCardProps { title: string; value: string; icon: React.ReactNode; delay: number; }
const StatCard = ({ title, value, icon, delay }: StatCardProps) => (
  <Card className="overflow-hidden transition-all bg-card border-border/40 hover:translate-y-[-2px] animate-fade-in" style={{ animationDelay: `${delay}s` }}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-4 pt-4">
      <CardTitle className="text-[9px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">{title}</CardTitle>
      <div className="text-muted-foreground/30">{icon}</div>
    </CardHeader>
    <CardContent className="px-4 pb-4">
      <div className="text-2xl font-light tracking-tight">{value}</div>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const { loading, stats, projects, editors } = useDashboardData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading || !stats || !mounted) {
    return (
      <div className="space-y-6 p-4 pt-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-0 md:p-6 md:pt-0">
      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-2">
           <Button variant="outline" size="sm" className="h-8 text-[11px] font-medium uppercase tracking-wider px-4 rounded-full">Download Report</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <StatCard 
          title="Active Projects" 
          value={stats?.activeProjects.toString() || '0'} 
          icon={<FolderKanban className="h-3.5 w-3.5" />} 
          delay={0.1}
        />
        <StatCard 
          title="Editors Online" 
          value={stats?.editorsOnline.toString() || '0'} 
          icon={<Users className="h-3.5 w-3.5" />} 
          delay={0.2}
        />
        <StatCard 
          title="Pending Reviews" 
          value={stats?.pendingReviews.toString() || '0'} 
          icon={<Clock className="h-3.5 w-3.5" />} 
          delay={0.3}
        />
        <StatCard 
          title="Delivered" 
          value={stats?.deliveredThisWeek.toString() || '0'} 
          icon={<CheckCircle className="h-3.5 w-3.5" />} 
          delay={0.4}
        />
      </div>

        {/* Horizontal scroll wrapping for mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <Button variant="secondary" size="sm" className="h-8 rounded-full shrink-0 text-[10px] font-semibold uppercase tracking-widest px-5" asChild>
            <Link to="/admin/projects"><Plus className="h-3 w-3 mr-1.5" /> New Project</Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 rounded-full shrink-0 text-[10px] font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground px-4" asChild>
            <Link to="/admin/projects">Pipeline</Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 rounded-full shrink-0 text-[10px] font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground px-4" asChild>
            <Link to="/admin/editors">Editors</Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 rounded-full shrink-0 text-[10px] font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground px-4" asChild>
            <Link to="/admin/settings">Settings</Link>
          </Button>
        </div>

      {/* Information Split Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4 pb-8">
        {/* Active Projects List */}
        <Card className={`transition-all duration-700 delay-500 bg-card border-border/40 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <CardHeader className="pb-2 px-5 pt-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Active Projects</CardTitle>
              <Link to="/admin/projects" className="text-[9px] font-semibold text-muted-foreground/60 hover:text-foreground transition-colors uppercase tracking-[0.12em]">View All</Link>
            </div>
          </CardHeader>
          <CardContent className="px-3 pb-4">
            {loading ? (
              <div className="p-8 flex justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : projects.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No active projects to display</div>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {projects.map((item: any) => (
                  <li key={item.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl hover:bg-muted/20 transition-all border border-transparent hover:border-border/10">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-lg shrink-0 transition-colors ${item.name.toLowerCase().includes('greg') ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground/40'}`}>
                        <FolderKanban className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-xs text-foreground tracking-tight">{item.name}</span>
                        <div className="flex items-center gap-2 mt-0.5 opacity-60">
                          <span className="text-[8px] font-semibold uppercase tracking-[0.08em]">{item.client}</span>
                          <span className="text-[8px] opacity-30">/</span>
                          <span className="text-[8px] font-semibold uppercase tracking-[0.08em]">{item.phase}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-8 mt-2 sm:mt-0">
                      <div className="flex flex-col sm:items-end">
                        <span className="text-[10px] font-medium text-muted-foreground tabular-nums tracking-wide">{item.due}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className={`w-1 h-1 rounded-full ${
                            item.status === 'On Track' ? 'bg-emerald-500' : 
                            item.status === 'Pending Review' ? 'bg-amber-500' : 
                            'bg-red-500'
                          }`}></div>
                          <span className="text-[10px] font-medium text-foreground opacity-80">{item.status}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Editors List */}
        <Card className={`transition-all duration-700 delay-600 bg-card border-border/40 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <CardHeader className="pb-2 px-5 pt-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Editor Status</CardTitle>
              <Link to="/admin/editors" className="text-[9px] font-semibold text-muted-foreground/60 hover:text-foreground transition-colors uppercase tracking-[0.12em]">View Team</Link>
            </div>
          </CardHeader>
          <CardContent className="px-3 pb-4">
            {loading ? (
              <div className="p-8 flex justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : editors.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No editors to display</div>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {editors.map((item: any) => (
                  <li key={item.id} className="group flex items-center justify-between p-3.5 rounded-xl hover:bg-muted/20 transition-all border border-transparent hover:border-border/10">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 border transition-colors ${item.currentProject.toLowerCase().includes('greg') ? 'bg-primary/20 text-primary border-primary/20' : 'bg-muted/50 text-muted-foreground border-border/10'}`}>
                        {item.name.charAt(0)}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="font-medium text-xs text-foreground truncate tracking-tight">{item.name}</span>
                        <span className="text-[8px] text-muted-foreground/70 truncate uppercase tracking-[0.08em] opacity-60 font-semibold">{item.role}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[10px] font-medium text-muted-foreground/60 tracking-wide">{item.currentProject === 'None' ? 'Available' : item.currentProject}</span>
                      </div>
                      <div className="flex items-center gap-2 w-[70px] justify-end">
                        <div className={`w-1 h-1 rounded-full ${
                          item.status === 'Online' ? 'bg-blue-500' :
                          item.status === 'Offline' ? 'bg-muted-foreground/30' :
                          'bg-purple-500'
                        }`}></div>
                        <span className="text-[10px] font-medium text-foreground opacity-80">{item.status}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
