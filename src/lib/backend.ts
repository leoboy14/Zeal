import { supabase } from './supabase';

export interface Comment {
  id: string;
  project_id: string;
  author_name: string;
  author_initials: string;
  author_avatar?: string;
  text: string;
  timestamp_seconds: number;
  thread_number: number;
  is_public: boolean;
  version_number: number;
  is_done: boolean;
  created_at?: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  video_url: string;
  thumbnail_url: string;
  phase: string;
  editor: string;
  due: string;
  status: string;
  current_version: number;
  video_versions: { version: number; url: string; created_at: string; label?: string }[];
  video_type?: 'upload' | 'heygen';
  heygen_url?: string;
}

export const backend = {
  uploadVideo: async (file: File) => {
    return URL.createObjectURL(file); 
  },
  
  getProjects: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<void> => {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
  },

  createProject: async (project: Omit<Project, 'id' | 'created_at'>): Promise<Project> => {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteProject: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  getEditors: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('editors')
      .select('*, projects(name)')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data.map(editor => ({
      ...editor,
      currentProject: editor.projects?.name || 'None'
    })) || [];
  },

  updateEditor: async (id: string, updates: Partial<any>): Promise<void> => {
    const { error } = await supabase
      .from('editors')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
  },

  createEditor: async (editor: { name: string; role: string; status: string }): Promise<any> => {
    const { data, error } = await supabase
      .from('editors')
      .insert([{ name: editor.name, role: editor.role, status: editor.status }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  getClients: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  createClient: async (client: { name: string; email?: string }): Promise<any> => {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateClient: async (id: string, updates: Partial<any>): Promise<void> => {
    const { error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
  },

  deleteClient: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  deleteEditor: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('editors')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  getDashboardStats: async (): Promise<any> => {
    const { data: projects, error: pError } = await supabase.from('projects').select('status, created_at');
    const { data: editors, error: eError } = await supabase.from('editors').select('status');

    if (pError || eError) throw pError || eError;

    const activeProjects = projects.filter(p => p.status !== 'Completed').length;
    const editorsOnline = editors.filter(e => e.status === 'Online').length;
    const pendingReviews = projects.filter(p => p.status === 'Pending Review').length;
    
    // Delivered this week (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const deliveredThisWeek = projects.filter(p => 
      p.status === 'Completed' || 
      (p.status === 'On Track' && new Date(p.created_at) > sevenDaysAgo) // Mocking delivered as recent active for demo if no completed
    ).length;

    return {
      activeProjects,
      editorsOnline,
      pendingReviews,
      deliveredThisWeek
    };
  },

  getComments: async (projectId: string, version?: number): Promise<Comment[]> => {
    let query = supabase
      .from('comments')
      .select('*')
      .eq('project_id', projectId);
    
    if (version !== undefined) {
      query = query.eq('version_number', version);
    }
    
    const { data, error } = await query.order('timestamp_seconds', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  addComment: async (comment: Omit<Comment, 'id' | 'created_at'>): Promise<Comment> => {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ ...comment, is_done: comment.is_done ?? false }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  updateComment: async (id: string, updates: Partial<Comment>): Promise<void> => {
    const { error } = await supabase
      .from('comments')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
  },

  deleteComment: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  getSettings: async (): Promise<any> => {
    const { data, error } = await supabase
      .from('settings')
      .select('data')
      .eq('id', 'app_config')
      .single();
    if (error) throw error;
    return data.data;
  },

  updateSettings: async (settings: any): Promise<void> => {
    const { error } = await supabase
      .from('settings')
      .update({ data: settings, updated_at: new Date().toISOString() })
      .eq('id', 'app_config');
    if (error) throw error;
  }
};
