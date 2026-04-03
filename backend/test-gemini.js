import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    try {
        const model = new ChatGoogleGenerativeAI({
            modelName: 'gemini-2.5-flash',
            apiKey: process.env.GEMINI_API_KEY
        });
        const res = await model.invoke("Say hi!");
        console.log("Success:", res.content);
    } catch(err) {
        console.error("Error:", err.message);
        console.error(err.stack);
    }
}
test();
