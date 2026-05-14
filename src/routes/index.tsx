import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Immersive Learning · Bradford College" },
      { name: "description", content: "Launcher for immersive lessons across Host and Touch Screens." },
    ],
  }),
  component: Launcher,
});

type Lesson = {
  id: string;
  title: string;
  description: string | null;
  estimated_duration_mins: number;
  featured: boolean;
};

function Launcher() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("lessons")
        .select("id, title, description, estimated_duration_mins, featured")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      const list = (data ?? []) as Lesson[];
      const featured = list.filter((l) => l.featured);
      setLessons(featured.length ? featured : list);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-immersive bg-grid">
      <header className="flex items-center justify-between p-8">
        <div>
          <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--cyan)]">Bradford College</div>
          <h1 className="text-4xl font-extrabold mt-1 text-glow">Immersive Learning</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/host"><Button variant="outline" className="h-12 px-6 uppercase tracking-widest">Open Host</Button></Link>
          <Link to="/admin"><Button variant="outline" className="h-12 px-6 uppercase tracking-widest">Admin</Button></Link>
        </div>
      </header>

      <main className="px-8 pb-16 max-w-6xl mx-auto">
        {loading ? (
          <div className="text-muted-foreground text-center py-24 text-xl">Loading lessons…</div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-24 animate-slot-in">
            <div className="text-3xl font-bold mb-3">No lessons yet</div>
            <div className="text-muted-foreground mb-8">Create one in the Admin panel to get started.</div>
            <Link to="/admin"><Button className="h-14 px-8 text-lg uppercase tracking-widest">Open Admin</Button></Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {lessons.map((l) => (
              <button
                key={l.id}
                onClick={() => navigate({ to: "/host", search: { lesson: l.id } as never })}
                className="text-left bg-card/60 backdrop-blur border border-border hover:border-[color:var(--cyan)] transition-colors rounded-2xl p-6 animate-slot-in"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold">{l.title}</h2>
                    {l.description && <p className="text-muted-foreground mt-2 max-w-2xl">{l.description}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs uppercase tracking-widest text-[color:var(--cyan)]">Duration</div>
                    <div className="text-2xl font-bold">{l.estimated_duration_mins}m</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
