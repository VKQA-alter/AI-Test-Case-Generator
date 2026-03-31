import { TestCaseGenerationRequest, TestCase } from "../types";
import { generateTestCases } from "./testCaseGenerator";
import { LlmOptions } from "./llmClient";
import { buildExcelBuffer } from "./exporter";

export async function generateAndExport(
  request: TestCaseGenerationRequest,
  opts: LlmOptions,
) {
  if (!request || !request.requirements || request.requirements.trim() === "") {
    throw new Error("Requirements cannot be empty");
  }

  const allTestCases: TestCase[] = await generateTestCases(
    request.requirements,
    opts,
  );

  const filtered: TestCase[] =
    request.testTypes && request.testTypes.length > 0
      ? allTestCases.filter(
          (tc) =>
            tc.type &&
            request
              .testTypes!.map((t) => t.toLowerCase())
              .includes(tc.type!.toLowerCase()),
        )
      : allTestCases;

  if (!filtered || filtered.length === 0) {
    throw new Error("No test cases generated or all filtered out");
  }

  const buffer = await buildExcelBuffer(filtered);
  return buffer;
}

// Excel export is implemented in src/lib/exporter.ts
