
import Articles from "@/components/Articles";
import { Rocket, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ArticlesContainerProps {
  onClose: () => void;
}

export default function ArticlesContainer({ onClose }: ArticlesContainerProps) {
  return (
    <motion.div 
      className="flex-1 p-2 md:p-4 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full rounded-lg overflow-hidden border border-border/50 shadow-lg bg-gradient-to-br from-background to-background/95">
        <div className="flex items-center gap-2 p-3 border-b border-border/50">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8 mr-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium">Spaceflight News</h2>
          </div>
          
          <div className="ml-auto text-xs text-muted-foreground">
            Powered by Spaceflight News API
          </div>
        </div>
        
        <div className="h-[calc(100%-48px)]">
          <Articles onClose={onClose} />
        </div>
      </div>
    </motion.div>
  );
}
