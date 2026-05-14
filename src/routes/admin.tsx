// Admin panel — placeholder until Step 7 of the build order.
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Immersive Learning" }] }),
  component: () => (
    <div className="min-h-screen bg-immersive bg-grid flex items-center justify-center p-8">
      <div className="text-center max-w-lg animate-slot-in">
        <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--orange)] mb-3">Admin</div>
        <h1 className="text-5xl font-extrabold text-glow mb-4">Coming next</h1>
        <p className="text-muted-foreground mb-8">PIN entry, lesson library, stage designer, and data tab land in the next step once we've confirmed three-screen sync.</p>
        <Link to="/" className="underline text-[color:var(--cyan)]">Back to launcher</Link>
      </div>
    </div>
  ),
});
