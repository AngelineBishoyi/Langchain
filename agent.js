import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import { createRetrieverTool } from "langchain/tools/retriever";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  try {
    const searchRetriever = new TavilySearchAPIRetriever({
      k: 3,
      apiKey: process.env.TAVILY_API_KEY,
    });

    const searchTool = createRetrieverTool(searchRetriever, {
      name: "tavily_search",
      description: "Search the web for current information",
    });

    const tools = [searchTool];

    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-pro",
      max_output_tokens: "8192",
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant. Use tools when needed to answer questions accurately."],
      ["placeholder", "{chat_history}"],
      ["human", "{input}"],
      ["placeholder", "{agent_scratchpad}"],
    ]);

    const agent = createToolCallingAgent({ llm, tools, prompt });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
    });

    const result = await agentExecutor.invoke({
      input: "What is the weather in Jeypore, Odisha?",
      chat_history: "",
      agent_scratchpad: "",
    });

    console.log(" Result:\n", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(" Error:", error.message || error);
  }
}

main();

