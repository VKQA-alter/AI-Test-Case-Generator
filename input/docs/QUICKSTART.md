# Quick Start Guide - AI Test Case Generator

## 🚀 5-Minute Quick Start

### Prerequisites Check

- [ ] Node.js 18+ installed (`node -v`)
- [ ] npm 8+ installed (`npm -v`)
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

### Step 3: Configure (30 seconds)

**Create .env file:**

```bash
cd nextjs

# Create .env file
# Windows
echo LLM_API_URL=http://localhost:11434/api/generate > .env
echo LLM_MODEL=phi >> .env

# Linux/Mac
cat > .env << EOF
LLM_API_URL=http://localhost:11434/api/generate
LLM_MODEL=phi
EOF
```

The configuration is now set up for Ollama with phi model on localhost.

### Step 4: Install Dependencies (1 minute)

```bash
cd nextjs
npm install --legacy-peer-deps
```

Wait for the installation to complete.

### Step 5: Start the Application (10 seconds)

```bash
npm run dev
```

You should see:

```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 6: Generate Test Cases (1 minute)

1. Open your browser to [http://localhost:3000](http://localhost:3000)
2. You'll see a text area with a sample requirement already filled in
3. Check the test types you want (Positive, Negative, Edge)
4. Select format (Excel or JSON)
5. Click **Generate Test Cases**
6. Wait a few seconds while the LLM generates the test cases
7. The file will automatically download!

### Step 7: Open the Results

**For Excel format:**
- Open the downloaded `.xlsx` file in Microsoft Excel, LibreOffice Calc, or Google Sheets
- You'll see beautifully formatted test cases with headers, steps, and priorities

**For JSON format:**
- Open the downloaded `.json` file in any text editor
- You'll see structured JSON data with all test case details

---

## 🎯 What's Next?

### Try Your Own Requirements

Replace the sample text with your own software requirements:

```
As a user, I want to search for products by category so that I can find items quickly.
```

Then generate test cases!

### Customize Test Generation

**Select Specific Test Types:**
- ✅ Positive - Happy path scenarios
- ✅ Negative - Error conditions
- ✅ Edge - Boundary cases

Uncheck any types you don't need to get focused results.

### Try Different LLMs

**OpenAI GPT (Higher Quality):**

Edit `nextjs/.env`:

```bash
LLM_API_URL=https://api.openai.com/v1/chat/completions
LLM_MODEL=gpt-4
LLM_API_KEY=sk-your-api-key-here
```

**LM Studio (Alternative Local):**

```bash
LLM_API_URL=http://localhost:1234/v1/chat/completions
LLM_MODEL=local-model
```

---

## 🚨 Troubleshooting

### Problem: "Connection refused" error

**Solution:** Make sure Ollama is running:

```bash
# Check if Ollama is running
ollama list

# If not, start it (it should auto-start)
# Windows: Check system tray
# Mac: Check menu bar
# Linux: Run `ollama serve` in a separate terminal
```

### Problem: "Model not found"

**Solution:** Pull the model:

```bash
ollama pull phi
```

### Problem: npm install fails

**Solution:** Use the legacy peer deps flag:

```bash
npm install --legacy-peer-deps
```

### Problem: Port 3000 already in use

**Solution:** Use a different port:

```bash
# Windows
$env:PORT=3001; npm run dev

# Linux/Mac
PORT=3001 npm run dev
```

---

## 📚 Learn More

- [Full README](../../README.md) - Complete documentation
- [Project Summary](PROJECT_SUMMARY.md) - Migration details
- [Prompt Template](PROMPT_TEMPLATE.md) - Customize LLM prompts

---

## ✅ Checklist

After completing this quick start, you should be able to:

- ✅ Start Ollama and load a model
- ✅ Install and run the Next.js application
- ✅ Generate test cases from requirements
- ✅ Download and view Excel/JSON output
- ✅ Customize requirements and test types
- ✅ Troubleshoot common issues

**Total Time:** ~5-7 minutes

**You're ready to generate test cases! 🎉**
