import { useState } from "react";
import { Plus, Pencil, Trash2, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";
import { usePosts, useCreatePost, useUpdatePost, useDeletePost } from "@/hooks/use-posts";
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
import { type InsertPost, type Post } from "@shared/schema";

export function AdminPosts() {
  const { data: posts, isLoading } = usePosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  const [formData, setFormData] = useState<InsertPost>({
    title: "",
    content: "",
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPost.mutateAsync(formData);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    await updatePost.mutateAsync({ id: editingPost.id, ...formData });
    setEditingPost(null);
  };

  const resetForm = () => {
    setFormData({ title: "", content: "" });
  };

  const openEdit = (post: Post) => {
    setFormData({
      title: post.title,
      content: post.content,
    });
    setEditingPost(post);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Blog & Updates</h1>
          <p className="text-muted-foreground mt-1">Publish news, regulatory updates, and helpful articles.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if(!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/20 gap-2">
              <Plus className="w-4 h-4" /> Compose Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl">
            <form onSubmit={handleCreateSubmit}>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Create New Post</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-semibold">Article Title</Label>
                  <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="rounded-xl text-lg h-12" placeholder="e.g. New CAC Requirements for 2024" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="font-semibold">Article Content</Label>
                  <Textarea id="content" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required className="min-h-[300px] rounded-xl font-sans" placeholder="Write your article content here..." />
                  <p className="text-xs text-muted-foreground">Line breaks will be preserved on the public site.</p>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createPost.isPending} className="rounded-xl w-full sm:w-auto">
                  {createPost.isPending ? "Publishing..." : "Publish Article"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Edit Post</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="font-semibold">Article Title</Label>
                <Input id="edit-title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="rounded-xl text-lg h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content" className="font-semibold">Content</Label>
                <Textarea id="edit-content" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required className="min-h-[300px] rounded-xl font-sans" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updatePost.isPending} className="rounded-xl w-full sm:w-auto">
                {updatePost.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Loading articles...</div>
        ) : !posts?.length ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold font-display text-foreground">No posts found</h3>
            <p className="text-muted-foreground mb-4">Start sharing updates with your clients.</p>
            <Button variant="outline" onClick={() => setIsCreateOpen(true)} className="rounded-xl">Write Your First Post</Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <div key={post.id} className="p-6 flex flex-col sm:flex-row gap-6 justify-between items-start hover:bg-muted/30 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs font-medium text-primary mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.publishedAt ? format(new Date(post.publishedAt), 'MMM dd, yyyy') : 'Draft'}
                  </div>
                  <h3 className="font-bold text-xl text-foreground font-display leading-tight mb-2">{post.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{post.content}</p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                  <Button variant="outline" size="sm" onClick={() => openEdit(post)} className="flex-1 sm:flex-none rounded-lg gap-2">
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
                        <AlertDialogTitle>Delete Article?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this article from your blog.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deletePost.mutate(post.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                        >
                          {deletePost.isPending ? "Deleting..." : "Delete"}
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
