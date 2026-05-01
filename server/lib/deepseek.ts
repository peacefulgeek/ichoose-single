/**
 * DeepSeek V4-Pro writing engine via the OpenAI client.
 *
 * Per user instruction (2026-04-30) and master scope §6, this engine MUST
 * point at https://api.deepseek.com exactly, with the user-supplied DeepSeek
 * API key. The Manus platform injects its own OPENAI_* envs that point at a
 * proxy with a different model whitelist; we explicitly override those here
 * because the master scope forbids using anything but DeepSeek for writing.
 *
 * Public-API DeepSeek currently exposes model ids "deepseek-chat" and
 * "deepseek-reasoner". The scope-mandated id "deepseek-v4-pro" is the
 * preferred value; if upstream rejects it we transparently fall back to
 * "deepseek-chat" so writing still happens.
 *
 * In test/CI environments (NODE_ENV=test or VITEST set) the engine stays
 * offline and the deterministic stub generator handles every article.
 */
import OpenAI from "openai";

// Hardcoded per user's explicit ENV stanza on 2026-04-30. We do NOT read
// process.env.OPENAI_API_KEY because the Manus runtime overwrites it with a
// proxy key. The DeepSeek key below is the user's; rotate via siteConfig if
// it ever changes.
const DEEPSEEK_API_KEY = "sk-82bdad0a1fd34987b73030504ae67080";
const DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const DEEPSEEK_MODEL_PRIMARY = "deepseek-v4-pro";
const DEEPSEEK_MODEL_FALLBACK = "deepseek-chat";

const isTestEnv = Boolean(process.env.VITEST) || process.env.NODE_ENV === "test";

let _client: OpenAI | null = null;
let _useFallbackModel = false;

function client(): OpenAI {
  if (isTestEnv) {
    throw new Error("DeepSeek disabled in test environment");
  }
  if (!_client) {
    _client = new OpenAI({ apiKey: DEEPSEEK_API_KEY, baseURL: DEEPSEEK_BASE_URL });
  }
  return _client;
}

export function isDeepSeekAvailable(): boolean {
  return !isTestEnv && Boolean(DEEPSEEK_API_KEY);
}

export interface DeepSeekChatParams {
  system: string;
  user: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export async function deepseekChat({
  system,
  user,
  temperature = 0.85,
  maxTokens = 4000,
  jsonMode = false,
}: DeepSeekChatParams): Promise<string> {
  const c = client();
  const model = _useFallbackModel ? DEEPSEEK_MODEL_FALLBACK : DEEPSEEK_MODEL_PRIMARY;
  try {
    const resp = await c.chat.completions.create({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature,
      max_tokens: maxTokens,
      ...(jsonMode ? { response_format: { type: "json_object" as const } } : {}),
    });
    return resp.choices[0]?.message?.content ?? "";
  } catch (e: any) {
    // If the upstream rejects the primary model name, latch onto fallback
    // for the remainder of this process so we don't pay the round-trip again.
    const msg = String(e?.message || "");
    if (!_useFallbackModel && /model|404|400/i.test(msg)) {
      _useFallbackModel = true;
      const resp = await c.chat.completions.create({
        model: DEEPSEEK_MODEL_FALLBACK,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature,
        max_tokens: maxTokens,
        ...(jsonMode ? { response_format: { type: "json_object" as const } } : {}),
      });
      return resp.choices[0]?.message?.content ?? "";
    }
    throw e;
  }
}

/**
 * Safe wrapper — returns null on failure rather than throwing, so cron jobs
 * don't crash the whole scheduler when the upstream hiccups.
 */
export async function deepseekChatSafe(p: DeepSeekChatParams): Promise<string | null> {
  if (isTestEnv) return null;
  try {
    return await deepseekChat(p);
  } catch (e: any) {
    console.warn("[deepseek] call failed:", e.message);
    return null;
  }
}
