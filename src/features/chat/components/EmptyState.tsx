
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Code, 
  PenLine, 
  Zap, 
  Flame,
  MessageSquare,
  Sparkles,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  onSendMessage: (message: string) => void;
}

const CATEGORIES = [
  { 
    id: "writing", 
    name: "Creative Writing", 
    icon: <PenLine className="h-4 w-4" />,
    color: "text-purple-500",
    prompts: [
      "Write a short story about a time traveler visiting ancient Egypt",
      "Create a poem about the changing seasons",
      "Draft an engaging introduction for an article about space exploration",
      "Write a dialogue between two characters who are opposites"
    ]
  },
  { 
    id: "coding", 
    name: "Coding & Development", 
    icon: <Code className="h-4 w-4" />,
    color: "text-blue-500",
    prompts: [
      "Explain the difference between let, const, and var in JavaScript",
      "Write a Python function to check if a string is a palindrome",
      "How do I set up a basic React component with state?",
      "What are some best practices for API error handling?"
    ]
  },
  { 
    id: "learning", 
    name: "Learning & Explanation", 
    icon: <BookOpen className="h-4 w-4" />,
    color: "text-green-500",
    prompts: [
      "Explain quantum computing in simple terms",
      "What caused the fall of the Roman Empire?",
      "How does photosynthesis work?",
      "Explain the theory of relativity for beginners"
    ]
  }
];

export default function EmptyState({ onSendMessage }: EmptyStateProps) {
  const [activeCategory, setActiveCategory] = useState<string>("writing");
  const isMobile = useIsMobile();
  
  const handleSendExample = (message: string) => {
    onSendMessage(message);
  };

  const activePrompts = CATEGORIES.find(c => c.id === activeCategory)?.prompts || [];
  
  return (
    <div className="w-full space-y-4 sm:space-y-6 px-2 sm:px-4 py-2 sm:py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2 pt-4 sm:pt-8"
      >
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
        </div>
        
        <h1 className="text-lg sm:text-2xl font-bold tracking-tight">
          How can I assist you today?
        </h1>
        
        <p className="text-muted-foreground max-w-md mx-auto text-xs sm:text-base">
          Ask me anything, request creative content, seek explanations, or get help with tasks.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-3xl mx-auto px-1 sm:px-2"
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-2 sm:p-6">
          <h2 className="font-semibold flex items-center gap-1.5 mb-2 sm:mb-3 text-sm">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span>Try asking about...</span>
          </h2>
          
          <div className="space-y-2 sm:space-y-3">
            {/* Category selection tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar -mx-1 px-1">
              {CATEGORIES.map(category => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "flex items-center gap-1 rounded-full py-1 h-7 sm:h-8 flex-shrink-0",
                    activeCategory === category.id 
                      ? "bg-primary/90 text-primary-foreground" 
                      : "border-border/50 bg-background/50"
                  )}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span className={activeCategory === category.id ? "text-primary-foreground" : category.color}>
                    {category.icon}
                  </span>
                  <span className="text-xs whitespace-nowrap">{isMobile ? category.name.split('&')[0].trim() : category.name}</span>
                </Button>
              ))}
            </div>
            
            {/* Category prompts - Fixed text overflow */}
            <div className="grid grid-cols-1 gap-1.5 -mx-1 px-1">
              {activePrompts.map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left h-auto py-2 px-2.5 font-normal hover:bg-secondary/20 rounded-lg"
                    onClick={() => handleSendExample(prompt)}
                  >
                    <div className="flex gap-2 items-start w-full">
                      <div className="bg-secondary/40 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Flame className="h-3 w-3 text-orange-500" />
                      </div>
                      <span className="line-clamp-2 text-xs sm:text-sm break-words">{prompt}</span>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Quick prompts section - Fixed text overflow for both desktop and mobile */}
          <div className="mt-4 sm:mt-6">
            <h3 className="font-medium text-sm mb-2 flex items-center">
              <Zap className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <span>Quick prompts</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              {[
                "Create a weekly workout schedule for beginners",
                "Write a personalized email template for job applications",
                "Explain the concept of blockchain technology to a 10-year-old"
              ].map((prompt, i) => (
                <Button 
                  key={i}
                  variant="outline"
                  size="sm"
                  className="h-auto min-h-[48px] py-2 px-3 justify-start text-left border-border/50 bg-background/50"
                  onClick={() => handleSendExample(prompt)}
                >
                  <div className="flex items-start gap-2 w-full">
                    <Zap className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />
                    <span className="text-xs line-clamp-2 break-words">{prompt}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="text-center mt-2 pb-12 sm:pb-6"
      >
        <Button
          variant="ghost"
          size="sm"
          className="font-normal text-xs text-muted-foreground"
        >
          More examples
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </motion.div>
    </div>
  );
}
