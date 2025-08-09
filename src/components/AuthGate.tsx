import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Loader2, Mail, Lock, LogIn, UserPlus, Apple, Facebook, Chrome, KeyRound, ArrowRight } from "lucide-react";

interface AuthGateProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthGate({ open, onClose, onSuccess }: AuthGateProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const redirectTo = `${window.location.origin}/dashboard`;

  const handleEmailOnlySignIn = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      cleanupAuthState();
      try { await supabase.auth.signOut({ scope: "global" }); } catch {}
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo }
      });
      if (error) throw error;
      setMessage("We hebben je een e-mail gestuurd met een login link.");
    } catch (err: any) {
      setError(err?.message ?? "Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      cleanupAuthState();
      try { await supabase.auth.signOut({ scope: "global" }); } catch {}
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo }
        });
        if (error) throw error;
        onSuccess();
      }
    } catch (err: any) {
      setError(err?.message ?? "Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  const oauth = async (provider: "google" | "facebook" | "apple") => {
    setLoading(true);
    setError(null);
    try {
      cleanupAuthState();
      try { await supabase.auth.signOut({ scope: "global" }); } catch {}
      const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
      if (error) throw error;
      // Redirect will occur
    } catch (err: any) {
      setError(err?.message ?? "OAuth fout. Probeer het opnieuw.");
      setLoading(false);
    }
  };

  const tryPasskey = async () => {
    setLoading(true);
    setError(null);
    try {
      if ((supabase.auth as any).signInWithPasskey) {
        const { error } = await (supabase.auth as any).signInWithPasskey();
        if (error) throw error;
      } else {
        console.info("passkey_click");
      }
    } catch (err: any) {
      setError(err?.message ?? "Passkey inloggen is niet beschikbaar.");
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    console.info("auth_cancel");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel(); }}>
      <DialogContent aria-modal="true" role="dialog" className={cn(
        "max-w-[420px] rounded-3xl border bg-white text-foreground",
        "shadow-[0_10px_40px_rgba(0,0,0,0.12)] p-0 overflow-hidden"
      )}>
        <DialogTitle className="sr-only">Inloggen</DialogTitle>
        <DialogDescription className="sr-only">Meld je aan om door te gaan naar Innosales</DialogDescription>
        {/* Header area to match screenshot */}
        <div className="px-6 pt-6">
          <h2 className="text-2xl font-semibold leading-tight">Inloggen</h2>
          <p className="mt-1 text-sm text-muted-foreground">Doorgaan naar Innosales</p>
        </div>

        {/* Body */}
        {mode === "signin" ? (
          <form onSubmit={(e) => { if (password.trim().length > 0) { void handleEmailPassword(e); } else { void handleEmailOnlySignIn(e); } }} className="px-6 mt-5">
            <label htmlFor="email" className="block text-sm mb-2">E-mail</label>
            <Input
              id="email"
              type="email"
              placeholder="naam@bedrijf.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (mode === "signin") setShowPassword(e.target.value.length > 0); }}
              required
              aria-label="E-mailadres"
              className="h-11"
            />

            {showPassword && (
              <>
                <label htmlFor="password" className="block text-sm mb-2 mt-3">Wachtwoord</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Wachtwoord"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label="Wachtwoord"
                  className="h-11"
                />
              </>
            )}

            <Button type="submit" className="mt-3 w-full rounded-md h-11 bg-foreground text-background shadow-[0_3px_0_rgba(0,0,0,0.35)] hover:opacity-95" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {password.trim().length > 0 ? "Inloggen" : "Doorgaan met e-mail"}
                </>
              ) : (
                <>{password.trim().length > 0 ? "Inloggen" : "Doorgaan met e-mail"}</>
              )}
            </Button>

            <button type="button" onClick={tryPasskey} className="mt-4 w-full inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <KeyRound className="h-4 w-4" /> Inloggen met passkey
            </button>

            <div className="my-5 flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span>of</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button type="button" variant="secondary" className="h-11 bg-muted text-foreground hover:bg-muted" onClick={() => oauth("apple")} disabled={loading} aria-label="Log in met Apple">
                <Apple className="h-5 w-5" />
              </Button>
              <Button type="button" variant="secondary" className="h-11 bg-muted text-foreground hover:bg-muted" onClick={() => oauth("facebook")} disabled={loading} aria-label="Log in met Facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button type="button" variant="secondary" className="h-11 bg-muted text-foreground hover:bg-muted" onClick={() => oauth("google")} disabled={loading} aria-label="Log in met Google">
                <Chrome className="h-5 w-5" />
              </Button>
            </div>

            {message && (
              <p className="mt-4 text-sm text-muted-foreground" role="status" aria-live="polite">{message}</p>
            )}
            {error && (
              <p className="mt-2 text-sm text-destructive" role="alert" aria-live="assertive">{error}</p>
            )}

            <div className="mt-8 mb-6 text-sm">
              <span className="text-muted-foreground">Nieuw bij Innosales? </span>
              <button type="button" onClick={() => setMode("signup")} className="inline-flex items-center gap-1 font-medium text-[hsl(var(--gold))] hover:opacity-90">
                Aan de slag <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleEmailPassword} className="px-6 mt-5">
            <h3 className="text-lg font-medium mb-4">Account maken</h3>
            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="E-mailadres"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9 h-11"
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
                  className="pl-9 h-11"
                  aria-label="Wachtwoord"
                />
              </div>
            </div>

            {error && (
              <p className="mt-3 text-sm text-destructive" role="alert" aria-live="assertive">{error}</p>
            )}

            <Button type="submit" className="mt-4 w-full h-11 bg-[hsl(var(--gold))] text-white" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Account aanmaken
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Account aanmaken
                </>
              )}
            </Button>

            <div className="mt-6 mb-6 text-sm">
              <span className="text-muted-foreground">Al een account? </span>
              <button type="button" onClick={() => setMode("signin")} className="inline-flex items-center gap-1 font-medium text-foreground hover:opacity-80">
                Inloggen <LogIn className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        )}

        <div className="px-6 pb-5">
          <Separator />
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <button className="hover:text-foreground" type="button">Help</button>
            <button className="hover:text-foreground" type="button">Privacy</button>
            <button className="hover:text-foreground" type="button">Voorwaarden</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
