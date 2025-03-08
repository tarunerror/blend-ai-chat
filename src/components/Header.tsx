
import { useState } from "react";
import { Info, Menu } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BlendLogo from "@/components/BlendLogo";
import { useMobile } from "@/hooks/use-mobile";

export default function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const [showAbout, setShowAbout] = useState(false);
  const isMobile = useMobile();

  return (
    <header className="w-full border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          {onToggleSidebar && (
            <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="h-8 w-8 sm:h-9 sm:w-9">
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          )}
          <div className="h-6 w-6 sm:h-8 sm:w-8">
            <BlendLogo />
          </div>
          <h1 className="text-lg sm:text-xl font-medium tracking-tight">Blend AI Chat</h1>
        </div>

        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowAbout(true)}
                  className="h-8 w-8 sm:h-9 sm:w-9 transition-all duration-200"
                >
                  <Info className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">About</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>About Blend AI</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Dialog open={showAbout} onOpenChange={setShowAbout}>
          <DialogContent className="glass-card sm:max-w-md max-w-[90%] rounded-xl p-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                <div className="h-4 w-4 sm:h-5 sm:w-5">
                  <BlendLogo />
                </div>
                About Blend AI Chat
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                A unique AI chatbot that integrates multiple models through OpenRouter.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Blend AI Chat lets you interact with top AI models through a single, elegant interface.
                Switch between models to compare responses or find the one that best suits your needs.
              </p>
              
              <div className="rounded-md bg-secondary p-3 sm:p-4">
                <h4 className="mb-2 text-xs sm:text-sm font-medium">Features</h4>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-1.5 sm:space-y-2">
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 text-primary flex-shrink-0">
                      <BlendLogo small />
                    </div>
                    <span>Access to multiple AI models in one interface</span>
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 text-primary flex-shrink-0">
                      <BlendLogo small />
                    </div>
                    <span>Seamless model switching</span>
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 text-primary flex-shrink-0">
                      <BlendLogo small />
                    </div>
                    <span>Save and manage conversation history</span>
                  </li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
