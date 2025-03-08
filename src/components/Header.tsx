
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

export default function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <header className="w-full border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          )}
          <div className="h-8 w-8">
            <BlendLogo />
          </div>
          <h1 className="text-xl font-medium tracking-tight">Blend AI Chat</h1>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowAbout(true)}
                  className="transition-all duration-200"
                >
                  <Info className="h-5 w-5" />
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
          <DialogContent className="glass-card sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="h-5 w-5">
                  <BlendLogo />
                </div>
                About Blend AI Chat
              </DialogTitle>
              <DialogDescription>
                A unique AI chatbot that integrates multiple models through OpenRouter.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Blend AI Chat lets you interact with top AI models through a single, elegant interface.
                Switch between models to compare responses or find the one that best suits your needs.
              </p>
              
              <div className="rounded-md bg-secondary p-4">
                <h4 className="mb-2 text-sm font-medium">Features</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-4 w-4 mt-0.5 text-primary">
                      <BlendLogo small />
                    </div>
                    <span>Access to multiple AI models in one interface</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-4 w-4 mt-0.5 text-primary">
                      <BlendLogo small />
                    </div>
                    <span>Seamless model switching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-4 w-4 mt-0.5 text-primary">
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
