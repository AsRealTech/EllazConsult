import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./auth_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";
import bcrypt from "bcrypt";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // // Setup Database-driven JWT Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // === Services API ===
  app.get(api.services.list.path, async (req, res) => {
    const result = await storage.getServices();
    res.status(200).json(result);
  });

  app.get(api.services.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const result = await storage.getService(id);
    if (!result) return res.status(404).json({ message: "Service not found" });
    res.status(200).json(result);
  });

  app.post(api.services.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.services.create.input.parse(req.body);
      const result = await storage.createService(input);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.services.update.path, isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const input = api.services.update.input.parse(req.body);
      const result = await storage.updateService(id, input);
      if (!result) return res.status(404).json({ message: "Service not found" });
      res.status(200).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.services.delete.path, isAuthenticated, async (req, res) => {
    let idS = req.params.id;
    const id = parseInt(idS);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const success = await storage.deleteService(id);
    if (!success) return res.status(404).json({ message: "Service not found" });
    res.status(204).end();
  });

  // === Posts API ===
  app.get(api.posts.list.path, async (req, res) => {
    const result = await storage.getPosts();
    res.status(200).json(result);
  });

  app.get(api.posts.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const result = await storage.getPost(id);
    if (!result) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(result);
  });

  app.post(api.posts.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.posts.create.input.parse(req.body);
      const result = await storage.createPost(input);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.posts.update.path, isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const input = api.posts.update.input.parse(req.body);
      const result = await storage.updatePost(id, input);
      if (!result) return res.status(404).json({ message: "Post not found" });
      res.status(200).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.posts.delete.path, isAuthenticated, async (req, res) => {
    let idS = req.params.id;
    const id = parseInt(idS);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const success = await storage.deletePost(id);
    if (!success) return res.status(404).json({ message: "Post not found" });
    res.status(204).end();
  });

  // === Site Settings API ===
  app.get(api.settings.list.path, async (req, res) => {
    const result = await storage.getSiteSettings();
    res.status(200).json(result);
  });

  app.put(api.settings.updateBulk.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.settings.updateBulk.input.parse(req.body);
      const result = await storage.updateSiteSettingsBulk(input);
      res.status(200).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === Admin Update API (update profile / change password) ===
  app.put('/api/admins/:id', isAuthenticated, async (req, res) => {
    // console.log('[admin update] hit route', req.params.id, req.body); // debug
    try {
      const id = parseInt(req.params.id);
      // console.log('[admin update] parsed id', id);
      if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

      // only allow admins to update their own profile
      if ((req as any).user?.id !== id) {
        console.log('[admin update] forbidden user', (req as any).user?.id);
        return res.status(403).json({ message: 'Forbidden' });
      }

      const { username, email, currentPassword, newPassword } = req.body as any;

      // If changing password, verify current password
      if (newPassword) {
        console.log('[admin update] updating simple');
        const existing = await storage.getAdmin(id);
        if (!existing) return res.status(404).json({ message: 'Admin not found' });
        const ok = await bcrypt.compare(currentPassword || '', existing.passwordHash);
        if (!ok) return res.status(401).json({ message: 'Current password is incorrect' }); 
        const passwordHash = bcrypt.hashSync(newPassword, 12);
        const updated = await storage.updateAdmin(id, { username, email, passwordHash } as any);
        if (!updated) return res.status(404).json({ message: 'Admin not found' });
        return res.status(200).json({ id: updated.id, email: updated.email, username: updated.username });
      }

      // Otherwise update non-sensitive fields
      const updated = await storage.updateAdmin(id, { username, email } as any);
      if (!updated) return res.status(404).json({ message: 'Admin not found' });
      return res.status(200).json({ id: updated.id, email: updated.email, username: updated.username });
    } catch (err) {
      console.error('Admin update error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Seed Data
  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  if (process.env.BOOTSRAP_SERVICES === "false") {

    console.log("BOOTSRAP_SERVICES is set to false, skipping database seeding");
     return; // Skip seeding in production
  }

  const existingServices = await storage.getServices();
  if (existingServices.length === 0) {
    await storage.getAdmin(1).then(admin => {
      if (!admin) {
        storage.createAdmin({
          username: "admin",
          email: "admin@cac.com",
          passwordHash: bcrypt.hashSync("admin123", 12),
        });
      }
    });
    await storage.createService({
      title: "Business Name Registration",
      description: "Quick and seamless business name registration with the Corporate Affairs Commission.",
      price: "₦25,000",
      icon: "building",
    });
    await storage.createService({
      title: "Company Incorporation (Ltd)",
      description: "Complete incorporation of private limited liability companies in Nigeria.",
      price: "₦55,000",
      icon: "briefcase",
    });
    await storage.createService({
      title: "NGO & Foundation Setup",
      description: "Registration of Incorporated Trustees for NGOs, Churches, and Foundations.",
      price: "₦120,000",
      icon: "heart-handshake",
    });
  }

  const existingPosts = await storage.getPosts();
  if (existingPosts.length === 0) {
    await storage.createPost({
      title: "Why You Need to Register Your Business in 2024",
      content: "Registering your business is the first step to building a lasting legacy. It provides you with legal protection, access to corporate banking, and makes your business trustworthy to potential clients...",
    });
    await storage.createPost({
      title: "Understanding CAC Annual Returns",
      content: "Filing annual returns is a mandatory requirement for all registered entities in Nigeria. Failure to do so can result in your company being delisted or facing severe penalties...",
    });
  }

  const existingSettings = await storage.getSiteSettings();
  if (existingSettings.length === 0) {
    await storage.updateSiteSettingsBulk([
      { key: "contact_email", value: "info@cacagent.example.com" },
      { key: "contact_phone", value: "+234 800 123 4567" },
      { key: "office_address", value: "123 Business Avenue, Lagos, Nigeria" },
      { key: "hero_title", value: "Expert CAC Registration Services" },
      { key: "hero_subtitle", value: "EllazConsult Your trusted partner for business registration and compliance in Nigeria." },
    ]);
  }

  // console.log("Database seeding completed");
}
