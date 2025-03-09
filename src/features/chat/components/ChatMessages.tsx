
import { ChatMessage as ChatMessageType } from "@/types/chat";
import ChatMessage from "@/components/ChatMessage";
import { Loader2, Brain } from "lucide-react";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isThinking: boolean;
  thinkingText: string;
  isLoading: boolean;
  realTimeThinking?: string[];
}

export default function ChatMessages({ 
  messages, 
  isThinking, 
  thinkingText, 
  isLoading,
  realTimeThinking = []
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
        <div className="flex flex-col">
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
          
          {realTimeThinking && realTimeThinking.length > 0 && (
            <div className="mt-4 ml-16 space-y-3 max-w-3xl animate-fade-in">
              <div className="p-4 bg-secondary/20 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">AI's Thought Process</span>
                </div>
                <div className="space-y-2">
                  {realTimeThinking.map((thought, idx) => (
                    <div 
                      key={idx} 
                      className={`
                        py-1.5 px-3 bg-background/40 rounded-md text-sm
                        ${idx === realTimeThinking.length - 1 ? 'border-l-2 border-primary animate-pulse' : 'opacity-80'}
                      `}
                      style={{ 
                        animationDelay: `${idx * 0.1}s`,
                        animation: idx === realTimeThinking.length - 1 ? 'fade-in 0.5s ease-out' : 'none'
                      }}
                    >
                      {thought}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {isLoading && !isThinking && (
        <div className="flex items-center gap-4 max-w-4xl mx-auto py-6 animate-fade-in">
          <div className="flex-shrink-0 mt-0.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-glow">
              <span className="text-primary-foreground font-medium text-sm">AI</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm gradient-text">
                Assistant
              </p>
              <span className="text-xs text-muted-foreground typing-indicator">
                Thinking
              </span>
            </div>
            <div className="relative mt-2">
              <div className="h-10 w-full flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary" />
                <div className="h-4 w-24 rounded bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
