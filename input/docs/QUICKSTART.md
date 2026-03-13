# Quick Start Guide - AI Test Case Generator

## 🚀 5-Minute Quick Start

### Prerequisites Check

- [ ] Java 17+ installed (`java -version`)
- [ ] Maven 3.6+ installed (`mvn -version`)
- [ ] Local LLM installed (Ollama recommended)

### Step 1: Install Ollama (2 minutes)

**Windows:**

1. Download from https://ollama.ai/download
2. Run installer
3. Open terminal and run:

   ```bash
   # For systems with 8GB+ RAM
   ollama pull llama2

   # For systems with 4-8GB RAM (recommended)
   ollama pull phi
   ```

**macOS:**

```bash
brew install ollama

# Choose based on your RAM:
ollama pull llama2    # 8GB+ RAM
ollama pull phi       # 4-8GB RAM (faster, smaller)
```

**Linux:**

```bash
curl -fsSL https://ollama.ai/install.sh | sh

# Choose based on your RAM:
ollama pull llama2    # 8GB+ RAM
ollama pull phi       # 4-8GB RAM (faster, smaller)
```

> **💡 Memory Tip:** If you have less than 8GB RAM, use `phi` model. It's faster and works great!

### Step 2: Verify Ollama is Running

```bash
ollama list
```

You should see your model (e.g., `llama2` or `phi`) in the list.

### Step 3: Configure (Optional - 30 seconds)

**Quick setup with .env file:**

```bash
# Copy example file
copy .env.example .env    # Windows
cp .env.example .env      # Linux/Mac

# Edit .env file - it's already configured for Ollama!
# No changes needed for local Ollama
```

The default `.env` is already set up for Ollama on localhost.

### Step 4: Build the Project (1 minute)

```bash
cd "AI Test Case Generator"
mvn clean package
```

Wait for the build to complete. You should see "BUILD SUCCESS".

### Step 5: Run the Application (1 minute)

**If using llama2 (8GB+ RAM):**

```bash
java -jar target/ai-test-case-generator-1.0.0.jar
```

**If using phi (4-8GB RAM):**

```bash
java -jar target/ai-test-case-generator-1.0.0.jar --model=phi
```

### Step 6: Check Output (1 minute)

Open the generated file:

```
output/testcases.xlsx
```

Done! 🎉

---

## 🎯 Alternative: Run with Maven

Instead of building and running the JAR:

```bash
mvn exec:java -Dexec.mainClass="com.ai.testgen.Main"
```

---s (by RAM):\*\*

````bash
# Small/Fast (2-4GB RAM)
ollama pull tinyllama
java -jar target/ai-test-case-generator-1.0.0.jar --model=tinyllama

# Medium/Balanced (4-8GB RAM) - Recommended
ollama pull phi
java -jar target/ai-test-case-generator-1.0.0.jar --model=phi

# Large/Quality (8GB+ RAM)ustom Configuration

### Use Different LLM Models

**Ollama with different model:**

```bash
ollama pull codellama
java -jar target/ai-test-case-generator-1.0.0.jar --model=codellama
````

**LM Studio:**

1. Start LM Studio local server
2. Run:
   ```bash
   java -jar target/ai-test-case-generator-1.0.0.jar \
     --api-url=http://localhost:1234/v1/completions \
     --model=local-model
   ```

### Use Custom Requirements File

````bash
java -jar target/ai-test-case-generator-1.0.0.jar \
  --input=my-requirements.txt \
  --output=my-testcases.xlsx
```model requires more system memory" (Most Common!)

**Problem:**
````

LLM API returned error code: 500
Response: {"error":"model requires more system memory (5.5 GiB) than is available (4.6 GiB)"}

````

**Solution:** Use a smaller model:

```bash
# Pull a smaller model (works on 4GB+ RAM)
ollama pull phi

# Or try tinyllama (works on 2GB+ RAM)
ollama pull tinyllama

# Then run with the smaller model:
java -jar target/ai-test-case-generator-1.0.0.jar --model=phi
````

**Alternative models by RAM:**

- **2-4GB RAM:** `tinyllama` (fast, basic)
- **4-8GB RAM:** `phi` (recommended, good quality)
- **8GB+ RAM:** `llama2` (best quality)

### Error: "Could not find or load main class"

**Solution:** Rebuild the project:

```bash
mvn clean package
```

### Error: "Connection refused"

**Solution:** Start Ollama:

```bash
ollama serve
```

In another terminal:

```bash
ollama run phi    # or your chosen model
```

In another terminal:

```bash
ollama run llama2
```

### Error: "Requirements file not found"

**Solution:** Check file exists:

```bash
ls input/requirements.txt
```

If missing, create it with your requirements.

### LLM Response is Slow

**Tip:**

- Use smaller models (e.g., `llama2:7b`)
- Reduce requirements text size
- Check system resources

---

## 📝 Editing Requirements

Edit `input/requirements.txt` with any text editor:

```
USER LOGIN FEATURE

Requirements:
1. User must enter username and password
2. System validates credentials
3. Show error for invalid credentials
...
```

Save and run the application again.

---

## 🎓 Next Steps

1. **Read the README.md** for detailed documentation
2. **Read PROJECT.md** for architecture details
3. **Customize the prompt** in `PromptBuilder.java`
4. **Modify Excel format** in `ExcelExporter.java`
5. **Add more test case fields** to `TestCase.java`

---

## 💡 Tips

- **Better Results**: Write clear, detailed requirements
- **More Test Cases**: Ask in the prompt for specific coverage
- **Different Models**: Try different LLMs for various quality/speed tradeoffs
- **Batch Processing**: Create multiple requirement files and run separately

---

## 📞 Getting Help

1. Check error messages in console
2. Verify LLM is running (`curl http://localhost:11434`)
3. Check logs if logging is enabled
4. Review troubleshooting section in README.md

---

**Happy Testing!** 🚀
