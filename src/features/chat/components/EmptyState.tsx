
import { Button } from "@/components/ui/button";
import { Brain, Code, Sparkles, Lightbulb, PenTool, BookOpenText } from "lucide-react";

interface EmptyStateProps {
  onSendMessage: (content: string) => void;
}

export default function EmptyState({ onSendMessage }: EmptyStateProps) {
  const suggestions = [
    {
      icon: <Code className="h-4 w-4 text-primary" />,
      text: "Explain React hooks",
      prompt: "Can you explain how React hooks work and give some examples of common hooks?"
    },
    {
      icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
      text: "Creative story ideas",
      prompt: "Generate 5 creative story ideas involving time travel and parallel universes."
    },
    {
      icon: <PenTool className="h-4 w-4 text-blue-500" />,
      text: "Write a poem",
      prompt: "Write a short poem about technology and nature."
    },
    {
      icon: <BookOpenText className="h-4 w-4 text-green-500" />,
      text: "Explain quantum physics",
      prompt: "Explain quantum physics in simple terms that a 10-year-old could understand."
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 animate-fade-in">
      <div className="relative">
        <div className="rounded-full bg-primary/10 p-4 mb-6 animate-float shadow-lg">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        
        {/* Decorative background elements */}
        <div className="animated-blob top-[-100px] left-[-100px]"></div>
        <div className="animated-blob right-[-120px] bottom-[-80px] delay-1000"></div>
      </div>
      
      <h2 className="text-2xl font-bold mb-3 gradient-text">Start a conversation with AI</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Ask questions, get creative responses, or discuss complex topics. 
        This AI can help with coding problems, explain concepts, or just chat.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {suggestions.map((suggestion, index) => (
          <Button 
            key={index}
            variant="outline" 
            className="flex items-center justify-start gap-2 text-sm py-6 hover-scale group overflow-hidden relative"
            onClick={() => onSendMessage(suggestion.prompt)}
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent group-hover:bg-primary/20 transition-colors">
              {suggestion.icon}
            </span>
            <span className="text-left font-medium">{suggestion.text}</span>
            <Sparkles className="h-4 w-4 absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
          </Button>
        ))}
      </div>
    </div>
  );
}
