package com.ai.testgen.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.ParseException;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;

import java.io.IOException;

/**
 * Service class to communicate with LLM APIs
 * Compatible with Ollama, LM Studio, LocalAI, OpenAI GPT, and other OpenAI-compatible APIs
 */
public class LlmService {
    
    private final String apiUrl;
    private final String model;
    private final String apiKey;
    private final ObjectMapper objectMapper;
    
    // Default values for Ollama running locally
    private static final String DEFAULT_API_URL = "http://localhost:11434/api/generate";
    private static final String DEFAULT_MODEL = "llama2";
    
    /**
     * Constructor with default settings (Ollama)
     */
    public LlmService() {
        this(DEFAULT_API_URL, DEFAULT_MODEL, null);
    }
    
    /**
     * Constructor with custom API URL and model (no API key)
     * @param apiUrl the URL of the LLM API endpoint
     * @param model the model name to use
     */
    public LlmService(String apiUrl, String model) {
        this(apiUrl, model, null);
    }
    
    /**
     * Constructor with custom API URL, model, and API key
     * @param apiUrl the URL of the LLM API endpoint
     * @param model the model name to use (e.g., "gpt-4", "gpt-3.5-turbo", "llama2")
     * @param apiKey the API key for authentication (required for OpenAI GPT, optional for local LLMs)
     */
    public LlmService(String apiUrl, String model, String apiKey) {
        this.apiUrl = apiUrl;
        this.model = model;
        this.apiKey = apiKey;
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Sends a prompt to the LLM and returns the response
     * @param prompt the prompt to send
     * @return the LLM's response as a String
     * @throws IOException if the API call fails
     */
    public String generateResponse(String prompt) throws IOException {
        System.out.println("Sending request to LLM at: " + apiUrl);
        System.out.println("Using model: " + model);
        if (apiKey != null && !apiKey.isEmpty()) {
            System.out.println("Using API key authentication");
        }
        
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost httpPost = new HttpPost(apiUrl);
            
            // Build the request body based on the API type
            String requestBody = buildRequestBody(prompt);
            
            httpPost.setEntity(new StringEntity(requestBody, ContentType.APPLICATION_JSON));
            httpPost.setHeader("Content-Type", "application/json");
            
            // Add Authorization header if API key is provided (for OpenAI GPT)
            if (apiKey != null && !apiKey.isEmpty()) {
                httpPost.setHeader("Authorization", "Bearer " + apiKey);
            }
            
            try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                int statusCode = response.getCode();
                String responseBody;
                try {
                    responseBody = EntityUtils.toString(response.getEntity());
                } catch (ParseException e) {
                    throw new IOException("Failed to parse response", e);
                }
                
                if (statusCode != 200) {
                    throw new IOException("LLM API returned error code: " + statusCode + 
                                        ". Response: " + responseBody);
                }
                
                return extractResponse(responseBody);
            }
        }
    }
    
    /**
     * Builds the request body based on API type
     * Supports Ollama format, OpenAI GPT format, and other OpenAI-compatible formats
     */
    private String buildRequestBody(String prompt) throws IOException {
        // For Ollama format
        if (apiUrl.contains("ollama") || apiUrl.contains("11434")) {
            return objectMapper.writeValueAsString(new OllamaRequest(model, prompt, false, "json"));
        }
        
        // For OpenAI GPT API (api.openai.com) - uses chat completions format
        if (apiUrl.contains("openai.com") || apiUrl.contains("/chat/completions")) {
            return objectMapper.writeValueAsString(new OpenAIChatRequest(model, prompt));
        }
        
        // For OpenAI-compatible APIs (LM Studio, LocalAI, etc.)
        return objectMapper.writeValueAsString(new OpenAIRequest(model, prompt));
    }
    
    /**
     * Extracts the actual response text from the API response
     */
    private String extractResponse(String responseBody) throws IOException {
        JsonNode rootNode = objectMapper.readTree(responseBody);
        
        // For Ollama streaming=false response
        if (rootNode.has("response")) {
            return rootNode.get("response").asText();
        }
        
        // For OpenAI-compatible APIs
        if (rootNode.has("choices")) {
            JsonNode choices = rootNode.get("choices");
            if (choices.isArray() && choices.size() > 0) {
                JsonNode firstChoice = choices.get(0);
                if (firstChoice.has("message")) {
                    return firstChoice.get("message").get("content").asText();
                }
                if (firstChoice.has("text")) {
                    return firstChoice.get("text").asText();
                }
            }
        }
        
        throw new IOException("Unable to parse LLM response: " + responseBody);
    }
    
    // Inner classes for request bodies
    
    /**
     * Ollama API request format
     */
    private record OllamaRequest(String model, String prompt, boolean stream, String format) {
    }
    
    /**
     * Generic OpenAI format (for LM Studio, LocalAI, etc.)
     */
    private record OpenAIRequest(String model, String prompt) {
    }
    
    /**
     * OpenAI Chat Completions API request format
     * Used for GPT-3.5-turbo, GPT-4, and other chat models
     */
    private record OpenAIChatRequest(String model, java.util.List<Message> messages) {
        public OpenAIChatRequest(String model, String prompt) {
            this(model, java.util.List.of(
                new Message("system", "You are a helpful QA engineer assistant that generates test cases in JSON format."),
                new Message("user", prompt)
            ));
        }
    }
    
    private record Message(String role, String content) {
    }
}
