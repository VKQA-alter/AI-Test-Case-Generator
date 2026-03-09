package com.ai.testgen.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Model class representing a Test Case
 * This class maps to the JSON structure returned by the LLM
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestCase {
    
    @JsonProperty("testCaseId")
    private String testCaseId;
    
    @JsonProperty("module")
    private String module;
    
    @JsonProperty("description")
    private String description;
    
    @JsonProperty("steps")
    private List<String> steps;
    
    @JsonProperty("expectedResult")
    private String expectedResult;
    
    @JsonProperty("type")
    private String type; // Positive, Negative, Edge
    
    @JsonProperty("priority")
    private String priority; // High, Medium, Low (optional)
    
    /**
     * Converts the steps list to a formatted string for Excel export
     * @return formatted steps as a numbered string
     */
    public String getStepsAsString() {
        if (steps == null || steps.isEmpty()) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < steps.size(); i++) {
            sb.append((i + 1)).append(". ").append(steps.get(i));
            if (i < steps.size() - 1) {
                sb.append("\n");
            }
        }
        return sb.toString();
    }
}
