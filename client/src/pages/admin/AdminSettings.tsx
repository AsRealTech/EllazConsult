import { useState, useEffect } from "react";
import { Save, Phone, Mail, MapPin, Key } from "lucide-react";
import { useSettingsMap, useUpdateSettingsBulk } from "@/hooks/use-settings";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { authFetch } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";

export function AdminSettings() {
  const { settings, isLoading } = useSettingsMap();
  const updateSettings = useUpdateSettingsBulk();
  
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
  });

  const { user } = useAuth();
  const { toast } = useToast();

  const [adminForm, setAdminForm] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setAdminForm((s) => ({ ...s, email: user.email || "", username: (user as any).username || "" }));
    }
  }, [user]);

  const updateAdmin = useMutation({
    mutationFn: async (payload: any) => {
      if (!user) throw new Error('Not authenticated');
      const res = await authFetch(`/api/admins/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log(res);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Failed to update admin' }));
        // throw new Error(err.message || 'Failed to update admin');
        toast({ title: 'Error', description: err.message || 'Failed to update admin', variant: 'destructive' });
        return;
        
      }
      return res.json();
    },
    onSuccess: () => toast({ title: 'Success', description: 'Account updated' }),
    onError: (err: any) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  // Sync form data when settings arrive (only once)
  const [settingsInitialized, setSettingsInitialized] = useState(false);
  useEffect(() => {
    if (!settingsInitialized && settings && Object.keys(settings).length > 0) {
      setFormData({
        phone: settings.phone || "",
        email: settings.email || "",
        address: settings.address || "",
      });
      setSettingsInitialized(true);
    }
  }, [settings, settingsInitialized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert object back to array of {key, value} for API
    const updates = Object.entries(formData).map(([key, value]) => ({
      key,
      value
    }));
    
    await updateSettings.mutateAsync(updates);
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // validate passwords
    if (adminForm.newPassword) {
      if (adminForm.newPassword !== adminForm.confirmPassword) {
        toast({ title: 'Error', description: 'New passwords do not match', variant: 'destructive' });
        return;
      }
    }

    const payload: any = { username: adminForm.username, email: adminForm.email };
    if (adminForm.newPassword) {
      payload.currentPassword = adminForm.currentPassword;
      payload.newPassword = adminForm.newPassword;
    }

    await updateAdmin.mutateAsync(payload);
    // clear password fields on success
    setAdminForm((s) => ({ ...s, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Site Settings</h1>
        <p className="text-muted-foreground mt-1">Configure global details like contact information displayed on the website.</p>
      </div>

      {isLoading ? (
        <Card className="animate-pulse border-border/50">
          <CardHeader className="h-24 bg-muted/50"></CardHeader>
          <CardContent className="h-64"></CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card className="border-border shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border pb-6">
              <CardTitle className="font-display">Contact Information</CardTitle>
              <CardDescription>This information is displayed in the header and footer of your public website.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="phone" className="flex items-center gap-2 font-semibold">
                  <Phone className="w-4 h-4 text-primary" /> Phone Number
                </Label>
                <Input 
                  id="phone" 
                  type="number"
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  placeholder="+234 800 000 0000"
                  className="max-w-md rounded-xl h-11"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2 font-semibold">
                  <Mail className="w-4 h-4 text-primary" /> Support Email
                </Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  placeholder="support@cac-agent.ng"
                  className="max-w-md rounded-xl h-11"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address" className="flex items-center gap-2 font-semibold">
                  <MapPin className="w-4 h-4 text-primary" /> Physical Address
                </Label>
                <Input 
                  id="address" 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                  placeholder="123 Business Way, Abuja, FCT"
                  className="max-w-full rounded-xl h-11"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t border-border px-6 py-4 flex justify-end">
              <Button 
                type="submit" 
                size="lg"
                disabled={updateSettings.isPending}
                className="rounded-xl shadow-lg shadow-primary/20 gap-2 min-w-[140px]"
              >
                <Save className="w-4 h-4" /> 
                {updateSettings.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}

        {/* Admin Account Card */}
        <div className="mt-8">
          <form onSubmit={handleAdminSubmit}>
            <Card className="border-border shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-muted/20 border-b border-border pb-6">
                <CardTitle className="font-display">Admin Account</CardTitle>
                <CardDescription>Update your admin username, email, or change your password.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="grid gap-2 max-w-md">
                  <Label htmlFor="username" className="font-semibold">Username</Label>
                  <Input id="username" value={adminForm.username} onChange={e => setAdminForm({...adminForm, username: e.target.value})} className="rounded-xl h-11" />
                </div>

                <div className="grid gap-2 max-w-md">
                  <Label htmlFor="admin-email" className="font-semibold">Email</Label>
                  <Input id="admin-email" type="email" value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} className="rounded-xl h-11" />
                </div>

                <div className="grid gap-2 max-w-md">
                  <Label className="font-semibold">Change Password</Label>
                  <Input placeholder="Current password" type="password" value={adminForm.currentPassword} onChange={e => setAdminForm({...adminForm, currentPassword: e.target.value})} className="rounded-xl h-11" />
                  <Input placeholder="New password" type="password" value={adminForm.newPassword} onChange={e => setAdminForm({...adminForm, newPassword: e.target.value})} className="rounded-xl h-11" />
                  <Input placeholder="Confirm new password" type="password" value={adminForm.confirmPassword} onChange={e => setAdminForm({...adminForm, confirmPassword: e.target.value})} className="rounded-xl h-11" />
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 border-t border-border px-6 py-4 flex justify-end">
                <Button type="submit" size="lg" disabled={updateAdmin.isPending} className="rounded-xl shadow-lg shadow-primary/20 gap-2 min-w-[140px]">
                  <Key className="w-4 h-4" /> {updateAdmin.isPending ? 'Saving...' : 'Save Account'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
    </div>
  );
}
