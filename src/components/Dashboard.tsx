import React, { useState } from 'react';
import logo from '../assets/logo_zeal_black.png';
import { 
  Users, 
  Video, 
  FolderOpen, 
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Settings,
  Copy,
  ExternalLink,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Plus,
  LayoutDashboard,
  UserCircle,
  Mail,
  LogOut,
  FileVideo,
  Search,
  Bell,
  Link2,
  MessageSquare,
  Filter,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  PanelLeft
} from 'lucide-react';
import { AppSidebar } from "./app-sidebar";
import { 
  SidebarProvider, 
  SidebarInset, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types
interface StatCard {
  id: string;
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

interface EditorProject {
  id: string;
  editorName: string;
  editorInitials: string;
  projectName: string;
  gdriveLink: string;
  status: 'in-progress' | 'pending-review' | 'completed' | 'needs-improvement';
  feedback: string;
  remarks: string;
  dueDate: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

// Sample Data
const statsData: StatCard[] = [
  {
    id: '1',
    label: 'Total Editors',
    value: '8',
    icon: <Users className="h-4 w-4" />,
    iconBg: 'bg-orange-50',
    iconColor: 'text-[#FF6B35]',
  },
  {
    id: '2',
    label: 'Projects In Progress',
    value: '12',
    icon: <Video className="h-4 w-4" />,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: '3',
    label: 'Pending Review',
    value: '5',
    icon: <Clock className="h-4 w-4" />,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    id: '4',
    label: 'Completed This Month',
    value: '24',
    icon: <CheckCircle2 className="h-4 w-4" />,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
];

const mainMenuItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, isActive: true },
  { id: 'editors', label: 'Editors', icon: <Users className="h-4 w-4" /> },
  { id: 'projects', label: 'Projects', icon: <FileVideo className="h-4 w-4" /> },
  { id: 'drive-links', label: 'Drive Links', icon: <FolderOpen className="h-4 w-4" /> },
  { id: 'feedback', label: 'Feedback', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
];

const bottomMenuItems: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
];

const editorProjects: EditorProject[] = [
  {
    id: '1',
    editorName: 'Haroon',
    editorInitials: 'HA',
    projectName: 'Wedding Highlight Reel',
    gdriveLink: 'https://drive.google.com/file/d/1XccAQq103q4XFA6AHBRRsLv1j3MBxAJa/view?usp=sharing',
    status: 'in-progress',
    feedback: '',
    remarks: '',
    dueDate: 'Feb 10',
  },
  {
    id: '2',
    editorName: 'Asad',
    editorInitials: 'AS',
    projectName: 'Corporate Event Video',
    gdriveLink: 'https://drive.google.com/file/d/14Pmi5136apGZkCVP5IxkiH-K2KNUKnvc/view?usp=drivesdk',
    status: 'needs-improvement',
    feedback: 'Color grading needs work',
    remarks: 'Needs Improvement',
    dueDate: 'Feb 8',
  },
  {
    id: '3',
    editorName: 'Miguel',
    editorInitials: 'MI',
    projectName: 'Product Launch Teaser',
    gdriveLink: 'https://drive.google.com/drive/folders/1hU5fIOQqoLH00ZQbGw1ARapxjKBTywOD',
    status: 'pending-review',
    feedback: '',
    remarks: 'Awaiting client approval',
    dueDate: 'Feb 9',
  },
  {
    id: '4',
    editorName: 'Sarah',
    editorInitials: 'SA',
    projectName: 'Music Video Edit',
    gdriveLink: 'https://drive.google.com/file/d/example4/view',
    status: 'completed',
    feedback: 'Great work on transitions!',
    remarks: 'Delivered',
    dueDate: 'Feb 5',
  },
  {
    id: '5',
    editorName: 'Haroon',
    editorInitials: 'HA',
    projectName: 'Documentary Trailer',
    gdriveLink: 'https://drive.google.com/file/d/example5/view',
    status: 'in-progress',
    feedback: '',
    remarks: '',
    dueDate: 'Feb 15',
  },
  {
    id: '6',
    editorName: 'Asad',
    editorInitials: 'AS',
    projectName: 'Social Media Package',
    gdriveLink: 'https://drive.google.com/file/d/example6/view',
    status: 'pending-review',
    feedback: '',
    remarks: '',
    dueDate: 'Feb 12',
  },
];

// Status Badge Component
const StatusBadge: React.FC<{ status: EditorProject['status'] }> = ({ status }) => {
  const variants: Record<EditorProject['status'], "default" | "secondary" | "destructive" | "outline"> = {
    'in-progress': 'secondary',
    'pending-review': 'outline',
    'completed': 'default',
    'needs-improvement': 'destructive',
  };

  const labels = {
    'in-progress': 'In Progress',
    'pending-review': 'Pending Review',
    'completed': 'Completed',
    'needs-improvement': 'Needs Improvement',
  };

  return (
    <Badge variant={variants[status]} className={cn(
      status === 'in-progress' && "bg-blue-500/10 text-blue-500 border-none hover:bg-blue-500/20",
      status === 'pending-review' && "bg-amber-500/10 text-amber-500 border-none hover:bg-amber-500/20",
      status === 'completed' && "bg-emerald-500/10 text-emerald-500 border-none hover:bg-emerald-500/20",
      status === 'needs-improvement' && "bg-red-500/10 text-red-500 border-none hover:bg-red-500/20",
      "font-medium text-[10px] uppercase tracking-wider"
    )}>
      {labels[status]}
    </Badge>
  );
};

// Top Header Bar Component
interface TopHeaderProps {
  activeTab: string;
}

const TopHeader: React.FC<TopHeaderProps> = ({ activeTab }) => {
  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'dashboard': return { title: 'Editor Dashboard', subtitle: 'Track and manage your video editors' };
      case 'editors': return { title: 'Our Editors', subtitle: 'Manage your creative talent pool' };
      case 'projects': return { title: 'Project Management', subtitle: 'Full view of all editing tasks' };
      case 'drive-links': return { title: 'Cloud Storage', subtitle: 'Centralized access to all project files' };
      case 'feedback': return { title: 'Quality Feedback', subtitle: 'Review and manage project critiques' };
      case 'analytics': return { title: 'Performance Analytics', subtitle: 'Data-driven insights for your workflow' };
      case 'settings': return { title: 'Portal Settings', subtitle: 'Configure your dashboard preferences' };
      default: return { title: 'Dashboard', subtitle: 'Zeal Highlights Admin' };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <header className="sticky top-0 h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border flex items-center justify-between px-4 z-40">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div>
          <h1 className="text-sm font-semibold text-foreground tracking-tight">{title}</h1>
          <p className="text-[10px] text-muted-foreground hidden sm:block">{subtitle}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="h-3 w-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-7 pr-3 py-1.5 bg-secondary border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary w-40"
          />
        </div>
        
        {/* Notifications */}
        <button className="relative p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-primary rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

// Stat Card Component
const StatCardComponent: React.FC<{ stat: StatCard }> = ({ stat }) => {
  return (
    <Card className="group hover:border-primary/50 transition-all duration-300">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
        </div>
        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
          "bg-primary/10 text-primary border border-primary/20"
        )}>
          {stat.icon}
        </div>
      </CardContent>
    </Card>
  );
};

// Editor Project Row Component
const EditorProjectRow: React.FC<{ project: EditorProject }> = ({ project }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(project.gdriveLink);
  };

  return (
    <TableRow className="group transition-colors">
      <TableCell className="py-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border border-border">
            <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
              {project.editorInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-foreground">{project.editorName}</span>
        </div>
      </TableCell>
      <TableCell className="py-3">
        <span className="text-xs text-muted-foreground">{project.projectName}</span>
      </TableCell>
      <TableCell className="py-3">
        <div className="flex items-center gap-1.5">
          <a 
            href={project.gdriveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-[11px] max-w-[180px] truncate"
          >
            {project.gdriveLink.substring(0, 35)}...
          </a>
          <button 
            onClick={handleCopyLink}
            className="p-1 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
            title="Copy link"
          >
            <Copy className="h-3 w-3 text-muted-foreground" />
          </button>
          <a 
            href={project.gdriveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
            title="Open link"
          >
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </a>
        </div>
      </TableCell>
      <TableCell className="py-3">
        <StatusBadge status={project.status} />
      </TableCell>
      <TableCell className="py-3 hidden lg:table-cell">
        <span className="text-muted-foreground text-[11px]">{project.feedback || '-'}</span>
      </TableCell>
      <TableCell className="py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>View details</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit3 className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Edit project</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};


// Main Dashboard Component
interface DashboardProps {
  isLoading?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isLoading = false }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredProjects = filterStatus === 'all' 
    ? editorProjects 
    : editorProjects.filter(p => p.status === filterStatus);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#FF6B35] animate-spin" />
      </div>
    );
  }

  const renderDashboardContent = () => (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {statsData.map((stat) => (
          <StatCardComponent key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Editor Projects Table */}
      <Card>
        <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">Recent Projects</CardTitle>
            <CardDescription className="text-[11px] mt-0.5">Quick overview of current editorial work</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Filter className="h-3 w-3 text-muted-foreground" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-[11px] border border-border rounded px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="in-progress">In Progress</option>
                <option value="pending-review">Pending Review</option>
                <option value="needs-improvement">Needs Improvement</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="h-9 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Editor</TableHead>
                <TableHead className="h-9 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Project</TableHead>
                <TableHead className="h-9 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">GDrive Link</TableHead>
                <TableHead className="h-9 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
                <TableHead className="h-9 px-4 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.slice(0, 5).map((project) => (
                <EditorProjectRow key={project.id} project={project} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="p-3 border-t border-border flex justify-center">
          <Button variant="link" size="sm" onClick={() => setActiveTab('projects')} className="text-[11px] font-medium text-primary">
            View All Projects
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  const renderEditorsContent = () => (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center px-6 border-b border-border">
        <div>
          <CardTitle>Active Editors</CardTitle>
          <CardDescription>Manage your creative talent pool</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="h-3 w-3 mr-2" />
          Add New Editor
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {editorProjects.slice(0, 4).map(e => (
          <div key={e.id} className="border border-border rounded-xl p-4 hover:shadow-md transition-all hover:border-primary/50 bg-card/50">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">{e.editorInitials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{e.editorName}</p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Video Editor</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-medium">
                  <span className="text-muted-foreground">Efficiency</span>
                  <span className="text-primary">94%</span>
                </div>
                <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[94%] transition-all"></div>
                </div>
              </div>
              <div className="flex justify-between text-[10px] pt-1">
                <span className="text-muted-foreground uppercase">Active Projects</span>
                <span className="text-foreground font-bold">3</span>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-[11px]">Profile</Button>
              <Button variant="outline" size="sm" className="flex-1 text-[11px]">Assign</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderProjectsContent = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between px-6 border-b border-border">
        <div>
          <CardTitle>Project Directory</CardTitle>
          <CardDescription>Full view of all ongoing and past editing tasks</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="h-3 w-3 mr-2" />
          New Project
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="h-9 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Editor</TableHead>
              <TableHead className="h-9 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Project</TableHead>
              <TableHead className="h-9 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">GDrive Link</TableHead>
              <TableHead className="h-9 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
              <TableHead className="h-9 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Due Date</TableHead>
              <TableHead className="h-9 px-4 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editorProjects.map((project) => (
              <TableRow key={project.id} className="hover:bg-muted/30">
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{project.editorInitials}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{project.editorName}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3"><span className="text-xs">{project.projectName}</span></TableCell>
                <TableCell className="py-3">
                  <a href={project.gdriveLink} className="text-primary text-[11px] truncate block max-w-[150px] hover:underline" target="_blank" rel="noopener noreferrer">{project.gdriveLink}</a>
                </TableCell>
                <TableCell className="py-3"><StatusBadge status={project.status} /></TableCell>
                <TableCell className="py-3"><span className="text-[11px] text-muted-foreground font-medium">{project.dueDate}</span></TableCell>
                <TableCell className="py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderDriveLinksContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {['Templates', 'Assets', 'Deliverables', 'Raw Footage', 'Archive', 'Invoices'].map(folder => (
        <Card key={folder} className="hover:border-primary/30 cursor-pointer group transition-all bg-card/50">
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <FolderOpen className="h-5 w-5" />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Link2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <h4 className="text-sm font-semibold text-foreground">{folder}</h4>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-medium">Last updated 2 days ago</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">128 items</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const renderFeedbackContent = () => (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center px-6 border-b border-border">
        <div>
          <CardTitle>Client Feedback</CardTitle>
          <CardDescription>Review and manage project critiques</CardDescription>
        </div>
        <Button variant="outline" size="sm">Export CSV</Button>
      </CardHeader>
      <CardContent className="p-0 divide-y divide-border">
        {editorProjects.filter(p => p.feedback).map(p => (
          <div key={p.id} className="p-6 hover:bg-muted/30 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{p.editorInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-xs font-bold text-foreground block">{p.projectName}</span>
                  <span className="text-[10px] text-muted-foreground tracking-wider uppercase">{p.editorName}</span>
                </div>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <div key={s} className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    s <= 4 ? "bg-primary" : "bg-muted"
                  )}></div>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed italic bg-secondary/50 p-3 rounded-lg border-l-4 border-primary/50">{p.feedback}</p>
            <div className="mt-3 flex justify-end">
              <Button variant="ghost" size="sm" className="h-7 text-[10px]">Reply to client</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderAnalyticsContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Throughput by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 flex items-end gap-2 justify-between px-2">
              {[65, 45, 80, 55, 90, 70, 85].map((val, i) => (
                <div key={i} className="flex-1 group relative">
                  <div 
                    className="bg-primary/20 group-hover:bg-primary transition-all rounded-t-lg w-full" 
                    style={{ height: `${val}%` }}
                  ></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover border border-border text-foreground text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 whitespace-nowrap shadow-xl">
                    {val}%
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-muted-foreground font-medium">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Editor Workload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {['Haroon', 'Asad', 'Miguel'].map(name => (
              <div key={name} className="space-y-2">
                <div className="flex justify-between text-[11px] font-medium">
                  <span className="text-foreground">{name}</span>
                  <span className="text-muted-foreground">8/10 assignments</span>
                </div>
                <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[80%] rounded-full shadow-[0_0_10px_rgba(255,107,53,0.2)]"></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card className="border-dashed bg-muted/20">
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="bg-primary/10 p-4 rounded-full inline-block mb-3">
              <BarChart3 className="h-8 w-8 text-primary shadow-lg" />
            </div>
            <p className="text-xs font-bold text-foreground">Interactive Engine Ready</p>
            <p className="text-[10px] text-muted-foreground mt-1">Advanced metrics will be streamed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettingsContent = () => (
    <Card className="max-w-2xl bg-card/50">
      <CardHeader className="border-b border-border">
        <CardTitle>Admin Preferences</CardTitle>
        <CardDescription>Configure your portal experience and notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
            <UserCircle className="h-3.5 w-3.5" />
            Profile Settings
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Display Name</label>
              <input type="text" defaultValue="Admin Portal" className="w-full text-xs px-3 py-2 bg-secondary border border-border rounded-md focus:ring-1 focus:ring-primary outline-none text-foreground" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Notification Email</label>
              <input type="email" defaultValue="admin@zeal.com" className="w-full text-xs px-3 py-2 bg-secondary border border-border rounded-md focus:ring-1 focus:ring-primary outline-none text-foreground" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
            <Bell className="h-3.5 w-3.5" />
            System Alerts
          </h4>
          <div className="space-y-4">
            {[
              { id: 'proj-due', label: 'Projects due in 24h', desc: 'Critical alerts for nearing deadlines' },
              { id: 'new-fb', label: 'New Client Feedback', desc: 'Notify immediately on project reviews' },
              { id: 'sys-up', label: 'System Updates', desc: 'Portal maintenance and feature rollout alerts' }
            ].map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div>
                  <p className="text-xs font-bold text-foreground">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                </div>
                <div className="w-9 h-5 bg-primary/20 rounded-full relative cursor-pointer border border-primary/20">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full shadow-[0_0_8px_rgba(255,107,53,0.4)]"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button variant="ghost" size="sm">Reset Defaults</Button>
          <Button size="sm">Save Configuration</Button>
        </div>
      </CardContent>
    </Card>
  );

  const getActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboardContent();
      case 'editors': return renderEditorsContent();
      case 'projects': return renderProjectsContent();
      case 'drive-links': return renderDriveLinksContent();
      case 'feedback': return renderFeedbackContent();
      case 'analytics': return renderAnalyticsContent();
      case 'settings': return renderSettingsContent();
      default: return renderDashboardContent();
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <SidebarInset className="flex flex-col flex-1 min-h-screen bg-background">
        <TopHeader activeTab={activeTab} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto w-full">
            {getActiveTabContent()}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;
