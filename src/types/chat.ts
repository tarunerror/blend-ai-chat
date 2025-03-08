
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  model?: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
  strengths?: string[];
}

export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  coverImage: string;
  publishedAt: string;
  readingTimeMinutes: number;
  author: {
    name: string;
    profileImage?: string;
  };
  tags: string[];
}
