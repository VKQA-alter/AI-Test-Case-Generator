package com.ai.testgen.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Wrapper class to hold the list of test cases from LLM response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseResponse {
    
    @JsonProperty("testCases")
    private List<TestCase> testCases;
}
