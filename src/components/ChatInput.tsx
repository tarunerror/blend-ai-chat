
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowUpCircle, Wand2, Zap, Lightbulb } from "lucide-react";
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
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, isMobile ? 80 : 200)}px`;
    }
  }, [message, isMobile]);

  // Detect when user is typing
  useEffect(() => {
    if (message.length > 0) {
      setIsTyping(true);
      
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      
      typingTimeout.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    } else {
      setIsTyping(false);
    }
    
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, [message]);

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    console.log("Trying to send message:", trimmedMessage, "isLoading:", isLoading);
    
    if (trimmedMessage && !isLoading) {
      console.log("Sending message from input:", trimmedMessage);
      onSendMessage(trimmedMessage);
      setMessage("");
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "inherit";
      }
    } else {
      console.log("Not sending: empty message or loading state");
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
      "relative rounded-xl sm:rounded-2xl p-1 sm:p-2 transition-all duration-300",
      isFocused 
        ? "shadow-glow gradient-border" 
        : "glass-card"
    )}>
      <form 
        className="flex items-end gap-1 sm:gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <div className="relative flex-1">
          <div className="absolute left-3 top-3">
            {isTyping ? (
              <Zap size={18} className="text-primary animate-pulse" />
            ) : (
              <Lightbulb size={16} className={cn("text-muted-foreground/50", message.length > 0 && "text-primary/80")} />
            )}
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
              "min-h-[50px] sm:min-h-[60px] resize-none border-0 bg-transparent pl-10 p-3 sm:p-4 focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-muted-foreground/50 text-sm rounded-lg",
              "transition-all duration-300",
              isFocused ? "bg-background" : "bg-transparent"
            )}
            disabled={isLoading}
          />
          <div className={cn(
            "absolute bottom-2 right-2 text-xs",
            message.length > 0 ? "text-primary/80" : "text-muted-foreground/30",
            "transition-opacity duration-200"
          )}>
            {message.length > 0 && `${message.length} characters`}
          </div>
        </div>
        <Button
          type="submit"
          size="icon"
          className={cn(
            "mb-1 mr-1 h-10 w-10 sm:h-12 sm:w-12 rounded-full transition-all shadow-glow", 
            isLoading ? "bg-accent animate-pulse" : "bg-primary hover:bg-primary/90 hover-scale",
            "shadow-md effect-3d"
          )}
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? (
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 animate-pulse" />
          ) : (
            <ArrowUpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}
