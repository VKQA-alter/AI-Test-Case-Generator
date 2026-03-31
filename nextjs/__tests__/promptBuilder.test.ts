import { buildPrompt } from "../src/utils/promptBuilder";

test("buildPrompt includes requirements text and JSON instruction", () => {
  const req = "As a user, I want to login.";
  const prompt = buildPrompt(req);
  expect(prompt).toContain(req);
  expect(prompt).toContain("Return the output strictly in JSON format");
});
