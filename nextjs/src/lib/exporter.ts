import ExcelJS from "exceljs";
import { TestCase } from "../types";

export async function buildExcelBuffer(testCases: TestCase[]) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Test Cases");

  sheet.columns = [
    { header: "Test Case ID", key: "testCaseId", width: 20 },
    { header: "Module", key: "module", width: 20 },
    { header: "Description", key: "description", width: 40 },
    { header: "Steps", key: "steps", width: 60 },
    { header: "Expected Result", key: "expectedResult", width: 40 },
    { header: "Type", key: "type", width: 12 },
    { header: "Priority", key: "priority", width: 12 },
  ];

  testCases.forEach((tc) => {
    sheet.addRow({
      testCaseId: tc.testCaseId,
      module: tc.module || "",
      description: tc.description || "",
      steps: Array.isArray(tc.steps)
        ? tc.steps.join("\n")
        : (tc.steps as any) || "",
      expectedResult: tc.expectedResult || "",
      type: tc.type || "",
      priority: tc.priority || "",
    });
  });

  const buf = await workbook.xlsx.writeBuffer();
  return Buffer.from(buf);
}
