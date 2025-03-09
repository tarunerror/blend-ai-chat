
import { ChatMessage } from "@/types/chat";

// Updated list of free models on OpenRouter (with Nemotron 70B removed)
export const AVAILABLE_MODELS: { id: string; name: string; provider: string; description: string; maxTokens: number; strengths?: string[] }[] = [
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

interface OpenRouterStreamChunk {
  id: string;
  choices: {
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
    index: number;
  }[];
}

export async function sendChatRequest(
  messages: ChatMessage[],
  apiKey: string,
  modelId: string = DEFAULT_MODEL.id,
  onChunk?: (chunk: string) => void
): Promise<string> {
  // Format messages for OpenRouter API
  const formattedMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  try {
    // If no onChunk callback is provided, use the non-streaming version
    if (!onChunk) {
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
    } 
    // Use streaming for word-by-word response
    else {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.href,
          "X-Title": "Blend AI Chat"
        },
        body: JSON.stringify({
          model: modelId,
          messages: formattedMessages,
          stream: true
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorData}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Response body is null");
      }

      let fullContent = "";
      let buffer = "";
      let isCodeBlock = false;
      let codeLanguage = "";
      
      // Process the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            
            try {
              const parsed: OpenRouterStreamChunk = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || "";
              
              if (content) {
                // Process each chunk to identify and format code blocks
                for (let i = 0; i < content.length; i++) {
                  buffer += content[i];
                  
                  // Code block detection 
                  if (buffer.endsWith("```") && !isCodeBlock) {
                    // Opening code block
                    isCodeBlock = true;
                    codeLanguage = "";
                    // Look ahead for language indicator
                    if (content.length > i + 1) {
                      let j = i + 1;
                      while (j < content.length && content[j] !== '\n' && content[j] !== ' ') {
                        codeLanguage += content[j];
                        j++;
                      }
                    }
                  } else if (buffer.endsWith("```") && isCodeBlock) {
                    // Closing code block
                    isCodeBlock = false;
                  }
                  
                  // Send chunk to the callback
                  onChunk(content[i]);
                }
                
                fullContent += content;
              }
            } catch (e) {
              console.error("Error parsing stream chunk:", e);
            }
          }
        }
      }
      
      return fullContent;
    }
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    throw error;
  }
}
