// Touch Screen 2 — /screen/2 — same join flow as Screen 1, role="screen2".
import { createFileRoute } from "@tanstack/react-router";
import { ScreenJoin } from "./screen.1";

export const Route = createFileRoute("/screen/2")({
  head: () => ({ meta: [{ title: "Touch Screen 2 · Immersive Learning" }] }),
  component: () => <ScreenJoin role="screen2" />,
});
