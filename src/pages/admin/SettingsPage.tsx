import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { backend } from '../../lib/backend';
import { Save, Globe, Palette, Bell, Shield, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await backend.getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await backend.updateSettings(settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 animate-pulse text-muted-foreground text-sm uppercase tracking-widest">Loading settings...</div>;
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-0 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light tracking-tight">Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your application configuration and preferences.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="rounded-full px-6 uppercase tracking-widest text-[11px] font-bold"
        >
          {saving ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : <Save className="h-3 w-3 mr-2" />}
          Save Configuration
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card border-border/40 rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-primary opacity-60">
              <Globe className="h-4 w-4" />
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em]">General</CardTitle>
            </div>
            <CardDescription className="text-xs">Basic application identity and branding.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Site Name</label>
              <Input 
                value={settings?.site_name || ''} 
                onChange={e => setSettings({...settings, site_name: e.target.value})}
                className="rounded-lg bg-background border-border/40 focus:ring-1 focus:ring-primary/20 transition-all max-w-md"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/40 rounded-2xl opacity-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-primary opacity-60">
              <Palette className="h-4 w-4" />
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em]">Appearance</CardTitle>
            </div>
            <CardDescription className="text-xs">Customize the look and feel (Coming soon).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-[10px] font-medium uppercase tracking-wider opacity-60">Accent Color</label>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black border border-white/20 shadow-sm" />
                <Input 
                  value={settings?.primary_color || '#000000'} 
                  disabled
                  className="rounded-lg bg-background border-border/40 max-w-[120px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/40 rounded-2xl opacity-50">
          <CardHeader className="pb-3">
             <div className="flex items-center gap-2 text-primary opacity-60">
              <Bell className="h-4 w-4" />
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em]">Notifications</CardTitle>
            </div>
            <CardDescription className="text-xs">Configure email and push alerts (Coming soon).</CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-card border-border/40 rounded-2xl opacity-50">
          <CardHeader className="pb-3">
             <div className="flex items-center gap-2 text-primary opacity-60">
              <Shield className="h-4 w-4" />
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em]">Security</CardTitle>
            </div>
            <CardDescription className="text-xs">Access control and audit logs (Coming soon).</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
