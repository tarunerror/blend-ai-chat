
import { ChatMessage } from "@/types/chat";

// Top 5 free models on OpenRouter (these may change, check OpenRouter for current models)
export const AVAILABLE_MODELS: { id: string; name: string; provider: string; description: string; maxTokens: number; strengths?: string[] }[] = [
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    description: "Fast and efficient model for everyday tasks",
    maxTokens: 200000,
    strengths: ["Speed", "Efficiency", "General knowledge"]
  },
  {
    id: "google/gemma-7b-it",
    name: "Gemma 7B",
    provider: "Google",
    description: "Lightweight open model with strong capabilities",
    maxTokens: 8192,
    strengths: ["Lightweight", "Instruction following", "Code generation"]
  },
  {
    id: "meta-llama/llama-3-8b-instruct",
    name: "Llama 3 8B",
    provider: "Meta",
    description: "Compact and capable open model from Meta",
    maxTokens: 8192,
    strengths: ["Text completion", "Creative writing", "Reasoning"]
  },
  {
    id: "mistralai/mistral-7b-instruct",
    name: "Mistral 7B",
    provider: "Mistral AI",
    description: "Powerful instruction-tuned model",
    maxTokens: 8192,
    strengths: ["Instruction following", "Knowledge", "Coherence"]
  },
  {
    id: "gryphe/mythomax-l2-13b",
    name: "MythoMax L2 13B",
    provider: "Gryphe",
    description: "Creative model with wide-ranging knowledge",
    maxTokens: 8192,
    strengths: ["Creativity", "Storytelling", "Detailed responses"]
  }
];

export const DEFAULT_MODEL = AVAILABLE_MODELS[0];

interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

export async function sendChatRequest(
  messages: ChatMessage[],
  apiKey: string,
  modelId: string = DEFAULT_MODEL.id
): Promise<string> {
  // Format messages for OpenRouter API
  const formattedMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.href,
        "X-Title": "Blend AI Chat" // Name of the application
      },
      body: JSON.stringify({
        model: modelId,
        messages: formattedMessages
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data: OpenRouterResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    throw error;
  }
}
