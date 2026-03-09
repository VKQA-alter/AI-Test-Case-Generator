package com.ai.testgen.util;

/**
 * Utility class to build prompts for the LLM
 */
public class PromptBuilder {
    
    /**
     * Builds a prompt for test case generation based on the given requirements
     * @param requirements the software requirements text
     * @return the formatted prompt string to send to the LLM
     */
    public static String buildTestCasePrompt(String requirements) {
        return """
                 You are a senior QA engineer with strong experience in software testing.

                Your task is to analyze the given software requirement and generate comprehensive test cases.

                Requirements:
                %s

                Instructions:
                1. Identify functional scenarios from the requirement.
                2. Generate Positive test cases.
                3. Generate Negative test cases.
                4. Generate Edge test cases if applicable.
                5. Ensure test cases cover validation, boundary conditions, and incorrect user actions.
                6. Return the output strictly in JSON format.

                Each test case must contain:
                - testCaseId
                - scenario
                - steps (array of steps)
                - expectedResult
                - type (Positive / Negative / Edge)
                - priority (High / Medium / Low)

                Return the output in the following JSON structure:

                {
                "testCases": [
                    {
                    "testCaseId": "",
                    "module": "",
                    "description": "",
                    "scenario": "",
                    "steps": [],
                    "expectedResult": "",
                    "type": "",
                    "priority": ""
                    }
                ]
                }

                Generate as many relevant test cases as possible based on the requirement. Focus on quality and coverage.

                Rules:
                - Do not return explanations.
                - Do not return markdown.
                - Only return valid JSON.
                - Ensure steps are clear and sequential.
                
                """.formatted(requirements);
    }
}
