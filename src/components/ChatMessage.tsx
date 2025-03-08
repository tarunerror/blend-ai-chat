
import { useState, useRef, useEffect } from "react";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon, UserIcon } from "lucide-react";
import { AVAILABLE_MODELS } from "@/lib/openrouter";

interface ChatMessageProps {
  message: ChatMessageType;
  isLast?: boolean;
}

export default function ChatMessage({ message, isLast = false }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const modelInfo = message.model ? AVAILABLE_MODELS.find(m => m.id === message.model) : null;

  // Animation when message appears
  useEffect(() => {
    if (isLast && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLast]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      ref={messageRef}
      className={cn(
        "py-6 first:pt-0 last:pb-0",
        isLast && "animate-fade-in"
      )}
    >
      <div className="flex gap-4 max-w-4xl mx-auto">
        <div className="mt-0.5 flex-shrink-0">
          {message.role === "user" ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
              <UserIcon className="h-5 w-5 text-primary" />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <span className="text-primary-foreground font-medium text-sm">AI</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 space-y-2 overflow-hidden">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">
              {message.role === "user" ? "You" : modelInfo?.name || "Assistant"}
            </p>
            {message.role === "assistant" && modelInfo && (
              <span className="text-xs text-muted-foreground">
                {modelInfo.provider}
              </span>
            )}
          </div>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-balance whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          
          {message.role === "assistant" && (
            <div className="flex justify-start pt-2">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-3 w-3" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
