"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestForSummary = RequestForSummary;
const generative_ai_1 = require("@google/generative-ai");
const prompts_1 = require("./prompts");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });
async function RequestForSummary(contents) {
    const result = await model.generateContent({
        contents: contents,
        generationConfig: {
            maxOutputTokens: 5000,
            temperature: 0.5,
        },
        systemInstruction: (0, prompts_1.getSystemPrompt)()
    });
    return result.response.text();
}
