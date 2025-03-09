
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpCircle, Flame, MessageSquare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  const [isFocused, setIsFocused] = useState(false);

  // Auto-resize the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, isMobile ? 80 : 200)}px`;
    }
  }, [message, isMobile]);

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading) {
      onSendMessage(trimmedMessage);
      setMessage("");
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "inherit";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={cn(
      "relative rounded-xl transition-all duration-300 mx-auto max-w-full",
      isFocused ? "shadow-sm" : "",
      isMobile ? "p-1.5" : "p-1.5"
    )}>
      <form 
        className="flex items-end gap-1 sm:gap-1.5 bg-background/30 backdrop-blur-md border border-border/50 rounded-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <div className="flex-1 flex items-center">
          <div className="pl-3 sm:pl-4 text-muted-foreground">
            <MessageSquare size={16} className="text-muted-foreground/70" />
          </div>
          <Textarea
            ref={textareaRef}
            placeholder="Ask me anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "min-h-[40px] sm:min-h-[48px] max-h-32 resize-none border-0 bg-transparent pl-2 pr-2 py-2.5 focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-muted-foreground/50 text-xs sm:text-sm rounded-lg",
              "transition-all duration-300 overflow-hidden",
            )}
            disabled={isLoading}
          />
        </div>
        
        <div className="flex items-center pr-1.5 sm:pr-2">
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className={cn(
              "h-7 w-7 sm:h-9 sm:w-9 rounded-full transition-all",
              message.trim() ? "bg-primary/90 text-primary-foreground hover:bg-primary/80" : "text-muted-foreground/50 cursor-not-allowed",
              isLoading && "pointer-events-none"
            )}
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? (
              <Sparkles className="h-3.5 w-3.5 sm:h-5 sm:w-5 animate-pulse" />
            ) : (
              <ArrowUpCircle className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
      
      {isMobile && (
        <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-2 py-1.5">
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs rounded-full border-border/50 bg-background/80 backdrop-blur-sm">
            <Flame className="h-3 w-3 mr-1 text-orange-500" />
            Creative
          </Button>
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs rounded-full border-border/50 bg-background/80 backdrop-blur-sm">
            <span className="text-primary text-xs">{"<>"}</span>
            <span className="ml-1">Code</span>
          </Button>
        </div>
      )}
    </div>
  );
}
