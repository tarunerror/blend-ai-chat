
import { Button } from "@/components/ui/button";
import { Brain, Code, Sparkles, Lightbulb, PenTool, BookOpenText, Zap, GitBranch, Coffee, Globe } from "lucide-react";

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
    },
    {
      icon: <GitBranch className="h-4 w-4 text-rose-500" />,
      text: "Git workflow",
      prompt: "Explain a professional Git workflow for a team of developers."
    },
    {
      icon: <Globe className="h-4 w-4 text-teal-500" />,
      text: "Travel recommendations",
      prompt: "What are some underrated travel destinations I should visit?"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-8 animated-circles animated-bg">
      <div className="relative mb-8">
        <div className="absolute -inset-10 rounded-full bg-primary/5 animate-pulse"></div>
        <div className="rounded-full bg-primary/10 p-6 mb-2 float-animation shadow-lg effect-3d">
          <Brain className="h-12 w-12 text-primary" />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-2 -mt-6 -mr-6">
          <Zap className="h-8 w-8 text-amber-500/70 animate-pulse" />
        </div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4">
          <Coffee className="h-6 w-6 text-primary/50 animate-pulse" style={{animationDelay: '1s'}} />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold mb-4 gradient-text">Start a conversation with AI</h2>
      <p className="text-muted-foreground max-w-md mb-10 text-lg">
        Ask questions, get creative responses, or discuss complex topics. 
        This AI can help with coding problems, explain concepts, or just chat.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {suggestions.map((suggestion, index) => (
          <Button 
            key={index}
            variant="outline" 
            className="flex items-center justify-start gap-3 py-8 px-4 h-auto hover-scale group overflow-hidden relative shimmer message-card bg-background/80 effect-3d"
            onClick={() => onSendMessage(suggestion.prompt)}
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-accent group-hover:bg-primary/20 transition-colors">
              {suggestion.icon}
            </span>
            <span className="text-left font-medium">{suggestion.text}</span>
            <Sparkles className="h-4 w-4 absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
          </Button>
        ))}
      </div>
    </div>
  );
}
