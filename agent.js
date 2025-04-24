
import {ChatGoogleGenerativeAI} from "@langchain/google-genai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import dotenv from "dotenv"

import {tavily} from "@tavily/core"

import { createReactAgent } from "@langchain/langgraph/prebuilt";




dotenv.config()
const model = new ChatGoogleGenerativeAI({
    GoogleAPIKey:process.env.GOOGLE_API_KEY,
    model: "gemini-1.5-flash",
  
})

const prompt = ChatPromptTemplate.fromMessages([
  { role: "system", content: "You are a helpful assistant called Dracarys." },
  { role: "user", content: "{input}" },
  new MessagesPlaceholder("agent_scratchPad")
]);
const client = new tavily({
    apiKey: process.env.TAVILY_API_KEY, 
  });


const tools = [
    {
      name: "tavily_search_tool",
      description: "Searches for info using Tavily API",
      async call(input) {
        const result = await client.search({ query: input });
        return JSON.stringify(result);
      }
    }
];

const agent = await createReactAgent({
    llm:model,
    tools,

});


const response= await agent.invoke({
    input:"How you doin?", 
   
})

console.log(response);

