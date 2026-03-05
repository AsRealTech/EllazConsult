import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Layouts
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";

// Public Pages
import { Home } from "@/pages/public/Home";
import { Services } from "@/pages/public/Services";
import { Contact } from "@/pages/public/Contact";
import { Blog } from "@/pages/public/Blog";
import { BlogPost } from "@/pages/public/BlogPost";
import { LoginPage } from "@/pages/LoginPage";

// Admin Pages
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminServices } from "@/pages/admin/AdminServices";
import { AdminPosts } from "@/pages/admin/AdminPosts";
import { AdminSettings } from "@/pages/admin/AdminSettings";

function Router() {
  return (
    <Switch>
      {/* Public Routes - Wrapped in PublicLayout */}
      <Route path="/">
        {() => <PublicLayout><Home /></PublicLayout>}
      </Route>
      <Route path="/services">
        {() => <PublicLayout><Services /></PublicLayout>}
      </Route>
      <Route path="/contact">
        {() => <PublicLayout><Contact /></PublicLayout>}
      </Route>
      <Route path="/blog">
        {() => <PublicLayout><Blog /></PublicLayout>}
      </Route>
      <Route path="/blog/:id">
        {() => <PublicLayout><BlogPost /></PublicLayout>}
      </Route>

      {/* Login Route */}
      <Route path="/login">
        {() => <LoginPage />}
      </Route>

      {/* Protected Admin Routes - Wrapped in AdminLayout */}
      <Route path="/admin">
        {() => <AdminLayout><AdminDashboard /></AdminLayout>}
      </Route>
      <Route path="/admin/services">
        {() => <AdminLayout><AdminServices /></AdminLayout>}
      </Route>
      <Route path="/admin/posts">
        {() => <AdminLayout><AdminPosts /></AdminLayout>}
      </Route>
      <Route path="/admin/settings">
        {() => <AdminLayout><AdminSettings /></AdminLayout>}
      </Route>

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
