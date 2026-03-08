import React, { useState } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { FolderKanban, Plus, Clock, Users, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../components/ui/dropdown-menu';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '../../components/ui/sheet';
import { Input } from '../../components/ui/input';
import { backend } from '../../lib/backend';

export default function ProjectsPage() {
  const { projects, loading, editors, clients, refresh } = useDashboardData();
  const [localProjects, setLocalProjects] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    client: '',
    editor: '',
    status: 'On Track',
    phase: 'Production',
    due: '',
    video_url: '',
    thumbnail_url: '',
    current_version: 1,
    video_versions: [] as { version: number; url: string; created_at: string }[],
    video_type: 'upload' as 'upload' | 'heygen',
    heygen_url: ''
  });

  // Sync local state when projects change
  React.useEffect(() => {
    if (projects) setLocalProjects(projects);
  }, [projects]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await backend.deleteProject(id);
      setLocalProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete project.');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await backend.updateProject(id, { status: newStatus });
      setLocalProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      await backend.updateProject(editingProject.id, editingProject);
      // Update local state immediately for instant feedback
      setLocalProjects(prev => prev.map(p => p.id === editingProject.id ? editingProject : p));
      await refresh(); // Still force global refresh to ensure everything is in sync
      setEditingProject(null);
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update project.');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await backend.createProject(newProject);
      await refresh(); // Force global refresh
      setIsAdding(false);
      setNewProject({ 
        name: '', 
        client: '', 
        editor: '', 
        status: 'On Track', 
        phase: 'Production', 
        due: '', 
        video_url: '', 
        thumbnail_url: '',
        current_version: 1,
        video_versions: [],
        video_type: 'upload',
        heygen_url: ''
      });
    } catch (error) {
      console.error('Create failed:', error);
      alert('Failed to create project.');
    }
  };

  if (loading) {
    return <div className="p-8 animate-pulse">Loading projects...</div>;
  }

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-8 pt-0">
      <div className="flex items-center justify-end">
        <Sheet open={isAdding} onOpenChange={setIsAdding}>
          <SheetTrigger asChild>
            <Button variant="outline" className="rounded-full px-5 h-9 text-[11px] font-medium uppercase tracking-[0.1em] border-border/60">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> New Project
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create New Project</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-6">
              <div className="space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Project Name</label>
                <Input 
                  placeholder="e.g. Wedding Highlight" 
                  value={newProject.name} 
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                  required
                  className="rounded-lg bg-muted/5 border-border/40 focus:bg-background transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Client</label>
                <select 
                  className="flex h-10 w-full rounded-lg border border-border/40 bg-muted/5 px-3 py-2 text-sm ring-offset-background focus:bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-all"
                  value={newProject.client}
                  onChange={e => setNewProject({...newProject, client: e.target.value})}
                  required
                >
                  <option value="" disabled>Select a client</option>
                  {clients?.map(client => (
                    <option key={client.id} value={client.name}>{client.name}</option>
                  ))}
                  {newProject.client && !clients.some(c => c.name === newProject.client) && (
                    <option value={newProject.client}>{newProject.client} (Legacy)</option>
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Assigned Editors (select to add)</label>
                <Input 
                  placeholder="e.g. LIZA M. / SARAH T." 
                  value={newProject.editor} 
                  onChange={e => setNewProject({...newProject, editor: e.target.value})}
                  required
                  className="rounded-lg bg-muted/5 border-border/40 focus:bg-background transition-all"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {editors?.map(editor => (
                    <button
                      key={editor.id}
                      type="button"
                      onClick={() => {
                        const currentEditors = newProject.editor ? newProject.editor.split('/').map((s: string) => s.trim()) : [];
                        if (currentEditors.includes(editor.name)) {
                          setNewProject({
                            ...newProject,
                            editor: currentEditors.filter((s: string) => s !== editor.name).join(' / ')
                          });
                        } else {
                          setNewProject({
                            ...newProject,
                            editor: [...currentEditors, editor.name].filter(Boolean).join(' / ')
                          });
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        newProject.editor?.includes(editor.name)
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-muted/10 text-muted-foreground border-border/40 hover:bg-muted/20'
                      }`}
                    >
                      {editor.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Current Phase</label>
                <Input 
                  placeholder="e.g. Rough Cut" 
                  value={newProject.phase} 
                  onChange={e => setNewProject({...newProject, phase: e.target.value})}
                  required
                  className="rounded-lg bg-muted/5 border-border/40 focus:bg-background transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Due Date</label>
                <Input 
                  placeholder="e.g. Oct 24, 2024" 
                  value={newProject.due} 
                  onChange={e => setNewProject({...newProject, due: e.target.value})}
                  required
                  className="rounded-lg bg-muted/5 border-border/40 focus:bg-background transition-all"
                />
              </div>
              <div className="space-y-4 pt-2 border-t border-border/20">
                <div className="space-y-2">
                  <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Video Source</label>
                  <div className="flex p-1 bg-muted/10 rounded-lg border border-border/20">
                    <button 
                      type="button"
                      className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all ${newProject.video_type === 'upload' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      onClick={() => setNewProject({...newProject, video_type: 'upload'})}
                    >
                      UPLOAD
                    </button>
                    <button 
                      type="button"
                      className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all ${newProject.video_type === 'heygen' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      onClick={() => setNewProject({...newProject, video_type: 'heygen'})}
                    >
                      HEYGEN
                    </button>
                  </div>
                </div>

                {newProject.video_type === 'heygen' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                    <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">HeyGen Embed Code / URL</label>
                    <Input 
                      placeholder="Paste iframe code or URL here" 
                      value={newProject.heygen_url} 
                      onChange={e => {
                        const val = e.target.value;
                        if (val.includes('<iframe') && val.includes('src="')) {
                          const match = val.match(/src="([^"]+)"/);
                          if (match) {
                            setNewProject({...newProject, heygen_url: match[1]});
                            return;
                          }
                        }
                        setNewProject({...newProject, heygen_url: val});
                      }}
                      className="rounded-lg bg-muted/5 border-border/40 focus:bg-background transition-all"
                    />
                    <p className="text-[9px] text-muted-foreground opacity-60">Tip: You can paste the whole iframe code and we'll extract the URL.</p>
                  </div>
                )}
              </div>

              <SheetFooter className="pt-4">
                <Button type="submit" className="w-full rounded-full uppercase tracking-widest text-[11px] font-bold">Create Project</Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        {/* Edit Project Sheet */}
        <Sheet open={!!editingProject} onOpenChange={(val) => !val && setEditingProject(null)}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit Project</SheetTitle>
            </SheetHeader>
            {editingProject && (
              <form onSubmit={handleUpdateProject} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Project Name</label>
                  <Input 
                    value={editingProject.name} 
                    onChange={e => setEditingProject({...editingProject, name: e.target.value})}
                    required
                    className="rounded-lg bg-muted/5 border-border/40 focus:bg-background transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Client</label>
                  <select 
                    className="flex h-10 w-full rounded-lg border border-border/40 bg-muted/5 px-3 py-2 text-sm ring-offset-background focus:bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-all"
                    value={editingProject.client}
                    onChange={e => setEditingProject({...editingProject, client: e.target.value})}
                    required
                  >
                    {clients?.map(client => (
                      <option key={client.id} value={client.name}>{client.name}</option>
                    ))}
                    {editingProject.client && !clients.some(c => c.name === editingProject.client) && (
                      <option value={editingProject.client}>{editingProject.client} (Legacy)</option>
                    )}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Assigned Editors (select to toggle)</label>
                  <Input 
                    value={editingProject.editor} 
                    onChange={e => setEditingProject({...editingProject, editor: e.target.value})}
                    placeholder="e.g. LIZA M. / SARAH T."
                    required
                    className="rounded-lg bg-muted/5 border-border/40 focus:bg-background transition-all"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editors?.map(editor => (
                      <button
                        key={editor.id}
                        type="button"
                        onClick={() => {
                          const currentEditors = editingProject.editor ? editingProject.editor.split('/').map((s: string) => s.trim()) : [];
                          if (currentEditors.includes(editor.name)) {
                            setEditingProject({
                              ...editingProject,
                              editor: currentEditors.filter((s: string) => s !== editor.name).join(' / ')
                            });
                          } else {
                            setEditingProject({
                              ...editingProject,
                              editor: [...currentEditors, editor.name].filter(Boolean).join(' / ')
                            });
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                          editingProject.editor?.includes(editor.name)
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-muted/10 text-muted-foreground border-border/40 hover:bg-muted/20'
                        }`}
                      >
                        {editor.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Current Phase</label>
                  <Input 
                    value={editingProject.phase} 
                    onChange={e => setEditingProject({...editingProject, phase: e.target.value})}
                    required
                    className="rounded-lg bg-muted/5 border-border/40 focus:bg-background transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Due Date</label>
                  <Input 
                    value={editingProject.due} 
                    onChange={e => setEditingProject({...editingProject, due: e.target.value})}
                    required
                    className="rounded-lg bg-muted/5 border-border/40 focus:bg-background transition-all"
                  />
                </div>
                <div className="space-y-4 pt-2 border-t border-border/20">
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Video Source</label>
                    <div className="flex p-1 bg-muted/10 rounded-lg border border-border/20">
                      <button 
                        type="button"
                        className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all ${editingProject.video_type === 'upload' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => setEditingProject({...editingProject, video_type: 'upload'})}
                      >
                        UPLOAD
                      </button>
                      <button 
                        type="button"
                        className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all ${editingProject.video_type === 'heygen' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => setEditingProject({...editingProject, video_type: 'heygen'})}
                      >
                        HEYGEN
                      </button>
                    </div>
                  </div>

                  {editingProject.video_type === 'heygen' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                      <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">HeyGen Embed Code / URL</label>
                      <Input 
                        placeholder="Paste iframe code or URL here" 
                        value={editingProject.heygen_url || ''} 
                        onChange={e => {
                          const val = e.target.value;
                          if (val.includes('<iframe') && val.includes('src="')) {
                            const match = val.match(/src="([^"]+)"/);
                            if (match) {
                              setEditingProject({...editingProject, heygen_url: match[1]});
                              return;
                            }
                          }
                          setEditingProject({...editingProject, heygen_url: val});
                        }}
                        className="rounded-lg bg-muted/5 border-border/40 focus:bg-background transition-all"
                      />
                    </div>
                  )}
                </div>

                <SheetFooter className="pt-4">
                  <Button type="submit" className="w-full rounded-full uppercase tracking-widest text-[11px] font-bold">Save Changes</Button>
                </SheetFooter>
              </form>
            )}
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-4 mt-6">
        {localProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden border-border/40 bg-card hover:translate-y-[-2px] transition-all rounded-2xl">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 gap-4">
                <div className="flex items-center gap-5 flex-1 w-full">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-colors ${project.name.toLowerCase().includes('greg') ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-background border border-border/10 opacity-60'}`}>
                    <FolderKanban className={`h-4 w-4 ${project.name.toLowerCase().includes('greg') ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-base tracking-tight">{project.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-[9px] text-muted-foreground font-semibold uppercase tracking-wider opacity-60">
                      <span>{project.client}</span>
                      <span className="opacity-30">/</span>
                      <span className="flex items-center gap-1.5">{project.editor}</span>
                      <span className="opacity-30">/</span>
                      <span className="flex items-center gap-1.5 uppercase tabular-nums tracking-widest">{project.due}</span>
                    </div>
                  </div>
                </div>
                  <div className="flex flex-col sm:items-end gap-1 shrink-0">
                    <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-[0.12em]">{project.phase}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        project.status === 'On Track' ? 'bg-emerald-500' :
                        project.status === 'Pending Review' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className="text-[10px] font-semibold text-foreground opacity-80">{project.status}</span>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingProject(project)}>
                        <Pencil className="h-3.5 w-3.5 mr-2" /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(project.id, 'On Track')}>
                        Mark On Track
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(project.id, 'Pending Review')}>
                        Mark Pending Review
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(project.id, 'At Risk')}>
                        Mark At Risk
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(project.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
