import { useState } from "react";
import { Plus, Pencil, Trash2, Tag, Info, DollarSign, Building2 } from "lucide-react";
import { useServices, useCreateService, useUpdateService, useDeleteService } from "@/hooks/use-services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { type InsertService, type Service } from "@shared/schema";

export function AdminServices() {
  const { data: services, isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<InsertService>({
    title: "",
    description: "",
    price: "",
    icon: "FileText",
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createService.mutateAsync(formData);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    await updateService.mutateAsync({ id: editingService.id, ...formData });
    setEditingService(null);
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", price: "", icon: "FileText" });
  };

  const openEdit = (service: Service) => {
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price || "",
      icon: service.icon || "FileText",
    });
    setEditingService(service);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Manage Services</h1>
          <p className="text-muted-foreground mt-1">Add, update, or remove the services displayed on the public site.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if(!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/20 gap-2">
              <Plus className="w-4 h-4" /> Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <form onSubmit={handleCreateSubmit}>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Create New Service</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2"><Tag className="w-4 h-4 text-primary" /> Service Title</Label>
                  <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="rounded-xl" placeholder="e.g. Business Name Registration" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-primary" /> Price / Fee</Label>
                  <Input id="price" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} className="rounded-xl" placeholder="e.g. ₦20,000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon" className="flex items-center gap-2">Icon (Lucide Name)</Label>
                  <Input id="icon" value={formData.icon || ''} onChange={e => setFormData({...formData, icon: e.target.value})} className="rounded-xl" placeholder="e.g. Building, FileText, Shield" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-2"><Info className="w-4 h-4 text-primary" /> Description</Label>
                  <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="min-h-[100px] rounded-xl" placeholder="Describe what the service includes..." />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createService.isPending} className="rounded-xl w-full sm:w-auto">
                  {createService.isPending ? "Creating..." : "Save Service"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingService} onOpenChange={(open) => !open && setEditingService(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Edit Service</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Service Title</Label>
                <Input id="edit-title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price / Fee</Label>
                <Input id="edit-price" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-icon">Icon Name</Label>
                <Input id="edit-icon" value={formData.icon || ''} onChange={e => setFormData({...formData, icon: e.target.value})} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="min-h-[100px] rounded-xl" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateService.isPending} className="rounded-xl w-full sm:w-auto">
                {updateService.isPending ? "Updating..." : "Update Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Loading services...</div>
        ) : !services?.length ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold font-display text-foreground">No services found</h3>
            <p className="text-muted-foreground mb-4">You haven't added any services yet.</p>
            <Button variant="outline" onClick={() => setIsCreateOpen(true)} className="rounded-xl">Create Your First Service</Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {services.map((service) => (
              <div key={service.id} className="p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center hover:bg-muted/30 transition-colors">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground font-display">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{service.description}</p>
                  <div className="mt-3 inline-flex px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-semibold">
                    {service.price || 'Price not set'}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <Button variant="outline" size="sm" onClick={() => openEdit(service)} className="flex-1 sm:flex-none rounded-lg gap-2">
                    <Pencil className="w-4 h-4" /> Edit
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="flex-1 sm:flex-none rounded-lg gap-2">
                        <Trash2 className="w-4 h-4" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{service.title}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This service will be permanently removed from your website.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteService.mutate(service.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                        >
                          {deleteService.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
