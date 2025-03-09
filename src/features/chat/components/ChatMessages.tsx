
import { ChatMessage as ChatMessageType } from "@/types/chat";
import ChatMessage from "@/components/ChatMessage";
import { Loader2, Brain, Sparkles, Lightbulb } from "lucide-react";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isThinking: boolean;
  thinkingText: string;
  isLoading: boolean;
  realTimeThinking?: string[];
  streamingMessageId?: string;
}

export default function ChatMessages({ 
  messages, 
  isThinking, 
  thinkingText, 
  isLoading,
  realTimeThinking = [],
  streamingMessageId
}: ChatMessagesProps) {
  return (
    <>
      {messages.map((msg, i) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          isLast={i === messages.length - 1}
          streaming={msg.id === streamingMessageId}
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
            <div className="mt-6 ml-10 sm:ml-16 space-y-4 max-w-3xl animate-fade-in">
              <div className="p-5 bg-secondary/20 rounded-lg border border-border/40 effect-3d shadow-glow">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium gradient-text">AI's Thought Process</span>
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
                  <Sparkles className="h-4 w-4 text-primary/70 animate-pulse" />
                </div>
                
                <div className="space-y-3">
                  {realTimeThinking.map((thought, idx) => {
                    // Determine if this is the active thinking line (most recent)
                    const isActive = idx === realTimeThinking.length - 1;
                    
                    return (
                      <div 
                        key={idx} 
                        className={`
                          py-2.5 px-4 rounded-md text-sm relative overflow-hidden
                          ${isActive 
                            ? 'border-l-2 border-primary bg-background shadow-glow thinking-line' 
                            : 'bg-background/40 opacity-80'}
                        `}
                        style={{ 
                          animationDelay: `${idx * 0.1}s`,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div className="flex items-start gap-2">
                          {isActive ? (
                            <Lightbulb className="h-4 w-4 text-primary mt-0.5 animate-pulse" />
                          ) : (
                            <div className="h-4 w-4 rounded-full bg-primary/20 mt-0.5 flex items-center justify-center">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                            </div>
                          )}
                          <span className={isActive ? 'font-medium' : ''}>{thought}</span>
                        </div>
                        
                        {/* Add subtle background animation for the active thought */}
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent shimmer"></div>
                        )}
                      </div>
                    );
                  })}
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
