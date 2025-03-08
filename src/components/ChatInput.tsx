
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowUpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useMobile();

  // Auto-resize the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, isMobile ? 80 : 200)}px`;
    }
  }, [message, isMobile]);

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
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
    <div className="relative glass-card rounded-xl sm:rounded-2xl p-1 sm:p-2 transition-all duration-200">
      <div className="flex items-end gap-1 sm:gap-2">
        <Textarea
          ref={textareaRef}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "min-h-[44px] sm:min-h-[60px] resize-none border-0 bg-transparent p-2 sm:p-3 focus-visible:ring-0 focus-visible:ring-offset-0",
            "placeholder:text-muted-foreground/50 text-sm"
          )}
          disabled={isLoading}
        />
        <Button
          size="icon"
          className={cn(
            "mb-1 mr-1 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary text-primary-foreground transition-all", 
            "hover:bg-primary/90",
            isLoading ? "opacity-50 cursor-not-allowed" : "hover-scale"
          )}
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? (
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
          ) : (
            <ArrowUpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
}
