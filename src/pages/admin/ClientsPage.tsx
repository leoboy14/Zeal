import React, { useState } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Card, CardContent } from '../../components/ui/card';
import { Users, Mail, Plus, ExternalLink, FolderKanban, Trash2, MoreVertical, Pencil } from 'lucide-react';
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
  SheetFooter
} from '../../components/ui/sheet';
import { Input } from '../../components/ui/input';
import { backend } from '../../lib/backend';

export default function ClientsPage() {
  const { clients: fetchedClients, projects, loading } = useDashboardData();
  const [localClients, setLocalClients] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [newClient, setNewClient] = useState({ name: '', email: '' });

  React.useEffect(() => {
    if (fetchedClients) setLocalClients(fetchedClients);
  }, [fetchedClients]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    try {
      await backend.deleteClient(id);
      setLocalClients(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete client.');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await backend.createClient(newClient);
      setLocalClients(prev => [...prev, created]);
      setIsAdding(false);
      setNewClient({ name: '', email: '' });
    } catch (error) {
      console.error('Create failed:', error);
      alert('Failed to add client.');
    }
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    try {
      await backend.updateClient(editingClient.id, {
        name: editingClient.name,
        email: editingClient.email
      });
      setLocalClients(prev => prev.map(c => c.id === editingClient.id ? editingClient : c));
      setEditingClient(null);
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update client.');
    }
  };

  if (loading) {
    return <div className="p-8 animate-pulse text-muted-foreground text-sm uppercase tracking-widest">Loading clients...</div>;
  }

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-8 pt-0">
      <div className="flex items-center justify-end">
        <Sheet open={isAdding} onOpenChange={setIsAdding}>
          <SheetTrigger asChild>
            <Button variant="outline" className="rounded-full px-5 h-9 text-[11px] font-medium uppercase tracking-[0.1em] border-border/60">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Client
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Client</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-6">
              <div className="space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Client Name</label>
                <Input 
                  placeholder="e.g. John & Jane" 
                  value={newClient.name} 
                  onChange={e => setNewClient({...newClient, name: e.target.value})}
                  required
                  className="rounded-lg bg-muted/5 border-border/40 focus:bg-background transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Email Address</label>
                <Input 
                  type="email"
                  placeholder="e.g. client@example.com" 
                  value={newClient.email} 
                  onChange={e => setNewClient({...newClient, email: e.target.value})}
                  required
                  className="rounded-lg bg-muted/5 border-border/40 focus:bg-background transition-all"
                />
              </div>
              <SheetFooter className="pt-4">
                <Button type="submit" className="w-full rounded-full uppercase tracking-widest text-[11px] font-bold">Create Client</Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
        
        {/* Edit Client Sheet */}
        <Sheet open={!!editingClient} onOpenChange={(open) => !open && setEditingClient(null)}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit Client</SheetTitle>
            </SheetHeader>
            {editingClient && (
              <form onSubmit={handleUpdateClient} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Client Name</label>
                  <Input 
                    value={editingClient.name} 
                    onChange={e => setEditingClient({...editingClient, name: e.target.value})}
                    required
                    className="rounded-lg bg-muted/5 border-border/40 focus:bg-background transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Email Address</label>
                  <Input 
                    type="email"
                    value={editingClient.email || ''} 
                    onChange={e => setEditingClient({...editingClient, email: e.target.value})}
                    required
                    className="rounded-lg bg-muted/5 border-border/40 focus:bg-background transition-all"
                  />
                </div>
                <SheetFooter className="pt-4">
                  <Button type="submit" className="w-full rounded-full uppercase tracking-widest text-[11px] font-bold">Save Changes</Button>
                </SheetFooter>
              </form>
            )}
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {localClients.map((client) => {
          const activeProjectsCount = projects.filter(p => p.client === client.name).length;
          return (
            <Card key={client.id} className="overflow-hidden bg-card border-border/40 hover:translate-y-[-2px] transition-all rounded-2xl">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-background border border-border/10 rounded-xl shrink-0 opacity-60 text-muted-foreground text-xs font-bold">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-lg tracking-tight">{client.name}</h3>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider opacity-60">{activeProjectsCount} Project{activeProjectsCount !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-40 hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingClient(client)}>
                        <Pencil className="h-3.5 w-3.5 mr-2" /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(client.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Client
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-6 pt-5 border-t border-border/10 flex items-center gap-2">
                  <Button variant="ghost" className="w-full h-8 rounded-full text-[10px] font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground">
                    <Mail className="h-3.5 w-3.5 mr-1.5 opacity-60" /> Message
                  </Button>
                  <Button variant="ghost" className="w-full h-8 rounded-full text-[10px] font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground">
                    <FolderKanban className="h-3.5 w-3.5 mr-1.5 opacity-60" /> Assets
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
