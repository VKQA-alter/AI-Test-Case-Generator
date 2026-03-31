# AI Test Case Generator

A modern web application that automatically generates comprehensive test cases from software requirements using Local LLMs or OpenAI GPT.

## 🎯 Features

- **Automated Test Case Generation**: Converts software requirements into structured test cases
- **Web-Based UI**: Modern, responsive React interface with real-time generation
- **Multiple LLM Support**:
  - **Local LLMs**: Ollama, LM Studio, LocalAI (free, private)
  - **OpenAI GPT**: GPT-4, GPT-3.5-turbo (requires API key)
- **Comprehensive Coverage**: Generates positive, negative, and edge test cases
- **Excel Export**: Outputs test cases in a well-formatted Excel file (.xlsx)
- **Clean Architecture**: Next.js API routes with TypeScript type safety
- **Test Type Selection**: Choose which test types to generate via checkboxes
- **Format Options**: Export as Excel or JSON

## 📋 Requirements

- **Node.js 18 or higher**
- **npm or yarn**
- **LLM Option 1**: Local LLM (e.g., Ollama, LM Studio) - Free
- **LLM Option 2**: OpenAI API Key - Paid

## 🏗️ Project Structure

```
ai-test-case-generator/
│
├── nextjs/                                       # Main application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.tsx                        # Main UI component
│   │   │   └── api/
│   │   │       ├── generate.ts                  # Test generation endpoint
│   │   │       └── health.ts                    # Health check
│   │   ├── lib/
│   │   │   ├── llmClient.ts                    # LLM communication
│   │   │   ├── testCaseGenerator.ts            # Generation logic
│   │   │   ├── webTestCaseService.ts           # Service orchestration
│   │   │   └── exporter.ts                     # Excel export (ExcelJS)
│   │   ├── utils/
│   │   │   ├── promptBuilder.ts                # Prompt construction
│   │   │   └── requirementReader.ts            # File reading
│   │   ├── types/
│   │   │   └── index.ts                        # TypeScript interfaces
│   │   └── styles/
│   │       └── Home.module.css                 # Component styles
│   ├── __tests__/                               # Jest tests
│   ├── package.json                             # Dependencies
│   ├── tsconfig.json                            # TypeScript config
│   └── .env                                     # Environment variables
│
├── input/
│   ├── requirements.txt                         # Sample requirements
│   └── docs/                                    # Documentation
│
└── README.md                                    # This file
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
2. Add to `.env` in next step

#### Option C: LM Studio

1. Download LM Studio from [https://lmstudio.ai](https://lmstudio.ai)
2. Load a model and start the local server
3. Default endpoint: `http://localhost:1234`

### Step 2: Install Dependencies

```bash
cd nextjs
npm install --legacy-peer-deps
```

**Note:** The `--legacy-peer-deps` flag is required due to peer dependency constraints.

### Step 3: Configure Environment

Create a `nextjs/.env` file:

**For Local LLM (Ollama with phi model - default):**

```bash
LLM_API_URL=http://localhost:11434/api/generate
LLM_MODEL=phi
```

**For OpenAI GPT:**

```bash
LLM_API_URL=https://api.openai.com/v1/chat/completions
LLM_MODEL=gpt-4
LLM_API_KEY=sk-your-api-key-here
```

### Step 4: Run the Application

```bash
cd nextjs
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 5: Generate Test Cases

1. Enter your software requirement in the text area (or use the default example)
2. Select test types (Positive, Negative, Edge)
3. Choose output format (Excel or JSON)
4. Click **Generate Test Cases**
5. Download the generated file automatically

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `nextjs/` directory:

| Variable      | Description         | Default                               |
| ------------- | ------------------- | ------------------------------------- |
| `LLM_API_URL` | LLM API endpoint    | `http://localhost:11434/api/generate` |
| `LLM_MODEL`   | Model name          | `phi`                                 |
| `LLM_API_KEY` | API key (if needed) | (empty)                               |

### LLM Provider Examples

**Ollama (Default):**

```bash
LLM_API_URL=http://localhost:11434/api/generate
LLM_MODEL=phi
```

**LM Studio:**

```bash
LLM_API_URL=http://localhost:1234/v1/chat/completions
LLM_MODEL=local-model
```

**OpenAI:**

```bash
LLM_API_URL=https://api.openai.com/v1/chat/completions
LLM_MODEL=gpt-4
LLM_API_KEY=sk-your-api-key
```

## 🧪 Testing

Run the test suite:

```bash
cd nextjs
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

## 🏗️ Building for Production

```bash
cd nextjs
npm run build
npm start
```

The production build will be optimized and ready to deploy.

## 📝 API Documentation

### POST /api/generate

Generate test cases from requirements.

**Request Body:**

```json
{
  "requirements": "As a user, I want to log in...",
  "testTypes": ["Positive", "Negative", "Edge"],
  "format": "excel"
}
```

**Response:**

- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (Excel)
- Or `application/json` (JSON format)

### GET /api/health

Health check endpoint.

**Response:**

```json
{
  "status": "OK",
  "service": "Test Case Generator"
}
```

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Validation**: Prevents empty submissions
- **Status Messages**: Clear success/error feedback
- **Test Type Checkboxes**: Select specific test types to generate
- **Format Dropdown**: Choose between Excel and JSON output
- **Auto-download**: Generated files download automatically

## 🔧 Technology Stack

### Frontend

- **Next.js 13.5.6** - React framework
- **React 18.2.0** - UI library
- **TypeScript 5.2.2** - Type safety
- **CSS Modules** - Scoped styling

### Backend

- **Next.js API Routes** - Serverless functions
- **Axios 1.4.0** - HTTP client
- **ExcelJS 4.3.0** - Excel generation

### Testing

- **Jest 29.7.0** - Test framework
- **ts-jest 29.1.0** - TypeScript support

### Development

- **ESLint** - Code linting
- **TypeScript** - Type checking
- **dotenv 16.3.1** - Environment variables

## 🚨 Troubleshooting

### LLM Connection Issues

**Problem:** 500 error when generating test cases

**Solutions:**

1. Ensure Ollama/LM Studio is running: `ollama list`
2. Verify model is pulled: `ollama pull phi`
3. Check `.env` has correct `LLM_API_URL`
4. Test LLM endpoint manually:
   ```bash
   curl http://localhost:11434/api/generate -d '{"model":"phi","prompt":"test"}'
   ```

### npm Install Errors

**Problem:** Peer dependency conflicts

**Solution:** Use the `--legacy-peer-deps` flag:

```bash
npm install --legacy-peer-deps
```

### Port 3000 Already in Use

**Solution:** Kill the process or use a different port:

```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Use different port
PORT=3001 npm run dev
```

## 📚 Documentation

- [Project Summary](input/docs/PROJECT_SUMMARY.md) - Migration details
- [Quick Start](input/docs/QUICKSTART.md) - Fast setup guide
- [Prompt Template](input/docs/PROMPT_TEMPLATE.md) - LLM prompt guide

## 🤝 Contributing

This project has been migrated from Java/Spring Boot to Next.js/TypeScript. All core functionality has been preserved while adding a modern web UI.

## 📜 License

MIT License - See LICENSE file for details

## 🎯 Migration Notes

This project was successfully migrated from:

- **Java 17 + Spring Boot** → **Node.js + Next.js**
- **Maven** → **npm**
- **Apache POI** → **ExcelJS**
- **Apache HttpClient** → **Axios**
- **CLI Interface** → **Web UI**

All original features have been preserved and enhanced with a modern web interface.
