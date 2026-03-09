# AI Test Case Generator - Project Documentation

## 📐 Architecture Overview

This document provides detailed information about the project architecture, design decisions, and implementation details.

## 🏛️ Architecture Pattern

The project follows a **layered architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│           (Main.java)               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Service Layer               │
│  (TestCaseGeneratorService,         │
│   LlmService)                       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Business Logic / Model Layer     │
│    (TestCase, TestCaseResponse)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Data Access / Export Layer       │
│  (RequirementReader, ExcelExporter) │
└─────────────────────────────────────┘
```

## 📦 Package Structure

### `com.ai.testgen` (Root Package)

- **Main.java**: Entry point and orchestration

### `com.ai.testgen.model`

Data models representing domain entities

- **TestCase.java**: Core test case entity with all fields
- **TestCaseResponse.java**: Wrapper for LLM JSON response

### `com.ai.testgen.service`

Business logic and external service integration

- **LlmService.java**: Handles HTTP communication with local LLM APIs
- **TestCaseGeneratorService.java**: Orchestrates test case generation workflow

### `com.ai.testgen.exporter`

Output and export functionality

- **ExcelExporter.java**: Converts test cases to Excel format using Apache POI

### `com.ai.testgen.util`

Utility classes and helpers

- **RequirementReader.java**: File I/O operations for reading requirements
- **PromptBuilder.java**: Constructs prompts for the LLM

## 🔄 Data Flow

```
┌──────────────┐
│ requirements │
│    .txt      │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ RequirementReader│
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  PromptBuilder   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   LlmService     │───────► [Local LLM API]
└──────┬───────────┘              │
       │                          │
       │ ◄────────────────────────┘
       │ (JSON Response)
       ▼
┌─────────────────────────┐
│TestCaseGeneratorService │
│   (JSON Parsing)        │
└──────┬──────────────────┘
       │
       ▼
┌──────────────────┐
│  List<TestCase>  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  ExcelExporter   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  testcases.xlsx  │
└──────────────────┘
```

## 🎨 Design Patterns

### 1. **Service Layer Pattern**

- Separates business logic from presentation
- `TestCaseGeneratorService` and `LlmService` encapsulate complex operations

### 2. **Builder Pattern**

- Used in `TestCase` class via Lombok's `@Builder`
- Provides fluent API for object construction

### 3. **Strategy Pattern**

- `LlmService` adapts to different LLM API formats (Ollama, OpenAI-compatible)
- Easy to extend for new LLM providers

### 4. **Facade Pattern**

- `TestCaseGeneratorService` provides simplified interface to complex subsystem

### 5. **Data Transfer Object (DTO)**

- `TestCase` and `TestCaseResponse` serve as DTOs for data transfer

## 🔧 Key Technologies

### Core Framework

- **Java 17**: Uses modern Java features (records, text blocks)
- **Maven**: Build automation and dependency management

### JSON Processing

- **Jackson**: Industry-standard JSON parser
  - `jackson-databind`: Object mapping
  - `jackson-core`: Core streaming API
  - `jackson-annotations`: Annotation support

### Excel Generation

- **Apache POI**: Microsoft Office document manipulation
  - `poi`: Core library for Office formats
  - `poi-ooxml`: Support for .xlsx format

### HTTP Communication

- **Apache HttpClient 5**: Modern HTTP client
  - Connection pooling
  - Timeout management
  - SSL/TLS support

### Code Quality

- **Lombok**: Reduces boilerplate code
  - `@Data`: Generates getters, setters, toString, equals, hashCode
  - `@Builder`: Builder pattern implementation
  - `@NoArgsConstructor`, `@AllArgsConstructor`: Constructor generation

## 🧠 LLM Integration

### Supported LLM Platforms

#### 1. **Ollama**

- **Endpoint**: `http://localhost:11434/api/generate`
- **Request Format**:
  ```json
  {
    "model": "llama2",
    "prompt": "...",
    "stream": false,
    "format": "json"
  }
  ```
- **Response Format**:
  ```json
  {
    "response": "..."
  }
  ```

#### 2. **LM Studio (OpenAI-compatible)**

- **Endpoint**: `http://localhost:1234/v1/completions`
- **Request Format**: OpenAI Completion API format
- **Response Format**: OpenAI compatible

#### 3. **LocalAI**

- **Endpoint**: `http://localhost:8080/v1/completions`
- **Request Format**: OpenAI compatible
- **Response Format**: OpenAI compatible

### LLM Response Parsing

The system uses a robust parsing strategy:

1. **Cleaning**: Remove markdown code blocks and extraneous text
2. **Extraction**: Find JSON boundaries (`{` to `}`)
3. **Parsing**: Use Jackson to deserialize into `TestCaseResponse`
4. **Validation**: Ensure all required fields are present

## 📋 Test Case Structure

### JSON Schema Expected from LLM

```json
{
  "testCases": [
    {
      "testCaseId": "TC001",
      "module": "User Authentication",
      "description": "Verify login with valid credentials",
      "steps": [
        "Navigate to login page",
        "Enter valid username",
        "Enter valid password",
        "Click Login button"
      ],
      "expectedResult": "User should be redirected to dashboard",
      "type": "Positive",
      "priority": "High"
    }
  ]
}
```

### Java Object Mapping

```java
@Data
@Builder
public class TestCase {
    private String testCaseId;      // TC001, TC002, etc.
    private String module;          // Feature/module name
    private String description;     // Test description
    private List<String> steps;     // Test steps
    private String expectedResult;  // Expected outcome
    private String type;            // Positive/Negative/Edge
    private String priority;        // High/Medium/Low
}
```

## 📊 Excel Export Details

### Workbook Structure

- **Sheet Name**: "Test Cases"
- **Format**: XLSX (Office Open XML)

### Column Configuration

| Column          | Width         | Alignment | Wrap Text |
| --------------- | ------------- | --------- | --------- |
| Test Case ID    | Auto          | Center    | No        |
| Module          | Auto          | Left      | No        |
| Description     | Max 100 chars | Top       | Yes       |
| Steps           | Max 100 chars | Top       | Yes       |
| Expected Result | Max 100 chars | Top       | Yes       |
| Type            | Auto          | Left      | No        |
| Priority        | Auto          | Left      | No        |

### Cell Styling

**Header Row**:

- Background: Grey 25%
- Font: Bold, 12pt
- Borders: All sides
- Alignment: Center

**Data Rows**:

- Font: Regular, 11pt
- Borders: All sides
- Alignment: Top (with text wrapping)

## 🔒 Error Handling

### Error Categories

1. **I/O Errors**
   - File not found
   - File not readable
   - Empty file

2. **Network Errors**
   - LLM API unreachable
   - Connection timeout
   - HTTP error codes

3. **Parsing Errors**
   - Invalid JSON format
   - Missing required fields
   - Unexpected structure

4. **Validation Errors**
   - Empty test case list
   - Missing mandatory fields
   - Invalid data types

### Error Handling Strategy

```java
try {
    // Operation
} catch (IOException e) {
    // Log error
    // Display user-friendly message
    // Exit with error code
}
```

## 🎯 Best Practices Implemented

### 1. **Separation of Concerns**

- Each class has a single, well-defined responsibility
- No business logic in Main.java

### 2. **Dependency Injection**

- Services accept dependencies through constructors
- Easy to test and mock

### 3. **Immutability**

- Use of `final` fields where appropriate
- Records for request/response objects

### 4. **Resource Management**

- Try-with-resources for automatic cleanup
- Proper stream and connection closing

### 5. **Defensive Programming**

- Null checks and validation
- Input sanitization
- Meaningful error messages

### 6. **Clean Code**

- Descriptive naming
- Small, focused methods
- Comprehensive comments

### 7. **Configuration Management**

- Externalized configuration
- Command-line argument support
- Sensible defaults

## 🧪 Testing Strategy (Future)

### Unit Tests

- Test individual methods in isolation
- Mock external dependencies
- Use JUnit 5 and Mockito

### Integration Tests

- Test component interactions
- Use embedded test servers
- Test with sample data

### End-to-End Tests

- Test complete workflow
- Use test fixtures
- Validate output files

## 🚀 Performance Considerations

### Optimization Points

1. **HTTP Connection Pooling**
   - HttpClient reuses connections
   - Reduces overhead for multiple requests

2. **Streaming**
   - File reading uses NIO for efficiency
   - Excel writing uses streaming API

3. **Memory Management**
   - Limits on column widths prevent excessive memory use
   - Proper resource cleanup

### Scalability

Current limitations:

- Single-threaded execution
- In-memory processing
- Synchronous LLM calls

Future improvements:

- Async LLM requests
- Batch processing
- Parallel Excel generation

## 📈 Extension Points

### Adding New LLM Providers

Extend `LlmService` to support new formats:

```java
private String buildRequestBody(String prompt) {
    if (apiUrl.contains("new-provider")) {
        return buildNewProviderRequest(prompt);
    }
    // existing logic
}
```

### Adding New Export Formats

Create new exporters implementing common interface:

```java
public interface TestCaseExporter {
    void export(List<TestCase> testCases, String outputPath);
}
```

### Customizing Test Case Fields

1. Add field to `TestCase.java`
2. Update `PromptBuilder.java` to request field
3. Update `ExcelExporter.java` to include column

## 🔐 Security Considerations

### Current Implementation

- Local LLM only (no data leaves machine)
- No authentication required for local APIs
- File system access limited to project directories

### Production Considerations

- Add API key management if using cloud LLMs
- Implement input validation and sanitization
- Add rate limiting for API calls
- Secure storage of credentials
- Audit logging

## 📊 Metrics and Monitoring

### Current Logging

- Console output for major steps
- Error details printed to stderr
- File operation confirmations

### Future Enhancements

- Structured logging (Log4j2/SLF4J)
- Performance metrics
- Success/failure rates
- API response times

## 🎓 Learning Resources

### Java Technologies

- [Java 17 Documentation](https://docs.oracle.com/en/java/javase/17/)
- [Maven Guide](https://maven.apache.org/guides/)

### Libraries

- [Jackson Documentation](https://github.com/FasterXML/jackson-docs)
- [Apache POI](https://poi.apache.org/)
- [Apache HttpClient](https://hc.apache.org/httpcomponents-client-5.2.x/)
- [Lombok](https://projectlombok.org/)

### LLMs

- [Ollama Documentation](https://github.com/ollama/ollama)
- [LM Studio](https://lmstudio.ai/docs)
- [LocalAI](https://localai.io/docs/)

## 🤖 AI/LLM Best Practices

### Prompt Engineering

- Clear, specific instructions
- Request structured output (JSON)
- Provide examples in prompt
- Specify constraints and requirements

### Response Handling

- Robust parsing with fallbacks
- Validation of generated content
- Retry logic for failures
- Error reporting for debugging

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Maintained By**: Vamshi
