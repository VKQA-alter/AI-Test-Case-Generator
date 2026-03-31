# AI Test Case Generator - Next.js Migration

This folder contains a scaffolded Next.js + TypeScript migration of the Java project.

Quick start:

```bash
	cd nextjs
	npm install
	npm run dev
```

The API endpoint `POST /api/generate` accepts the same JSON body as the original Java service and returns an Excel file.

Environment variables

- `LLM_API_URL` (optional) — LLM endpoint, default `http://localhost:11434/api/generate`
- `LLM_MODEL` (optional) — model to request (default `llama2`)
- `LLM_API_KEY` (optional) — API key for OpenAI-like services

Create `.env` in `nextjs/` with the variables if needed.

Tests

```bash
cd nextjs
npm test
```

CI

A GitHub Actions workflow is included at `.github/workflows/ci.yml` to run tests and build the app.
