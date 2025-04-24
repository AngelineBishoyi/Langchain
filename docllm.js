import {ChatGoogleGenerativeAI} from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv"
import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";

dotenv.config()
const model = new ChatGoogleGenerativeAI({
    GoogleAPIKey:process.env.GOOGLE_API_KEY,
    model: "gemini-1.5-flash",
  
})
const prompt = ChatPromptTemplate.fromTemplate(
    "Answer the user question.Context: {context} Question :{input}",
)

const chain =prompt.pipe(model)
const loader = new PlaywrightWebBaseLoader("https://js.langchain.com/docs/integrations/llms/");
const docs = await loader.load();



const response= await chain.invoke({
    input:"What is Document loaders?",
    context:docs
})
console.log(response.content);
