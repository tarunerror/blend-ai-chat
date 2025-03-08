
import { ChatMessage as ChatMessageType } from "@/types/chat";
import ChatMessage from "@/components/ChatMessage";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isThinking: boolean;
  thinkingText: string;
  isLoading: boolean;
}

export default function ChatMessages({ 
  messages, 
  isThinking, 
  thinkingText, 
  isLoading 
}: ChatMessagesProps) {
  return (
    <>
      {messages.map((msg, i) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          isLast={i === messages.length - 1}
        />
      ))}
      
      {isThinking && (
        <ChatMessage
          message={{
            id: "thinking",
            role: "assistant",
            content: thinkingText,
            timestamp: Date.now(),
          }}
          isLast={true}
          isThinking={true}
        />
      )}
      
      {isLoading && !isThinking && (
        <div className="flex items-center gap-4 max-w-4xl mx-auto py-6 animate-fade-in">
          <div className="flex-shrink-0 mt-0.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <span className="text-primary-foreground font-medium text-sm">AI</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm">
                Assistant
              </p>
              <span className="text-xs text-muted-foreground">
                Thinking...
              </span>
            </div>
            <div className="mt-2 h-4 w-24 rounded bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer"></div>
          </div>
        </div>
      )}
    </>
  );
}
