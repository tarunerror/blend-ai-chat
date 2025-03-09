
import { ChatMessage } from "@/types/chat";

// Updated list of free models on OpenRouter (with corrected models)
export const AVAILABLE_MODELS: { id: string; name: string; provider: string; description: string; maxTokens: number; strengths?: string[] }[] = [
  {
    id: "nvidia/llama-3.1-nemotron-70b-instruct",
    name: "Nemotron 70B",
    provider: "NVIDIA",
    description: "Powerful large language model from NVIDIA",
    maxTokens: 8192,
    strengths: ["Context understanding", "Complex reasoning", "Knowledge depth"]
  },
  {
    id: "google/gemini-2.0-flash-thinking-exp-1219:free",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    description: "Fast and efficient model with broad capabilities",
    maxTokens: 8192,
    strengths: ["Speed", "Efficient responses", "Wide knowledge base"]
  },
  {
    id: "meta-llama/llama-3.2-11b-vision-instruct",
    name: "Llama 3.2 Vision",
    provider: "Meta",
    description: "Multimodal model with vision capabilities",
    maxTokens: 16384,
    strengths: ["Image understanding", "Visual reasoning", "Instruction following"]
  },
  {
    id: "qwen/qwen2.5-vl-72b-instruct",
    name: "Qwen 2.5 VL",
    provider: "Alibaba",
    description: "Large vision-language model with advanced capabilities",
    maxTokens: 8192,
    strengths: ["Multimodal understanding", "Language precision", "Visual comprehension"]
  },
  {
    id: "cognitivecomputations/dolphin-mixtral-8x22b",
    name: "Dolphin Mixtral",
    provider: "CogComp",
    description: "Large mixtral-based model with enhanced reasoning capabilities",
    maxTokens: 8192,
    strengths: ["Creative writing", "Detailed responses", "Advanced reasoning"]
  },
  {
    id: "deepseek/deepseek-r1",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    description: "Reasoning-focused model with broad knowledge",
    maxTokens: 8192,
    strengths: ["Logical reasoning", "Knowledge application", "Coherent explanations"]
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
