# Example Prompt Template Used by AI Test Case Generator

This file shows the actual prompt that is sent to the LLM.
The prompt is constructed in `src/main/java/com/ai/testgen/util/PromptBuilder.java`

---

## Prompt Template

```
You are an expert software QA engineer. Based on the following software requirements, generate comprehensive test cases.

Requirements:
[YOUR REQUIREMENTS TEXT WILL BE INSERTED HERE]

Generate test cases that include:
- Positive test cases (valid inputs and expected happy paths)
- Negative test cases (invalid inputs, error conditions)
- Edge cases (boundary conditions, extreme values)

Return the test cases in the following JSON format ONLY. Do not include any other text or explanation:

{
  "testCases": [
    {
      "testCaseId": "TC001",
      "module": "Module Name",
      "description": "Brief description of what is being tested",
      "steps": [
        "Step 1",
        "Step 2",
        "Step 3"
      ],
      "expectedResult": "Expected outcome of the test",
      "type": "Positive|Negative|Edge",
      "priority": "High|Medium|Low"
    }
  ]
}

Generate at least 10-15 test cases covering all aspects of the requirements.
Ensure each test case has a unique ID starting from TC001.
```

---

## Sample LLM Response (Expected)

```json
{
  "testCases": [
    {
      "testCaseId": "TC001",
      "module": "User Registration",
      "description": "Verify user registration with valid data",
      "steps": [
        "Navigate to registration page",
        "Enter valid email: user@example.com",
        "Enter valid username: testuser",
        "Enter valid password: Test@123",
        "Click Register button"
      ],
      "expectedResult": "User account created successfully and verification email sent",
      "type": "Positive",
      "priority": "High"
    },
    {
      "testCaseId": "TC002",
      "module": "User Registration",
      "description": "Verify registration fails with invalid email format",
      "steps": [
        "Navigate to registration page",
        "Enter invalid email: userexample.com",
        "Enter valid username: testuser",
        "Enter valid password: Test@123",
        "Click Register button"
      ],
      "expectedResult": "Error message displayed: 'Invalid email format'",
      "type": "Negative",
      "priority": "High"
    },
    {
      "testCaseId": "TC003",
      "module": "User Registration",
      "description": "Verify registration with minimum valid username length",
      "steps": [
        "Navigate to registration page",
        "Enter valid email: user@example.com",
        "Enter username with exactly 3 characters: abc",
        "Enter valid password: Test@123",
        "Click Register button"
      ],
      "expectedResult": "User account created successfully",
      "type": "Edge",
      "priority": "Medium"
    }
  ]
}
```

---

## How to Customize the Prompt

### Location

`src/main/java/com/ai/testgen/util/PromptBuilder.java`

### Example Customization

#### Add Test Data Column

```java
public static String buildTestCasePrompt(String requirements) {
    return """
        ...
        {
          "testCases": [
            {
              "testCaseId": "TC001",
              "module": "Module Name",
              "description": "Brief description",
              "testData": "Sample test data to use",  // NEW FIELD
              "steps": [...],
              ...
            }
          ]
        }
        ...
        """.formatted(requirements);
}
```

#### Request More Test Cases

Change:

```
Generate at least 10-15 test cases covering all aspects of the requirements.
```

To:

```
Generate at least 25-30 test cases covering all aspects of the requirements.
Include boundary value analysis and equivalence partitioning techniques.
```

#### Request Specific Test Types

Add:

```
Ensure the following distribution:
- 50% Positive test cases
- 30% Negative test cases
- 20% Edge cases
```

#### Add Test Execution Time

```
For each test case, also estimate execution time in minutes.
```

---

## Tips for Better Prompt Engineering

### 1. Be Specific

❌ "Generate test cases"
✅ "Generate 15 comprehensive test cases including positive, negative, and edge cases"

### 2. Request Structured Output

✅ Always request JSON format with exact schema
✅ Specify "ONLY JSON, no other text"

### 3. Provide Context

✅ "You are an expert QA engineer"
✅ Explain what each test type means

### 4. Set Constraints

✅ Specify minimum number of test cases
✅ Define ID format (TC001, TC002, etc.)
✅ List allowed values (Type: Positive|Negative|Edge)

### 5. Handle LLM Variations

- Some LLMs add markdown code blocks: `json...`
- Our code handles this in TestCaseGeneratorService.cleanJsonResponse()
- Test with your specific LLM and adjust parsing if needed

---

## Testing Different Prompts

### Method 1: Edit PromptBuilder.java

1. Open `src/main/java/com/ai/testgen/util/PromptBuilder.java`
2. Modify the prompt template
3. Rebuild: `mvn clean package`
4. Run and test

### Method 2: Test Prompt Directly with LLM

```bash
# For Ollama
ollama run llama2 "Your prompt here"

# Check if output is valid JSON
```

### Method 3: Create Test Variants

Create different prompt builder methods:

```java
public static String buildDetailedPrompt(String requirements) { ... }
public static String buildQuickPrompt(String requirements) { ... }
public static String buildSecurityTestPrompt(String requirements) { ... }
```

---

## Common Issues and Solutions

### Issue: LLM Returns Text Before JSON

**Solution:** Add stronger instruction:

```
Return ONLY the JSON object. Do not include explanations, comments, or any text before or after the JSON.
Start your response with { and end with }
```

### Issue: Inconsistent Field Names

**Solution:** Be more explicit:

```
Use these EXACT field names (case-sensitive):
- testCaseId (not TestCaseId or test_case_id)
- module (not Module or moduleName)
...
```

### Issue: Missing Test Cases

**Solution:** Request minimum count:

```
You MUST generate at least 15 test cases.
If the requirements are simple, add test cases for:
- Different user roles
- Different browsers/devices
- Performance testing
- Usability testing
```

---

## Advanced Prompt Techniques

### Chain of Thought

```
First, analyze the requirements and identify all testable features.
Then, for each feature, generate positive, negative, and edge test cases.
Finally, format your response as JSON.
```

### Few-Shot Learning

Include example test cases in the prompt:

```
Example test case:
{
  "testCaseId": "TC001",
  "module": "Login",
  "description": "Verify login with valid credentials",
  ...
}

Now generate similar test cases for these requirements:
[requirements]
```

---

**Note:** The prompt engineering significantly affects output quality. Experiment with different approaches for your specific use case.
