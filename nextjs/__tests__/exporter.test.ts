import { buildExcelBuffer } from "../src/lib/exporter";

test("buildExcelBuffer returns a non-empty buffer for sample test cases", async () => {
  const sample = [
    {
      testCaseId: "TC-1",
      module: "Login",
      description: "Valid login",
      steps: ["Go to login", "Enter creds", "Submit"],
      expectedResult: "User logged in",
      type: "Positive",
      priority: "High",
    },
  ];

  const buf = await buildExcelBuffer(sample as any);
  expect(buf).toBeInstanceOf(Buffer);
  expect(buf.length).toBeGreaterThan(0);
});
