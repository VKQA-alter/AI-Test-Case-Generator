export interface TestCase {
  testCaseId: string;
  module?: string;
  description?: string;
  steps?: string[];
  expectedResult?: string;
  type?: "Positive" | "Negative" | "Edge" | string;
  priority?: "High" | "Medium" | "Low" | string;
}

export interface TestCaseResponse {
  testCases: TestCase[];
}

export interface TestCaseGenerationRequest {
  requirements: string;
  testTypes?: string[];
  format?: string;
}
