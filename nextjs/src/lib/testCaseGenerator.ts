import { buildPrompt } from "../utils/promptBuilder";
import { generateResponse, LlmOptions } from "./llmClient";
import { TestCase } from "../types";

function cleanJsonResponse(response: string): string {
  let s = response.replace(/```json\s*/g, "").replace(/```/g, "");
  const firstBrace = s.indexOf("{");
  if (firstBrace > 0) s = s.substring(firstBrace);
  const lastBrace = s.lastIndexOf("}");
  if (lastBrace > 0 && lastBrace < s.length - 1)
    s = s.substring(0, lastBrace + 1);
  s = s.replace(/"test\s*Cases"\s*:/gi, '"testCases":');
  s = s.replace(/"test_cases"\s*:/gi, '"testCases":');
  s = s.replace(/"testcases"\s*:/gi, '"testCases":');
  return s.trim();
}

export async function generateTestCases(
  requirements: string,
  opts: LlmOptions,
): Promise<TestCase[]> {
  const prompt = buildPrompt(requirements);
  const llmResponse = await generateResponse(prompt, opts);
  const cleaned = cleanJsonResponse(llmResponse);
  const parsed = JSON.parse(cleaned);
  const testCases = parsed.testCases as TestCase[];
  if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
    throw new Error("No test cases parsed from LLM response");
  }
  return testCases;
}
