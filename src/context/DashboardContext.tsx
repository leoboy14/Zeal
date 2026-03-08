import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { backend } from '../lib/backend';

interface DashboardContextType {
  stats: any;
  projects: any[];
  editors: any[];
  clients: any[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      activeProjects: 0,
      editorsOnline: 0,
      pendingReviews: 0,
      deliveredThisWeek: 0,
    },
    projects: [] as any[],
    editors: [] as any[],
    clients: [] as any[]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stats, projects, editors, clients] = await Promise.all([
        backend.getDashboardStats(),
        backend.getProjects(),
        backend.getEditors(),
        backend.getClients()
      ]);
      
      setData({ stats, projects, editors, clients });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardContext.Provider value={{ ...data, loading, refresh: fetchData }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
