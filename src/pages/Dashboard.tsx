import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // SEO basics
    document.title = "Dashboard – Laatste prompt | Innosales";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Bekijk je laatste ingevoerde prompt in het Innosales dashboard.";

    // Canonical tag
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = `${window.location.origin}/dashboard`;
  }, []);

  useEffect(() => {
    const pending = sessionStorage.getItem("pendingPrompt");
    if (pending) {
      setLastPrompt(pending);
      sessionStorage.removeItem("pendingPrompt");
    }
  }, []);

  const hasPrompt = useMemo(() => Boolean(lastPrompt && lastPrompt.trim().length > 0), [lastPrompt]);

  useEffect(() => {
    console.info("dashboard_loaded", { hasPrompt });
  }, [hasPrompt]);

  const handleEdit = () => {
    if (lastPrompt) {
      sessionStorage.setItem("pendingPrompt", lastPrompt);
    }
    navigate("/");
  };

  return (
    <main>
      <section className="container mx-auto max-w-3xl px-4 sm:px-6 py-10 md:py-12">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6">Laatste ingevoerde prompt</h1>

        {hasPrompt ? (
          <Card as-child>
            <article>
              <CardHeader>
                <CardTitle className="text-base text-muted-foreground">Alleen-lezen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border bg-muted/20 p-4 whitespace-pre-wrap text-sm md:text-base">
                  {lastPrompt}
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button variant="secondary" onClick={handleEdit}>Bewerk prompt</Button>
                  <Button disabled aria-disabled className="opacity-60 cursor-not-allowed">Ga verder</Button>
                </div>
              </CardContent>
            </article>
          </Card>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-6">Er is nog geen prompt beschikbaar.</p>
            <Button onClick={() => navigate("/")}>Nieuwe prompt invullen</Button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
