import axios from "axios";

export interface LlmOptions {
  apiUrl?: string;
  model?: string;
  apiKey?: string | null;
}

export async function generateResponse(
  prompt: string,
  opts: LlmOptions,
): Promise<string> {
  const apiUrl = opts.apiUrl || "http://localhost:11434/api/generate";
  const model = opts.model || "llama2";
  const apiKey = opts.apiKey || "";

  const body = buildRequestBody(apiUrl, model, prompt);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  const res = await axios.post(apiUrl, body, { headers, timeout: 300_000 });
  return extractResponse(res.data);
}

function buildRequestBody(apiUrl: string, model: string, prompt: string) {
  if (apiUrl.includes("ollama") || apiUrl.includes("11434")) {
    return { model, prompt, stream: false, format: "json" };
  }
  if (apiUrl.includes("openai.com") || apiUrl.includes("/chat/completions")) {
    return {
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful QA engineer assistant that generates test cases in JSON format.",
        },
        { role: "user", content: prompt },
      ],
    };
  }
  return { model, prompt };
}

function extractResponse(data: any): string {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (data.response) return data.response;
  if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
    const first = data.choices[0];
    if (first.message && first.message.content) return first.message.content;
    if (first.text) return first.text;
  }
  try {
    return JSON.stringify(data);
  } catch (e) {
    return String(data);
  }
}
