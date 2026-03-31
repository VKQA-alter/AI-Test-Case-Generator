import type { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
import { TestCaseGenerationRequest } from "../../types";
import { generateAndExport } from "../../lib/webTestCaseService";

dotenv.config();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const body = req.body as TestCaseGenerationRequest;
    if (!body || !body.requirements || body.requirements.trim() === "") {
      return res.status(400).json({ error: "Requirements cannot be empty" });
    }

    const opts = {
      apiUrl: process.env.LLM_API_URL || "http://localhost:11434/api/generate",
      model: process.env.LLM_MODEL || "llama2",
      apiKey: process.env.LLM_API_KEY || null,
    };

    const buffer = await generateAndExport(body, opts as any);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="test_cases.xlsx"',
    );
    return res.status(200).send(buffer);
  } catch (e: any) {
    console.error("=== API Generate Error ===");
    console.error("Error:", e);
    console.error("Stack:", e.stack);
    return res.status(500).json({ error: e.message || String(e) });
  }
}
