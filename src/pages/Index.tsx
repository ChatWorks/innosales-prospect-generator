import HeroPrompt from "@/components/HeroPrompt";
import Header from "@/components/Header";

const Index = () => {
  return (
    <main className="relative min-h-screen grid place-items-center bg-background overflow-hidden">
      {/* Full-screen dotted background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--dot)) 2px, transparent 2px)",
          backgroundSize: "24px 24px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      {/* Subtle animated golden gradient overlay */}
      <div aria-hidden="true" className="ambient-gold" />
      <Header />
      <div className="relative z-10">
        <HeroPrompt />
      </div>
    </main>
  );
};

export default Index;
