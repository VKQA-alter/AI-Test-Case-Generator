# AI Test Case Generator

A CLI-based Java application that automatically generates comprehensive test cases from software requirements using Local LLMs or OpenAI GPT.

## 🎯 Features

- **Automated Test Case Generation**: Converts software requirements into structured test cases
- **Multiple LLM Support**:
  - **Local LLMs**: Ollama, LM Studio, LocalAI (free, private)
  - **OpenAI GPT**: GPT-4, GPT-3.5-turbo (requires API key)
- **Comprehensive Coverage**: Generates positive, negative, and edge test cases
- **Excel Export**: Outputs test cases in a well-formatted Excel file (.xlsx)
- **Clean Architecture**: Modular design with clear separation of concerns
- **CLI-based**: Simple command-line interface, no UI complexity

## 📋 Requirements

- **Java 17 or higher**
- **Maven 3.6+**
- **LLM Option 1**: Local LLM (e.g., Ollama, LM Studio) - Free
- **LLM Option 2**: OpenAI API Key - Paid

## 🏗️ Project Structure

```
ai-test-case-generator/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/ai/testgen/
│   │   │       ├── Main.java                     # Entry point
│   │   │       ├── model/
│   │   │       │   ├── TestCase.java            # Test case model
│   │   │       │   └── TestCaseResponse.java    # Response wrapper
│   │   │       ├── service/
│   │   │       │   ├── LlmService.java          # LLM communication
│   │   │       │   └── TestCaseGeneratorService.java
│   │   │       ├── exporter/
│   │   │       │   └── ExcelExporter.java       # Excel export logic
│   │   │       └── util/
│   │   │           ├── RequirementReader.java   # File reading utility
│   │   │           └── PromptBuilder.java       # LLM prompt builder
│   │   └── resources/
│   │       └── application.properties            # Configuration
│   └── test/ (for future unit tests)
│
├── input/
│   └── requirements.txt                          # Input requirements file
│
├── output/
│   └── testcases.xlsx                           # Generated Excel file
│
├── pom.xml                                       # Maven configuration
└── README.md                                     # This file
```

## 🚀 Getting Started

### Step 1: Set Up an LLM

Choose one of the following options:

#### Option A: Ollama (Recommended - Free & Private)

1. Install Ollama from [https://ollama.ai](https://ollama.ai)
2. Pull a model **based on your system RAM:**

   ```bash
   # For 8GB+ RAM (best quality)
   ollama pull llama2

   # For 4-8GB RAM (recommended for most systems)
   ollama pull phi

   # For 2-4GB RAM (lightweight)
   ollama pull tinyllama
   ```

3. Ollama runs on `http://localhost:11434` by default

**💡 Tip:** If you get a memory error, use a smaller model like `phi`.

#### Option B: OpenAI GPT (Paid - Best Quality)

1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Set environment variable:

   ```bash
   # Windows
   set OPENAI_API_KEY=sk-your-api-key-here

   # Linux/Mac
   export OPENAI_API_KEY=sk-your-api-key-here
   ```

3. See [GPT_SETUP_GUIDE.md](GPT_SETUP_GUIDE.md) for detailed instructions

#### Option C: LM Studio

1. Download LM Studio from [https://lmstudio.ai](https://lmstudio.ai)
2. Load a model and start the local server
3. Default endpoint: `http://localhost:1234`

#### Option D: LocalAI

1. Install LocalAI following their documentation
2. Configure and start the server
3. Default endpoint: `http://localhost:8080`

### Step 2: Clone/Download the Project

```bash
cd "AI Test Case Generator"
```

### Step 3: Build the Project

```bash
mvn clean package
```

This will:

- Compile all Java files
- Run tests (if any)
- Create an executable JAR in the `target/` directory

### Step 4: Configure Environment (Optional but Recommended)

**Create a `.env` file for secure configuration:**

```bash
# Copy the example file
copy .env.example .env    # Windows
cp .env.example .env      # Linux/Mac
```

**Edit `.env` file:**

**For Local LLM (Ollama):**

```bash
LLM_API_URL=http://localhost:11434/api/generate
LLM_MODEL=llama2
```

**For OpenAI GPT:**

```bash
LLM_API_URL=https://api.openai.com/v1/chat/completions
LLM_MODEL=gpt-4
LLM_API_KEY=sk-your-api-key-here
```

See [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md) for detailed instructions.

### Step 5: Prepare Input

Edit the `input/requirements.txt` file with your software requirements. An example file is already provided.

### Step 6: Run the Application

#### Option 1: Using .env File (Recommended)

If you configured a `.env` file in Step 4:

```bash
java -jar target/ai-test-case-generator-1.0.0.jar
```

That's it! All configuration is loaded automatically from `.env`.

#### Option 2: Using Command-Line Arguments

##### Using Maven:

```bash
mvn exec:java -Dexec.mainClass="com.ai.testgen.Main"
```

#### Using the JAR (Local LLM):

```bash
java -jar target/ai-test-case-generator-1.0.0.jar
```

#### Using OpenAI GPT:

```bash
# Windows
run-gpt.bat

# Linux/Mac
chmod +x run-gpt.sh
./run-gpt.sh

# Or manually:
java -jar target/ai-test-case-generator-1.0.0.jar \
  --api-url=https://api.openai.com/v1/chat/completions \
  --model=gpt-4 \
  --api-key=%OPENAI_API_KEY%
```

#### With Custom Configuration:

```bash
java -jar target/ai-test-case-generator-1.0.0.jar \
  --api-url=http://localhost:11434/api/generate \
  --model=llama2 \
  --input=input/requirements.txt \
  --output=output/testcases.xlsx
```

### Step 7: View Results

Open `output/testcases.xlsx` in Microsoft Excel, LibreOffice Calc, or any spreadsheet application.

## ⚙️ Configuration

There are three ways to configure the application (in priority order):

### 1. Command-Line Arguments (Highest Priority)

Override any configuration:

```bash
java -jar target/ai-test-case-generator-1.0.0.jar \
  --api-url=https://api.openai.com/v1/chat/completions \
  --model=gpt-4 \
  --api-key=sk-your-key
```

### 2. Environment Variables (.env file) (Recommended)

Create a `.env` file in the project root:

```bash
LLM_API_URL=http://localhost:11434/api/generate
LLM_MODEL=llama2
LLM_API_KEY=sk-your-key-if-needed
INPUT_FILE=input/requirements.txt
OUTPUT_FILE=output/testcases.xlsx
```

**Benefits:**

- ✅ Secure (API keys not in command history)
- ✅ Convenient (no long commands)
- ✅ Git-safe (`.env` is automatically ignored)

**Quick Start:**

```bash
# 1. Copy example file
cp .env.example .env

# 2. Edit with your values
nano .env  # or use any text editor

# 3. Run (configuration loaded automatically)
java -jar target/ai-test-case-generator-1.0.0.jar
```

📖 **See [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md) for complete .env documentation.**

### 3. Application Properties (Lowest Priority)

Edit `src/main/resources/application.properties`:

```properties
# LLM API Configuration
llm.api.url=http://localhost:11434/api/generate
llm.model=llama2

# File Paths
input.file.path=input/requirements.txt
output.file.path=output/testcases.xlsx
```

### Configuration Priority

When the same setting is defined in multiple places:

```
Command-Line Args  >  .env File  >  application.properties  >  Defaults
```

**Example:**

- `.env` has `LLM_MODEL=gpt-3.5-turbo`
- Command: `java -jar app.jar --model=gpt-4`
- **Result:** Uses `gpt-4` (command-line wins)

### Environment Variables Reference

| Variable      | Description       | Default                               |
| ------------- | ----------------- | ------------------------------------- |
| `LLM_API_URL` | LLM API endpoint  | `http://localhost:11434/api/generate` |
| `LLM_MODEL`   | Model name        | `llama2`                              |
| `LLM_API_KEY` | API key (for GPT) | None                                  |
| `INPUT_FILE`  | Input file path   | `input/requirements.txt`              |
| `OUTPUT_FILE` | Output file path  | `output/testcases.xlsx`               |

### Command Line Arguments Reference

| Argument    | Description              | Default                               |
| ----------- | ------------------------ | ------------------------------------- |
| `--api-url` | LLM API endpoint         | `http://localhost:11434/api/generate` |
| `--model`   | Model name to use        | `llama2`                              |
| `--api-key` | API key (for OpenAI GPT) | None                                  |
| `--input`   | Input requirements file  | `input/requirements.txt`              |
| `--output`  | Output Excel file        | `output/testcases.xlsx`               |

### LLM API Configurations

#### For Ollama:

```bash
--api-url=http://localhost:11434/api/generate --model=llama2
```

#### For OpenAI GPT-4:

```bash
--api-url=https://api.openai.com/v1/chat/completions --model=gpt-4 --api-key=sk-your-key
```

#### For OpenAI GPT-3.5-turbo:

```bash
--api-url=https://api.openai.com/v1/chat/completions --model=gpt-3.5-turbo --api-key=sk-your-key
```

#### For LM Studio:

```bash
--api-url=http://localhost:1234/v1/completions --model=local-model
```

#### For LocalAI:

```bash
--api-url=http://localhost:8080/v1/completions --model=your-model-name
```

## 📊 Output Format

The generated Excel file contains the following columns:

| Column              | Description                            |
| ------------------- | -------------------------------------- |
| **Test Case ID**    | Unique identifier (e.g., TC001, TC002) |
| **Module**          | Feature or module being tested         |
| **Description**     | Brief description of the test          |
| **Steps**           | Numbered steps to execute the test     |
| **Expected Result** | Expected outcome                       |
| **Type**            | Positive / Negative / Edge             |
| **Priority**        | High / Medium / Low                    |

## 🧩 Dependencies

- **Jackson** (2.15.2) - JSON parsing
- **Apache POI** (5.2.3) - Excel file generation
- **Apache HttpClient** (5.2.1) - HTTP communication with LLM
- **Lombok** (1.18.30) - Reduce boilerplate code
- **dotenv-java** (3.0.0) - Load environment variables from .env file

## 🤖 Choosing Your LLM

### Local LLM (Ollama) vs OpenAI GPT

| Feature      | Local LLM (Ollama)              | OpenAI GPT                          |
| ------------ | ------------------------------- | ----------------------------------- |
| **Cost**     | Free                            | Pay per use (~$0.004-$0.11 per run) |
| **Privacy**  | 100% Private                    | Data sent to OpenAI                 |
| **Quality**  | Good                            | Excellent                           |
| **Speed**    | Depends on hardware             | Fast (cloud-based)                  |
| **Setup**    | Requires local installation     | Just API key                        |
| **Internet** | Not required                    | Required                            |
| **Best For** | Privacy-conscious, offline work | Best quality, quick setup           |

### Recommendations:

- **Use Local LLM (Ollama)** if:
  - You need complete privacy
  - You work offline
  - You want zero cost
  - You have good hardware (GPU recommended)

- **Use OpenAI GPT** if:
  - You need best quality results
  - You want quick setup
  - Cost is not a concern
  - You need consistent results

For detailed GPT setup, see [GPT_SETUP_GUIDE.md](GPT_SETUP_GUIDE.md)

## 🔧 Troubleshooting

### Issue: "model requires more system memory" (Most Common!)

**Error:**

```
I/O Error: LLM API returned error code: 500
Response: {"error":"model requires more system memory (5.5 GiB) than is available (4.6 GiB)"}
```

**Solution**: Use a smaller model that fits your available RAM:

```bash
# Pull a smaller model
ollama pull phi          # For 4-8GB RAM
# or
ollama pull tinyllama    # For 2-4GB RAM

# Update your .env file:
LLM_MODEL=phi

# Or run with command-line override:
java -jar target/ai-test-case-generator-1.0.0.jar --model=phi
```

**Model recommendations by RAM:**

- **2-4GB RAM:** Use `tinyllama` (fast, basic)
- **4-8GB RAM:** Use `phi` (recommended, good quality)
- **8GB+ RAM:** Use `llama2` or `codellama` (best quality)

### Issue: "Connection refused" error

**Solution**: Ensure your local LLM is running:

```bash
# For Ollama
ollama list
ollama run llama2
```

### Issue: "Requirements file not found"

**Solution**: Ensure `input/requirements.txt` exists and contains text.

### Issue: "Failed to parse JSON response"

**Solution**:

- Try a different LLM model
- Check that the model supports JSON output
- Verify the prompt format in `PromptBuilder.java`

### Issue: "Out of memory" error

**Solution**: Increase Java heap size:

```bash
java -Xmx2G -jar target/ai-test-case-generator-1.0.0.jar
```

### Issue: "Incorrect API key provided" (OpenAI GPT)

**Solution**:

- Verify your API key is correct
- Check if key starts with `sk-`
- Ensure you're using `--api-key=` parameter
- Set environment variable: `export OPENAI_API_KEY=sk-your-key`

### Issue: "Rate limit exceeded" (OpenAI GPT)

**Solution**:

- You've exceeded OpenAI's rate limits
- Wait a few minutes and try again
- Check your usage limits at [OpenAI Dashboard](https://platform.openai.com/usage)

### Issue: "Model not found" (OpenAI GPT)

**Solution**:

- Verify model name: `gpt-4` or `gpt-3.5-turbo`
- Check if you have access to the model
- Some models require specific API tier

## 📝 Example Prompt Template

The application uses the following prompt structure (see `PromptBuilder.java`):

```
You are an expert software QA engineer. Based on the following software requirements,
generate comprehensive test cases.

Requirements:
[Your requirements here]

Generate test cases that include:
- Positive test cases (valid inputs and expected happy paths)
- Negative test cases (invalid inputs, error conditions)
- Edge cases (boundary conditions, extreme values)

Return the test cases in the following JSON format ONLY...
```

## 🛠️ Customization

### Modifying the Prompt

Edit `src/main/java/com/ai/testgen/util/PromptBuilder.java` to customize how test cases are requested.

### Changing Excel Format

Edit `src/main/java/com/ai/testgen/exporter/ExcelExporter.java` to modify:

- Column headers
- Cell styling
- Additional columns
- Formatting rules

### Adding New Test Case Fields

1. Add fields to `TestCase.java` model
2. Update JSON parsing in `TestCaseGeneratorService.java`
3. Update Excel export in `ExcelExporter.java`
4. Update prompt template in `PromptBuilder.java`

## 📚 Development

### Building from Source

```bash
mvn clean install
```

### Running Tests

```bash
mvn test
```

### Creating Executable JAR

```bash
mvn clean package
```

The executable JAR will be in `target/ai-test-case-generator-1.0.0.jar`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

AI Test Case Generator Team

## 🙏 Acknowledgments

- Apache POI for Excel generation capabilities
- Jackson for JSON processing
- Ollama/LM Studio/LocalAI teams for local LLM solutions

## 📞 Support

For issues and questions:

1. Check the troubleshooting section
2. Review the configuration settings
3. Ensure your local LLM is properly configured
4. Check the logs in the console output

## 🔜 Future Enhancements

- [ ] Support for CSV export
- [ ] GUI interface option
- [ ] Batch processing of multiple requirement files
- [ ] Test case templates
- [ ] Integration with test management tools (Jira, TestRail)
- [ ] Support for multiple output formats (HTML, PDF)
- [ ] Configuration file for advanced settings
- [ ] Test case priority calculator based on requirements
- [ ] Support for requirement traceability matrix

---

**Version**: 1.0.0  
**Last Updated**: March 2026
