import { supabase } from "@/integrations/supabase/client";
import type { Brief } from "./sessionSchema";

export type TruncatedDoc = { name: string; originalChars: number; usedChars: number };

export type GenerateOk = {
  ok: true;
  data: unknown;
  meta: {
    retried: boolean;
    droppedVideos: number;
    /** Documents the server had to shorten. Empty when everything fitted. */
    truncatedDocs?: TruncatedDoc[];
  };
};

export type GenerateFail = {
  ok: false;
  error: string;
  issues?: string[];
  raw?: string | null;
};

export type GenerateResponse = GenerateOk | GenerateFail;

/**
 * Calls the generate-session edge function. The function returns raw model
 * output; validation and repair happen in sessionRepair.repairAndValidate so
 * the canonical rules live in one place on the client.
 */
export async function generateSession(brief: Brief): Promise<GenerateResponse> {
  const { data, error } = await supabase.functions.invoke("generate-session", {
    body: brief,
  });

  // supabase-js treats any non-2xx as an error, but our function still returns
  // a useful JSON body on 4xx/5xx. Read it rather than showing "Edge Function
  // returned a non-2xx status code", which tells the tutor nothing.
  if (error) {
    const context = (error as { context?: Response }).context;
    if (context && typeof context.json === "function") {
      try {
        const body = (await context.json()) as GenerateFail;
        if (body?.error) return body;
      } catch {
        // fall through to the generic message
      }
    }
    return { ok: false, error: error.message ?? "Generation failed." };
  }

  if (!data || typeof data !== "object") {
    return { ok: false, error: "Generation returned nothing usable." };
  }

  return data as GenerateResponse;
}
