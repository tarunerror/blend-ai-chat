
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowUpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [message]);

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
    <div className="relative glass-card rounded-2xl p-2 transition-all duration-200">
      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "min-h-[60px] resize-none border-0 bg-transparent p-3 focus-visible:ring-0 focus-visible:ring-offset-0",
            "placeholder:text-muted-foreground/50"
          )}
          disabled={isLoading}
        />
        <Button
          size="icon"
          className={cn(
            "mb-2 mr-2 h-10 w-10 rounded-full bg-primary text-primary-foreground transition-all", 
            "hover:bg-primary/90",
            isLoading ? "opacity-50 cursor-not-allowed" : "hover-scale"
          )}
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? (
            <Sparkles className="h-5 w-5 animate-pulse" />
          ) : (
            <ArrowUpCircle className="h-5 w-5" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
}
