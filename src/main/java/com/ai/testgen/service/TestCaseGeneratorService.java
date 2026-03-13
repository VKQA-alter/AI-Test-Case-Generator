package com.ai.testgen.service;

import com.ai.testgen.model.TestCase;
import com.ai.testgen.model.TestCaseResponse;
import com.ai.testgen.util.PromptBuilder;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

/**
 * Service class that orchestrates test case generation
 * Coordinates between requirement reading, LLM interaction, and parsing
 */
public class TestCaseGeneratorService {
    
    private final LlmService llmService;
    private final ObjectMapper objectMapper;
    
    /**
     * Constructor with default LLM service
     */
    public TestCaseGeneratorService() {
        this.llmService = new LlmService();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Constructor with custom LLM service
     * @param llmService the LLM service to use
     */
    public TestCaseGeneratorService(LlmService llmService) {
        this.llmService = llmService;
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Generates test cases from requirements
     * @param requirements the software requirements text
     * @return list of generated test cases
     * @throws IOException if generation or parsing fails
     */
    public List<TestCase> generateTestCases(String requirements) throws IOException {
        System.out.println("\n=== Starting Test Case Generation ===");
        System.out.println("Requirements length: " + requirements.length() + " characters\n");
        
        // Step 1: Build the prompt
        String prompt = PromptBuilder.buildTestCasePrompt(requirements);
        System.out.println("Prompt built successfully");
        
        // Step 2: Send to LLM and get response
        System.out.println("Sending request to LLM...");
        String llmResponse = llmService.generateResponse(prompt);
        System.out.println("Received response from LLM");
        System.out.println("Response length: " + llmResponse.length() + " characters\n");
        
        // Step 3: Parse the JSON response
        System.out.println("Parsing JSON response...");
        List<TestCase> testCases = parseTestCases(llmResponse);
        System.out.println("Successfully parsed " + testCases.size() + " test cases");
        
        // Step 4: Validate and display summary
        displayTestCaseSummary(testCases);
        
        return testCases;
    }
    
    /**
     * Parses the LLM response into TestCase objects
     */
    private List<TestCase> parseTestCases(String jsonResponse) throws IOException {
        try {
            // Clean the response - remove any markdown code blocks if present
            String cleanedJson = cleanJsonResponse(jsonResponse);
            
            // Parse into TestCaseResponse object
            TestCaseResponse response = objectMapper.readValue(cleanedJson, TestCaseResponse.class);
            
            if (response.getTestCases() == null || response.getTestCases().isEmpty()) {
                throw new IOException("No test cases found in the LLM response");
            }
            
            return response.getTestCases();
            
        } catch (Exception e) {
            System.err.println("Error parsing JSON response:");
            System.err.println("Response: " + jsonResponse);
            throw new IOException("Failed to parse test cases from LLM response: " + e.getMessage(), e);
        }
    }
    
    /**
     * Cleans the JSON response by removing markdown code blocks and extra whitespace
     */
    private String cleanJsonResponse(String response) {
        // Remove markdown code blocks (```json ... ```)
        response = response.replaceAll("```json\\s*", "");
        response = response.replaceAll("```\\s*", "");
        
        // Remove any text before the first {
        int firstBrace = response.indexOf('{');
        if (firstBrace > 0) {
            response = response.substring(firstBrace);
        }
        
        // Remove any text after the last }
        int lastBrace = response.lastIndexOf('}');
        if (lastBrace > 0 && lastBrace < response.length() - 1) {
            response = response.substring(0, lastBrace + 1);
        }
        
        // Normalize common key variants produced by some models (e.g., "test Cases", "test_cases", "testcases")
        response = response.replaceAll("\"test\\s*Cases\"\\s*:", "\"testCases\":");
        response = response.replaceAll("\"test_cases\"\\s*:", "\"testCases\":");
        response = response.replaceAll("\"testcases\"\\s*:", "\"testCases\":");

        return response.trim();
    }
    
    /**
     * Displays a summary of the generated test cases
     */
    private void displayTestCaseSummary(List<TestCase> testCases) {
        System.out.println("\n=== Test Case Summary ===");
        
        long positiveCount = testCases.stream()
                .filter(tc -> "Positive".equalsIgnoreCase(tc.getType()))
                .count();
        long negativeCount = testCases.stream()
                .filter(tc -> "Negative".equalsIgnoreCase(tc.getType()))
                .count();
        long edgeCount = testCases.stream()
                .filter(tc -> "Edge".equalsIgnoreCase(tc.getType()))
                .count();
        
        System.out.println("Total Test Cases: " + testCases.size());
        System.out.println("  - Positive: " + positiveCount);
        System.out.println("  - Negative: " + negativeCount);
        System.out.println("  - Edge: " + edgeCount);
        System.out.println();
        
        // Display first few test cases as preview
        System.out.println("Preview of generated test cases:");
        testCases.stream()
                .limit(3)
                .forEach(tc -> System.out.println("  - " + tc.getTestCaseId() + ": " + tc.getDescription()));
        
        if (testCases.size() > 3) {
            System.out.println("  ... and " + (testCases.size() - 3) + " more");
        }
        System.out.println();
    }
}
