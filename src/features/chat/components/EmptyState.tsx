
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

interface EmptyStateProps {
  onSendMessage: (content: string) => void;
}

export default function EmptyState({ onSendMessage }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 animate-fade-in">
      <div className="rounded-full bg-primary/10 p-3 mb-4">
        <Brain className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Start a conversation with AI</h2>
      <p className="text-muted-foreground max-w-md">
        Ask questions, get creative responses, or discuss complex topics. This AI can help with coding problems, explain concepts, or just chat.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="text-sm" 
          onClick={() => {
            const content = "Can you explain how neural networks work in simple terms?";
            onSendMessage(content);
          }}
        >
          "Explain neural networks"
        </Button>
        <Button 
          variant="outline" 
          className="text-sm" 
          onClick={() => {
            const content = "What are the best practices for writing clean React components?";
            onSendMessage(content);
          }}
        >
          "React best practices"
        </Button>
      </div>
    </div>
  );
}
