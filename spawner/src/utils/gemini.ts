
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt } from "./prompts";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || "");

const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });


export async function RequestForSummary(contents:any){
    const result = await model.generateContent({
        contents: contents,
        generationConfig: {
          maxOutputTokens: 5000,
          temperature: 0.5,
        },
        systemInstruction:getSystemPrompt()
    });
    
    return result.response.text()
}

