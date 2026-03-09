package com.ai.testgen;

import com.ai.testgen.exporter.ExcelExporter;
import com.ai.testgen.model.TestCase;
import com.ai.testgen.service.LlmService;
import com.ai.testgen.service.TestCaseGeneratorService;
import com.ai.testgen.util.RequirementReader;
import io.github.cdimascio.dotenv.Dotenv;

import java.io.IOException;
import java.util.List;

/**
 * Main entry point for the AI Test Case Generator CLI application
 * 
 * This application:
 * 1. Reads software requirements from input/requirements.txt
 * 2. Sends the requirements to a local LLM
 * 3. Parses the generated test cases (JSON format)
 * 4. Exports them to output/testcases.xlsx
 * 
 * @author AI Test Case Generator Team
 * @version 1.0.0
 */
public class Main {
    
    private static final String VERSION = "1.0.0";
    
    public static void main(String[] args) {
        printBanner();
        
        try {
            // Load .env file if it exists
            Dotenv dotenv = null;
            try {
                dotenv = Dotenv.configure().ignoreIfMissing().load();
                System.out.println("✓ .env file loaded successfully\n");
            } catch (Exception e) {
                System.out.println("ℹ No .env file found, using defaults or command-line args\n");
            }
            
            // Configuration: Priority order: Command-line args > .env > Defaults
            String apiUrl = getConfigValue(args, "api-url", 
                getEnvValue(dotenv, "LLM_API_URL", "http://localhost:11434/api/generate"));
            String model = getConfigValue(args, "model", 
                getEnvValue(dotenv, "LLM_MODEL", "llama2"));
            String apiKey = getConfigValue(args, "api-key", 
                getEnvValue(dotenv, "LLM_API_KEY", null));
            String inputFile = getConfigValue(args, "input", 
                getEnvValue(dotenv, "INPUT_FILE", "input/requirements.txt"));
            String outputFile = getConfigValue(args, "output", 
                getEnvValue(dotenv, "OUTPUT_FILE", "output/testcases.xlsx"));
            
            System.out.println("Configuration:");
            System.out.println("  LLM API URL: " + apiUrl);
            System.out.println("  Model: " + model);
            if (apiKey != null && !apiKey.isEmpty()) {
                System.out.println("  API Key: " + maskApiKey(apiKey));
            }
            System.out.println("  Input File: " + inputFile);
            System.out.println("  Output File: " + outputFile);
            System.out.println();
            
            // Step 1: Read requirements from file
            System.out.println("[Step 1/4] Reading requirements from file...");
            String requirements = RequirementReader.readRequirements(inputFile);
            System.out.println("✓ Requirements loaded successfully\n");
            
            // Step 2: Generate test cases using LLM
            System.out.println("[Step 2/4] Generating test cases using LLM...");
            LlmService llmService = new LlmService(apiUrl, model, apiKey);
            TestCaseGeneratorService generatorService = new TestCaseGeneratorService(llmService);
            List<TestCase> testCases = generatorService.generateTestCases(requirements);
            System.out.println("✓ Test cases generated successfully\n");
            
            // Step 3: Validate test cases
            System.out.println("[Step 3/4] Validating test cases...");
            validateTestCases(testCases);
            System.out.println("✓ Test cases validated successfully\n");
            
            // Step 4: Export to Excel
            System.out.println("[Step 4/4] Exporting test cases to Excel...");
            ExcelExporter exporter = new ExcelExporter();
            exporter.exportToExcel(testCases, outputFile);
            System.out.println("✓ Export completed successfully\n");
            
            // Success message
            printSuccessMessage(testCases.size(), outputFile);
            
        } catch (IOException e) {
            printError("I/O Error", e.getMessage());
            e.printStackTrace();
            System.exit(1);
        } catch (Exception e) {
            printError("Unexpected Error", e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
    
    /**
     * Validates that test cases are properly formatted
     */
    private static void validateTestCases(List<TestCase> testCases) {
        if (testCases == null || testCases.isEmpty()) {
            throw new IllegalStateException("No test cases were generated");
        }
        
        for (TestCase tc : testCases) {
            if (tc.getTestCaseId() == null || tc.getTestCaseId().trim().isEmpty()) {
                throw new IllegalStateException("Test case missing ID: " + tc);
            }
            if (tc.getDescription() == null || tc.getDescription().trim().isEmpty()) {
                throw new IllegalStateException("Test case missing description: " + tc.getTestCaseId());
            }
        }
        
        System.out.println("  All test cases have required fields");
    }
    
    /**
     * Gets a value from .env file or returns default
     */
    private static String getEnvValue(Dotenv dotenv, String key, String defaultValue) {
        if (dotenv == null) {
            return defaultValue;
        }
        String value = dotenv.get(key);
        return (value != null && !value.isEmpty()) ? value : defaultValue;
    }
    
    /**
     * Gets a configuration value from command line arguments or returns default
     * Usage: java -jar app.jar --api-url=https://api.openai.com/v1/chat/completions --model=gpt-4 --api-key=sk-...
     */
    private static String getConfigValue(String[] args, String key, String defaultValue) {
        String prefix = "--" + key + "=";
        for (String arg : args) {
            if (arg.startsWith(prefix)) {
                return arg.substring(prefix.length());
            }
        }
        return defaultValue;
    }
    
    /**
     * Masks the API key for display (shows only first and last 4 characters)
     */
    private static String maskApiKey(String apiKey) {
        if (apiKey == null || apiKey.length() <= 8) {
            return "****";
        }
        return apiKey.substring(0, 4) + "****" + apiKey.substring(apiKey.length() - 4);
    }
    
    /**Local LLM or OpenAI GPT
     * Prints application banner
     */
    private static void printBanner() {
        System.out.println("╔════════════════════════════════════════════════════════════╗");
        System.out.println("║                                                            ║");
        System.out.println("║         AI TEST CASE GENERATOR                             ║");
        System.out.println("║         Version " + VERSION + "                                      ║");
        System.out.println("║                                                            ║");
        System.out.println("║         Generate test cases from requirements              ║");
        System.out.println("║         using local LLM                                    ║");
        System.out.println("║                                                            ║");
        System.out.println("╚════════════════════════════════════════════════════════════╝");
        System.out.println();
    }
    
    /**
     * Prints success message
     */
    private static void printSuccessMessage(int testCaseCount, String outputFile) {
        System.out.println("╔════════════════════════════════════════════════════════════╗");
        System.out.println("║                    SUCCESS!                                ║");
        System.out.println("╚════════════════════════════════════════════════════════════╝");
        System.out.println();
        System.out.println("Generated " + testCaseCount + " test cases successfully!");
        System.out.println("Output file: " + outputFile);
        System.out.println();
        System.out.println("You can now open the Excel file to review the test cases.");
    }
    
    /**
     * Prints error message
     */
    private static void printError(String errorType, String message) {
        System.err.println("╔════════════════════════════════════════════════════════════╗");
        System.err.println("║                    ERROR                                   ║");
        System.err.println("╚════════════════════════════════════════════════════════════╝");
        System.err.println();
        System.err.println(errorType + ": " + message);
        System.err.println();
    }
}
