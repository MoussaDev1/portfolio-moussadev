"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin/dashboard";
  const sessionError = searchParams.get("error");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Mot de passe incorrect");
      }

      // Succès : rediriger vers la page demandée
      router.push(redirect);
      router.refresh();
    } catch (err) {
      console.error("Erreur login:", err);
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Admin Login
          </h1>
          <p className="text-foreground/60 mb-6">
            Entrez le mot de passe administrateur
          </p>

          {sessionError === "session_expired" && (
            <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <p className="text-sm text-orange-600 dark:text-orange-400">
                ⚠️ Votre session a expiré. Veuillez vous reconnecter.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                placeholder="••••••••"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <Link
              href="/"
              className="text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              ← Retour au site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
