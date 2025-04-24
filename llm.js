import {ChatGoogleGenerativeAI} from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv"
import {createStuffDocumentsChain} from "langchain/chains/combine_documents"


dotenv.config()
const model = new ChatGoogleGenerativeAI({
    GoogleAPIKey:process.env.GOOGLE_API_KEY,
    model: "gemini-1.5-flash",
  
})

const prompt = ChatPromptTemplate.fromMessages([
    ["system","You are a helpful assistant that translates {input_language} to {output_language}."],["human","{input}"],
])

 const chain =prompt.pipe(model)




const response= await chain.invoke({
    input_language:"English",
    output_language:"Hindi",
    input:"How you do'in?"
    
})
console.log(response.content);
