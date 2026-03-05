import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileBadge } from "lucide-react";

export function LoginPage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoggingIn, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    setLocation("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });
      setLocation("/admin");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-transparent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-primary p-3 rounded-xl text-primary-foreground">
            <FileBadge className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-display">
            EllazConsult <span className="text-primary">CAC</span>
          </h1>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-3xl p-8 shadow-lg shadow-black/10 border border-border/50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-display text-foreground mb-2">
              Admin Login
            </h2>
            <p className="text-muted-foreground">
              Enter your credentials to access the admin portal.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoggingIn}
                className="rounded-xl h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoggingIn}
                className="rounded-xl h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoggingIn || !email || !password}
              className="w-full rounded-xl h-11 font-semibold shadow-lg shadow-primary/25 text-base"
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-secondary/50 rounded-xl border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <strong>EllazConsult CAC:</strong> <Link to="/">Back to Main page</Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          © {new Date().getFullYear()} EllazConsult CAC. All rights reserved.
        </p>
      </div>
    </div>
  );
}
