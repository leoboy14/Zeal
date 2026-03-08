import React, { useState } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Scissors, Video, Plus, MessageCircle, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../../components/ui/dropdown-menu';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from '../../components/ui/sheet';
import { Input } from '../../components/ui/input';
import { backend } from '../../lib/backend';

export default function EditorsPage() {
  const { editors, projects, loading } = useDashboardData();
  const [localEditors, setLocalEditors] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingEditor, setEditingEditor] = useState<any>(null);
  const [newEditor, setNewEditor] = useState({
    name: '',
    role: '',
    status: 'Online',
    currentProject: 'None'
  });

  React.useEffect(() => {
    if (editors) setLocalEditors(editors);
  }, [editors]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this editor?')) return;
    try {
      await backend.deleteEditor(id);
      setLocalEditors(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete editor.');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await backend.updateEditor(id, { status: newStatus });
      setLocalEditors(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleUpdateEditor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEditor) return;
    try {
      await backend.updateEditor(editingEditor.id, {
        name: editingEditor.name,
        role: editingEditor.role,
        status: editingEditor.status,
        current_project_id: editingEditor.current_project_id
      });
      const projectName = projects.find(p => p.id === editingEditor.current_project_id)?.name || 'None';
      setLocalEditors(prev => prev.map(e => e.id === editingEditor.id ? { ...editingEditor, currentProject: projectName } : e));
      setEditingEditor(null);
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update editor.');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await backend.createEditor({
        name: newEditor.name,
        role: newEditor.role,
        status: newEditor.status
      });
      setLocalEditors(prev => [...prev, { ...created, currentProject: newEditor.currentProject }]);
      setIsAdding(false);
      setNewEditor({ name: '', role: '', status: 'Online', currentProject: 'None' });
    } catch (error) {
      console.error('Create failed:', error);
      alert('Failed to add editor.');
    }
  };

  if (loading) {
    return <div className="p-8 animate-pulse text-muted-foreground text-sm uppercase tracking-widest">Loading editors...</div>;
  }

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-8 pt-0">
      <div className="flex items-center justify-end">
        <Sheet open={isAdding} onOpenChange={setIsAdding}>
          <SheetTrigger asChild>
            <Button variant="outline" className="rounded-full px-5 h-9 text-[11px] font-medium uppercase tracking-[0.1em] border-border/60">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Invite Editor
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Invite New Editor</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-6">
              <div className="space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Full Name</label>
                <Input 
                  placeholder="e.g. Alex Johnson" 
                  value={newEditor.name} 
                  onChange={e => setNewEditor({...newEditor, name: e.target.value})}
                  required
                  className="rounded-lg bg-muted/5 border-border/40 focus:bg-background transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Role</label>
                <Input 
                  placeholder="e.g. Senior Video Editor" 
                  value={newEditor.role} 
                  onChange={e => setNewEditor({...newEditor, role: e.target.value})}
                  required
                  className="rounded-lg bg-muted/5 border-border/40 focus:bg-background transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Initial Assignment</label>
                <select 
                  className="flex h-10 w-full rounded-lg border border-border/40 bg-muted/5 px-3 py-2 text-sm ring-offset-background focus:bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-all"
                  value={newEditor.currentProject}
                  onChange={e => setNewEditor({...newEditor, currentProject: e.target.value})}
                >
                  <option value="None">None</option>
                  {projects?.map((project: any) => (
                    <option key={project.id} value={project.name}>{project.name}</option>
                  ))}
                </select>
              </div>
              <SheetFooter className="pt-4">
                <Button type="submit" className="w-full rounded-full uppercase tracking-widest text-[11px] font-bold">Add Editor</Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-4 mt-6 md:grid-cols-2">
        {localEditors.map((editor) => (
          <Card key={editor.id} className="overflow-hidden bg-card border-border/40 hover:translate-y-[-2px] transition-all rounded-2xl">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 text-xs font-bold transition-colors ${editor.currentProject.toLowerCase().includes('greg') ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-background border border-border/10 opacity-60 text-muted-foreground'}`}>
                    {editor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg tracking-tight">{editor.name}</h3>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider opacity-60">{editor.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-background/50 border border-border/10 rounded-full">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      editor.status === 'Online' ? 'bg-emerald-500' : 
                      editor.status === 'In Meeting' ? 'bg-purple-500' : 
                      'bg-muted-foreground/30'
                    }`}></div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{editor.status}</span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-60 hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingEditor(editor)}>
                        Edit Editor
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(editor.id, 'Online')}>
                        Set Online
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(editor.id, 'In Meeting')}>
                        Set In Meeting
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(editor.id, 'Offline')}>
                        Set Offline
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(editor.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Editor
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Edit Editor Sheet inside loop - slightly inefficient but keeping original structure */}
                  <Sheet open={!!editingEditor} onOpenChange={(open) => !open && setEditingEditor(null)}>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Edit Editor</SheetTitle>
                      </SheetHeader>
                      {editingEditor && (
                        <form onSubmit={handleUpdateEditor} className="space-y-4 mt-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Full Name</label>
                            <Input 
                              value={editingEditor.name} 
                              onChange={e => setEditingEditor({...editingEditor, name: e.target.value})}
                              required
                              className="rounded-lg bg-muted/5 border-border/40 focus:bg-background transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Role</label>
                            <Input 
                              value={editingEditor.role} 
                              onChange={e => setEditingEditor({...editingEditor, role: e.target.value})}
                              required
                              className="rounded-lg bg-muted/5 border-border/40 focus:bg-background transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Current Assignment</label>
                            <select 
                              className="flex h-10 w-full rounded-lg border border-border/40 bg-muted/5 px-3 py-2 text-sm ring-offset-background focus:bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-all"
                              value={editingEditor.current_project_id || 'None'}
                              onChange={e => setEditingEditor({...editingEditor, current_project_id: e.target.value === 'None' ? null : e.target.value})}
                            >
                              <option value="None">None</option>
                              {projects?.map((project: any) => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                              ))}
                            </select>
                          </div>
                          <SheetFooter className="pt-4">
                            <Button type="submit" className="w-full rounded-full uppercase tracking-widest text-[11px] font-bold">Save Changes</Button>
                          </SheetFooter>
                        </form>
                      )}
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-border/10 flex items-center justify-between">
                 <div>
                   <p className="text-[9px] text-muted-foreground uppercase tracking-[0.14em] font-medium opacity-50 mb-1">Current Assignment</p>
                   <p className="text-[13px] flex items-center font-medium tracking-tight">
                     <Video className="h-3.5 w-3.5 mr-2 text-muted-foreground/40" /> 
                     {editor.currentProject}
                   </p>
                 </div>
                 <Button variant="ghost" size="sm" className="h-8 rounded-full text-[10px] font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground px-4">
                   <MessageCircle className="h-3.5 w-3.5 mr-1.5 opacity-60" /> Reach Out
                 </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
