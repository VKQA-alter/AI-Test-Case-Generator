# AI Test Case Generator - Project Documentation

## 📐 Architecture Overview

This document provides detailed information about the project architecture, design decisions, and implementation details of the Next.js/TypeScript application.

## 🏛️ Architecture Pattern

The project follows a **Next.js Pages Router architecture** with clear separation of concerns:

```
┌─────────────────────────────────────┐
│      Presentation Layer (UI)       │
│        pages/index.tsx              │
│     (React Components + UI)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         API Routes Layer            │
│    pages/api/generate.ts            │
│    pages/api/health.ts              │
│  (Next.js Serverless Functions)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Service Layer               │
│   lib/webTestCaseService.ts         │
│   lib/testCaseGenerator.ts          │
│       lib/llmClient.ts              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Utility / Export Layer           │
│   utils/promptBuilder.ts            │
│   utils/requirementReader.ts        │
│       lib/exporter.ts               │
└─────────────────────────────────────┘
```

## 📦 Directory Structure

### `pages/` (Routing and API)

Next.js file-system based routing

- **index.tsx**: Main UI page (React component)
- **api/generate.ts**: Test case generation endpoint (POST)
- **api/health.ts**: Health check endpoint (GET)

### `lib/` (Core Business Logic)

Service layer and business logic

- **llmClient.ts**: Handles HTTP communication with LLM APIs (Ollama, OpenAI)
- **testCaseGenerator.ts**: Orchestrates test case generation workflow
- **webTestCaseService.ts**: Service layer with filtering and export orchestration
- **exporter.ts**: Converts test cases to Excel format using ExcelJS

### `utils/` (Utilities)

Helper functions and utilities

- **promptBuilder.ts**: Constructs prompts for the LLM
- **requirementReader.ts**: File I/O operations for reading requirements

### `types/` (TypeScript Definitions)

Type definitions and interfaces

- **index.ts**: All TypeScript interfaces (TestCase, TestCaseResponse, TestCaseGenerationRequest)

### `styles/` (Styling)

CSS Modules for component styling

- **Home.module.css**: Styles for the main page component

### `__tests__/` (Testing)

Jest test suites

- **exporter.test.ts**: Tests for Excel export functionality
- **promptBuilder.test.ts**: Tests for prompt construction

## 🔄 Data Flow

```
┌──────────────┐
│ User Input   │
│  (Browser)   │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  pages/index.tsx │
│   (React UI)     │
└──────┬───────────┘
       │ POST /api/generate
       ▼
┌──────────────────────┐
│ pages/api/generate.ts│
│   (API Route)        │
└──────┬───────────────┘
       │
       ▼
┌─────────────────────────┐
│ webTestCaseService.ts   │
│ (Service Orchestration) │
└──────┬──────────────────┘
       │
       ▼
┌───────────────────────┐
│ testCaseGenerator.ts  │
│  (Generation Logic)   │
└──────┬────────────────┘
       │
       ├─────────────────────┐
       │                     │
       ▼                     ▼
┌──────────────┐    ┌────────────────┐
│promptBuilder │    │  llmClient.ts  │
│    .ts       │───▶│  (HTTP Call)   │
└──────────────┘    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │   LLM API      │
                    │ (Ollama/GPT)   │
                    └────────┬───────┘
                             │
                             ▼ JSON Response
                    ┌────────────────┐
                    │ testCase       │
                    │ Generator.ts   │
                    │ (Parse JSON)   │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │webTestCase     │
                    │Service.ts      │
                    │(Filter types)  │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ exporter.ts    │
                    │(Excel/JSON)    │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ File Download  │
                    │   (Browser)    │
                    └────────────────┘
```

## 🔧 Component Details

### 1. Main UI Component (`pages/index.tsx`)

**Purpose:** User interface for test case generation

**Key Features:**
- React functional component with hooks
- State management for requirements, test types, format, loading, messages
- Form validation
- API call handling with fetch
- File download logic
- Responsive design

**Technologies:**
- React 18.2.0
- CSS Modules
- TypeScript

**State:**
```typescript
const [requirements, setRequirements] = useState<string>('...');
const [testTypes, setTestTypes] = useState<string[]>(['Positive', 'Negative', 'Edge']);
const [format, setFormat] = useState<string>('excel');
const [isLoading, setIsLoading] = useState<boolean>(false);
const [message, setMessage] = useState<string>('');
```

### 2. Generate API Route (`pages/api/generate.ts`)

**Purpose:** Serverless function to handle test case generation

**Endpoint:** POST /api/generate

**Request Body:**
```typescript
{
  requirements: string;
  testTypes: string[];
  format: 'excel' | 'json';
}
```

**Response:**
- Excel: Binary file with Content-Type `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- JSON: JSON array of test cases

**Error Handling:**
- 400: Bad Request (missing requirements)
- 405: Method Not Allowed
- 500: Internal Server Error

### 3. LLM Client (`lib/llmClient.ts`)

**Purpose:** HTTP communication with LLM APIs

**Supported Providers:**
- Ollama (default)
- OpenAI
- LM Studio
- LocalAI

**Key Function:**
```typescript
async function generateResponse(
  prompt: string,
  apiUrl: string,
  model: string,
  apiKey?: string
): Promise<string>
```

**Features:**
- Auto-detects API format (Ollama vs OpenAI)
- 300s timeout for generation
- Error handling and logging
- Axios-based HTTP client

### 4. Test Case Generator (`lib/testCaseGenerator.ts`)

**Purpose:** Core test case generation logic

**Key Function:**
```typescript
async function generateTestCases(
  requirements: string,
  apiUrl: string,
  model: string,
  apiKey?: string
): Promise<TestCase[]>
```

**Process:**
1. Build prompt using promptBuilder
2. Call LLM via llmClient
3. Clean JSON response (remove markdown, normalize keys)
4. Parse JSON into TestCase objects
5. Return array of test cases

**JSON Cleaning:**
- Removes ```json markdown blocks
- Normalizes key casing (testCaseId, expectedResult)
- Handles malformed responses

### 5. Web Test Case Service (`lib/webTestCaseService.ts`)

**Purpose:** Service layer orchestration

**Key Function:**
```typescript
async function generateAndExport(
  requirements: string,
  testTypes: string[],
  format: string,
  apiUrl: string,
  model: string,
  apiKey?: string
): Promise<{ buffer: Buffer; mimeType: string; fileName: string }>
```

**Features:**
- Test type filtering (Positive, Negative, Edge)
- Format handling (Excel, JSON)
- Service orchestration
- Error handling

### 6. Excel Exporter (`lib/exporter.ts`)

**Purpose:** Generate Excel files from test cases

**Key Function:**
```typescript
async function buildExcelBuffer(testCases: TestCase[]): Promise<Buffer>
```

**Excel Structure:**
- 7 Columns: Test Case ID, Module, Description, Steps, Expected Result, Type, Priority
- Styled headers (grey background, bold, white text)
- Auto-sized columns
- Wrapped text
- Professional formatting

**Technology:** ExcelJS 4.3.0

### 7. Prompt Builder (`utils/promptBuilder.ts`)

**Purpose:** Construct LLM prompts

**Key Function:**
```typescript
function buildPrompt(requirements: string): string
```

**Prompt Structure:**
- Clear instructions for test case generation
- JSON schema specification
- Examples of test types (Positive, Negative, Edge)
- Output format requirements
- Quality guidelines

### 8. Type Definitions (`types/index.ts`)

**Core Interfaces:**

```typescript
interface TestCase {
  testCaseId: string;
  module: string;
  description: string;
  steps: string[];
  expectedResult: string;
  type: 'Positive' | 'Negative' | 'Edge';
  priority: 'High' | 'Medium' | 'Low';
}

interface TestCaseResponse {
  testCases: TestCase[];
}

interface TestCaseGenerationRequest {
  requirements: string;
  testTypes: string[];
  format: string;
}
```

## 🧪 Testing Strategy

### Unit Tests

**Test Framework:** Jest 29.7.0 + ts-jest

**Test Files:**
- `__tests__/exporter.test.ts`
- `__tests__/promptBuilder.test.ts`

**Coverage Areas:**
- Excel buffer generation
- Prompt construction
- Type validation

### CI/CD

**GitHub Actions Workflow:**
- Runs on push/PR
- Installs dependencies
- Runs TypeScript compiler
- Executes test suite
- Builds production bundle

## 🔐 Configuration

### Environment Variables

**File:** `nextjs/.env`

**Variables:**
```bash
LLM_API_URL=http://localhost:11434/api/generate
LLM_MODEL=phi
LLM_API_KEY=sk-optional-api-key
```

**Loading:** dotenv 16.3.1

**Priority:**
1. Environment variables (.env)
2. Default values in code

## 🚀 Deployment

### Development

```bash
npm run dev
```

Starts Next.js dev server with hot reload on port 3000.

### Production

```bash
npm run build
npm start
```

Creates optimized production build and starts server.

### Environment-Specific Config

**Development:**
- Source maps enabled
- Fast refresh enabled
- Detailed error messages

**Production:**
- Minified code
- Optimized bundles
- Error handling only

## 📊 Performance Considerations

### Optimizations

1. **API Routes:** Serverless functions auto-scale
2. **React:** Functional components with hooks (no class overhead)
3. **TypeScript:** Compile-time checks prevent runtime errors
4. **ExcelJS:** Streaming support for large files
5. **Next.js:** Automatic code splitting

### Bottlenecks

1. **LLM Generation:** 10-60s depending on model and complexity
2. **Excel Generation:** ~1-2s for 100 test cases
3. **File Download:** Browser-dependent

## 🔮 Future Enhancements

### Planned Features

1. **Agent-Based Prompts:** Read instructions from agent files
2. **Test Case History:** Save and retrieve previous generations
3. **Batch Processing:** Generate for multiple requirements
4. **Custom Templates:** User-defined prompt templates
5. **Export Formats:** CSV, PDF, Word document support

### Technical Improvements

1. **Docker:** Containerization for easy deployment
2. **Database:** Persist generated test cases
3. **Authentication:** User accounts and API keys
4. **Rate Limiting:** Prevent API abuse
5. **Caching:** Cache LLM responses for identical requirements

## 🎯 Design Decisions

### Why Next.js?

- File-system based routing (simple API creation)
- Serverless functions (no separate backend)
- React integration (modern UI)
- TypeScript support (type safety)
- Production-ready (optimizations built-in)

### Why ExcelJS over Apache POI?

- Native JavaScript (no JVM)
- Buffer-based (no file system dependency)
- Modern API (promises, async/await)
- Active maintenance
- Smaller footprint

### Why Axios over Fetch?

- Better timeout support
- Request/response interceptors
- Automatic JSON parsing
- Error handling
- Wider browser support

### Why TypeScript?

- Compile-time type checking
- Better IDE support
- Self-documenting code
- Refactoring safety
- Modern JavaScript features

## 📚 Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | 13.5.6 | React framework |
| react | 18.2.0 | UI library |
| typescript | 5.2.2 | Type safety |
| axios | 1.4.0 | HTTP client |
| exceljs | 4.3.0 | Excel generation |
| dotenv | 16.3.1 | Environment variables |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| jest | 29.7.0 | Testing framework |
| ts-jest | 29.1.0 | TypeScript support for Jest |
| @types/node | 20.6.0 | Node.js type definitions |
| @types/react | 18.2.22 | React type definitions |
| eslint | 8.49.0 | Code linting |

## 🎓 Lessons Learned

### Migration Insights

1. **Next.js API routes** are excellent replacements for Spring REST controllers
2. **ExcelJS** is feature-complete compared to Apache POI
3. **TypeScript interfaces** cleanly replace Java POJOs
4. **React hooks** simplify state management vs class components
5. **CSS Modules** provide scoped styling without CSS-in-JS overhead

### Best Practices

1. Keep API routes thin (delegate to service layer)
2. Use TypeScript strict mode for maximum safety
3. Separate concerns (lib/ vs utils/ vs pages/)
4. Handle errors at every layer
5. Use environment variables for all configuration

---

**Last Updated:** March 31, 2026  
**Version:** 2.0.0 (Next.js Migration)
