import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Loader2, Mail, Lock, LogIn, UserPlus, Chrome, Square } from "lucide-react";

interface AuthGateProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthGate({ open, onClose, onSuccess }: AuthGateProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = `${window.location.origin}/dashboard`;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      cleanupAuthState();
      try { await supabase.auth.signOut({ scope: "global" }); } catch {}
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        console.info("auth_success");
        onSuccess();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo }
        });
        if (error) throw error;
        console.info("auth_success");
        onSuccess();
      }
    } catch (err: any) {
      setError(err?.message ?? "Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  const oauth = async (provider: "google" | "azure") => {
    setLoading(true);
    setError(null);
    try {
      cleanupAuthState();
      try { await supabase.auth.signOut({ scope: "global" }); } catch {}
      const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
      if (error) throw error;
      // Redirect will occur; dashboard will log telemetry
    } catch (err: any) {
      setError(err?.message ?? "OAuth fout. Probeer het opnieuw.");
      setLoading(false);
    }
  };

  const onCancel = () => {
    console.info("auth_cancel");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel(); }}>
      <DialogContent aria-modal="true" role="dialog" className="max-w-md glass-panel">
        <DialogHeader>
          <DialogTitle>Log in of maak een account om door te gaan</DialogTitle>
          <DialogDescription>
            We bewaren je prompt veilig, je kunt hem zo verder gebruiken.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 rounded-lg border p-1 bg-background">
          <button
            type="button"
            className={cn("flex-1 py-2 text-sm rounded-md", mode === "signin" ? "bg-secondary" : "")}
            onClick={() => setMode("signin")}
          >
            Inloggen
          </button>
          <button
            type="button"
            className={cn("flex-1 py-2 text-sm rounded-md", mode === "signup" ? "bg-secondary" : "")}
            onClick={() => setMode("signup")}
          >
            Account maken
          </button>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="E-mailadres"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-9"
              aria-label="E-mailadres"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Wachtwoord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="pl-9"
              aria-label="Wachtwoord"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert" aria-live="assertive">{error}</p>
          )}

          <Button type="submit" className="w-full bg-[hsl(var(--gold))] text-white" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "signin" ? "Bezig met inloggen…" : "Account aanmaken…"}
              </>
            ) : (
              <>
                {mode === "signin" ? <LogIn className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                {mode === "signin" ? "Inloggen" : "Account maken"}
              </>
            )}
          </Button>
        </form>

        <div className="my-1"><Separator /></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => oauth("google")} disabled={loading}>
            <Chrome className="mr-2 h-4 w-4" /> Google
          </Button>
          <Button variant="outline" onClick={() => oauth("azure")} disabled={loading}>
            <Square className="mr-2 h-4 w-4" /> Microsoft
          </Button>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="ghost" onClick={onCancel} type="button">Annuleren</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
