
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowUpCircle, Wand2 } from "lucide-react";
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
          <div className="absolute left-2 top-2 opacity-50">
            <Wand2 size={16} className={cn("text-primary", message.length > 0 && "animate-wiggle")} />
          </div>
          <Textarea
            ref={textareaRef}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "min-h-[44px] sm:min-h-[60px] resize-none border-0 bg-transparent pl-8 p-2 sm:p-3 focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-muted-foreground/50 text-sm",
              "transition-all duration-300"
            )}
            disabled={isLoading}
          />
          <div className={cn(
            "absolute bottom-2 right-2 text-xs text-muted-foreground/50",
            message.length > 0 ? "opacity-100" : "opacity-0",
            "transition-opacity duration-200"
          )}>
            {message.length}
          </div>
        </div>
        <Button
          type="submit"
          size="icon"
          className={cn(
            "mb-1 mr-1 h-8 w-8 sm:h-10 sm:w-10 rounded-full text-primary-foreground transition-all", 
            isLoading ? "bg-accent animate-pulse" : "bg-primary hover:bg-primary/90 hover-scale",
            "shadow-md"
          )}
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? (
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
          ) : (
            <ArrowUpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}
