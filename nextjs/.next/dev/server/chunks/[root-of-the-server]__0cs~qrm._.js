module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/Desktop/AI Test Case Generator/nextjs/src/utils/promptBuilder.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildPrompt",
    ()=>buildPrompt
]);
function buildPrompt(requirements) {
    return `You are a senior QA engineer with strong experience in software testing.\n\nRequirements:\n${requirements}\n\nInstructions:\n1. Identify functional scenarios from the requirement.\n2. Generate Positive test cases.\n3. Generate Negative test cases.\n4. Generate Edge test cases if applicable.\n5. Ensure test cases cover validation, boundary conditions, and incorrect user actions.\n6. Return the output strictly in JSON format.\n\nEach test case must contain: testCaseId, module, description, steps (array), expectedResult, type, priority.\n\nReturn the output in the following JSON structure: {"testCases": [{"testCaseId":"","module":"","description":"","steps":[],"expectedResult":"","type":"","priority":""}]}\n\nDo not return explanations or markdown.`;
}
}),
"[project]/Desktop/AI Test Case Generator/nextjs/src/lib/llmClient.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "generateResponse",
    ()=>generateResponse
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/Desktop/AI Test Case Generator/nextjs/node_modules/axios)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$node_modules$2f$axios$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$node_modules$2f$axios$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
async function generateResponse(prompt, opts) {
    const apiUrl = opts.apiUrl || "http://localhost:11434/api/generate";
    const model = opts.model || "llama2";
    const apiKey = opts.apiKey || "";
    const body = buildRequestBody(apiUrl, model, prompt);
    const headers = {
        "Content-Type": "application/json"
    };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
    const res = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$node_modules$2f$axios$29$__["default"].post(apiUrl, body, {
        headers,
        timeout: 300_000
    });
    return extractResponse(res.data);
}
function buildRequestBody(apiUrl, model, prompt) {
    if (apiUrl.includes("ollama") || apiUrl.includes("11434")) {
        return {
            model,
            prompt,
            stream: false,
            format: "json"
        };
    }
    if (apiUrl.includes("openai.com") || apiUrl.includes("/chat/completions")) {
        return {
            model,
            messages: [
                {
                    role: "system",
                    content: "You are a helpful QA engineer assistant that generates test cases in JSON format."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        };
    }
    return {
        model,
        prompt
    };
}
function extractResponse(data) {
    if (!data) return "";
    if (typeof data === "string") return data;
    if (data.response) return data.response;
    if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
        const first = data.choices[0];
        if (first.message && first.message.content) return first.message.content;
        if (first.text) return first.text;
    }
    try {
        return JSON.stringify(data);
    } catch (e) {
        return String(data);
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/Desktop/AI Test Case Generator/nextjs/src/lib/testCaseGenerator.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "generateTestCases",
    ()=>generateTestCases
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$src$2f$utils$2f$promptBuilder$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/AI Test Case Generator/nextjs/src/utils/promptBuilder.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$src$2f$lib$2f$llmClient$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/AI Test Case Generator/nextjs/src/lib/llmClient.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$src$2f$lib$2f$llmClient$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$src$2f$lib$2f$llmClient$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
function cleanJsonResponse(response) {
    let s = response.replace(/```json\s*/g, "").replace(/```/g, "");
    const firstBrace = s.indexOf("{");
    if (firstBrace > 0) s = s.substring(firstBrace);
    const lastBrace = s.lastIndexOf("}");
    if (lastBrace > 0 && lastBrace < s.length - 1) s = s.substring(0, lastBrace + 1);
    s = s.replace(/"test\s*Cases"\s*:/gi, '"testCases":');
    s = s.replace(/"test_cases"\s*:/gi, '"testCases":');
    s = s.replace(/"testcases"\s*:/gi, '"testCases":');
    return s.trim();
}
async function generateTestCases(requirements, opts) {
    const prompt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$src$2f$utils$2f$promptBuilder$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["buildPrompt"])(requirements);
    const llmResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$src$2f$lib$2f$llmClient$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["generateResponse"])(prompt, opts);
    const cleaned = cleanJsonResponse(llmResponse);
    const parsed = JSON.parse(cleaned);
    const testCases = parsed.testCases;
    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
        throw new Error("No test cases parsed from LLM response");
    }
    return testCases;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/Desktop/AI Test Case Generator/nextjs/src/lib/exporter.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildExcelBuffer",
    ()=>buildExcelBuffer
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$exceljs__$5b$external$5d$__$28$exceljs$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$node_modules$2f$exceljs$29$__ = __turbopack_context__.i("[externals]/exceljs [external] (exceljs, cjs, [project]/Desktop/AI Test Case Generator/nextjs/node_modules/exceljs)");
;
async function buildExcelBuffer(testCases) {
    const workbook = new __TURBOPACK__imported__module__$5b$externals$5d2f$exceljs__$5b$external$5d$__$28$exceljs$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$node_modules$2f$exceljs$29$__["default"].Workbook();
    const sheet = workbook.addWorksheet("Test Cases");
    sheet.columns = [
        {
            header: "Test Case ID",
            key: "testCaseId",
            width: 20
        },
        {
            header: "Module",
            key: "module",
            width: 20
        },
        {
            header: "Description",
            key: "description",
            width: 40
        },
        {
            header: "Steps",
            key: "steps",
            width: 60
        },
        {
            header: "Expected Result",
            key: "expectedResult",
            width: 40
        },
        {
            header: "Type",
            key: "type",
            width: 12
        },
        {
            header: "Priority",
            key: "priority",
            width: 12
        }
    ];
    testCases.forEach((tc)=>{
        sheet.addRow({
            testCaseId: tc.testCaseId,
            module: tc.module || "",
            description: tc.description || "",
            steps: Array.isArray(tc.steps) ? tc.steps.join("\n") : tc.steps || "",
            expectedResult: tc.expectedResult || "",
            type: tc.type || "",
            priority: tc.priority || ""
        });
    });
    const buf = await workbook.xlsx.writeBuffer();
    return Buffer.from(buf);
}
}),
"[project]/Desktop/AI Test Case Generator/nextjs/src/lib/webTestCaseService.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "generateAndExport",
    ()=>generateAndExport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$src$2f$lib$2f$testCaseGenerator$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/AI Test Case Generator/nextjs/src/lib/testCaseGenerator.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$src$2f$lib$2f$exporter$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/AI Test Case Generator/nextjs/src/lib/exporter.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$src$2f$lib$2f$testCaseGenerator$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$src$2f$lib$2f$testCaseGenerator$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function generateAndExport(request, opts) {
    if (!request || !request.requirements || request.requirements.trim() === "") {
        throw new Error("Requirements cannot be empty");
    }
    const allTestCases = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$src$2f$lib$2f$testCaseGenerator$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["generateTestCases"])(request.requirements, opts);
    const filtered = request.testTypes && request.testTypes.length > 0 ? allTestCases.filter((tc)=>tc.type && request.testTypes.map((t)=>t.toLowerCase()).includes(tc.type.toLowerCase())) : allTestCases;
    if (!filtered || filtered.length === 0) {
        throw new Error("No test cases generated or all filtered out");
    }
    const buffer = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$src$2f$lib$2f$exporter$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["buildExcelBuffer"])(filtered);
    return buffer;
} // Excel export is implemented in src/lib/exporter.ts
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/Desktop/AI Test Case Generator/nextjs/src/pages/api/generate.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$dotenv__$5b$external$5d$__$28$dotenv$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$node_modules$2f$dotenv$29$__ = __turbopack_context__.i("[externals]/dotenv [external] (dotenv, cjs, [project]/Desktop/AI Test Case Generator/nextjs/node_modules/dotenv)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$src$2f$lib$2f$webTestCaseService$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/AI Test Case Generator/nextjs/src/lib/webTestCaseService.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$src$2f$lib$2f$webTestCaseService$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$src$2f$lib$2f$webTestCaseService$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
__TURBOPACK__imported__module__$5b$externals$5d2f$dotenv__$5b$external$5d$__$28$dotenv$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$node_modules$2f$dotenv$29$__["default"].config();
async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    try {
        const body = req.body;
        if (!body || !body.requirements || body.requirements.trim() === "") {
            return res.status(400).json({
                error: "Requirements cannot be empty"
            });
        }
        const opts = {
            apiUrl: process.env.LLM_API_URL || "http://localhost:11434/api/generate",
            model: process.env.LLM_MODEL || "llama2",
            apiKey: process.env.LLM_API_KEY || null
        };
        const buffer = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AI__Test__Case__Generator$2f$nextjs$2f$src$2f$lib$2f$webTestCaseService$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["generateAndExport"])(body, opts);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", 'attachment; filename="test_cases.xlsx"');
        return res.status(200).send(buffer);
    } catch (e) {
        console.error("=== API Generate Error ===");
        console.error("Error:", e);
        console.error("Stack:", e.stack);
        return res.status(500).json({
            error: e.message || String(e)
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0cs~qrm._.js.map