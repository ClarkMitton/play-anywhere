// Touch Screen 2 — /screen/2 — same join flow as Screen 1, role="screen2".
import { createFileRoute } from "@tanstack/react-router";
import { ScreenJoin } from "./screen.1";

export const Route = createFileRoute("/screen/2")({
  head: () => ({ meta: [
    { title: "Touch Screen 2 · Immersive Learning" },
    { name: "description", content: "Join and take part in Bradford College lessons on student screen two." },
    { property: "og:title", content: "Touch Screen 2 · Immersive Learning" },
    { property: "og:description", content: "Join and take part in Bradford College lessons on student screen two." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === "string" ? search.code : undefined,
  }),
  component: () => {
    const { code } = Route.useSearch();
    return <ScreenJoin role="screen2" autoCode={code} />;
  },
});
