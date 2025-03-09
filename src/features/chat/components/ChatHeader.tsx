
import { Dispatch, SetStateAction } from 'react';
import { Button } from "@/components/ui/button";
import ModelSelector from "@/components/ModelSelector";
import { ChatSession } from "@/types/chat";
import ExportMenu from "./ExportMenu";
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  activeSession: ChatSession | null;
  selectedModel: string;
  setSelectedModel: (modelId: string) => void;
  activeSessionId: string | null;
  setSessions: Dispatch<SetStateAction<ChatSession[]>>;
  showSidebar?: boolean;
  isMobile?: boolean;
}

export default function ChatHeader({
  activeSession,
  selectedModel,
  setSelectedModel,
  activeSessionId,
  setSessions,
  showSidebar = true,
  isMobile = false
}: ChatHeaderProps) {
  const isMobileHook = useIsMobile();
  const effectiveIsMobile = isMobile || isMobileHook;
  
  return (
    <div className="p-2 sm:p-3 border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
      <div className={cn(
        "mx-auto transition-all duration-300 ease-in-out",
        (!showSidebar && !effectiveIsMobile) ? 'max-w-6xl' : 'max-w-4xl'
      )}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className={cn(
            "transition-all duration-300 ease-in-out flex items-center",
            (!showSidebar && !effectiveIsMobile) ? 'w-auto' : 'w-full sm:w-auto'
          )}>
            <ModelSelector 
              selectedModel={selectedModel} 
              onModelChange={setSelectedModel} 
            />
            
            {!effectiveIsMobile && (
              <div className="flex items-center ml-2 text-xs text-muted-foreground">
                <Info className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline-block">Gemini</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-1 sm:mt-0">
            {effectiveIsMobile && (
              <Button variant="ghost" size="icon" className="sm:hidden h-7 w-7">
                <Info className="h-3.5 w-3.5" />
              </Button>
            )}
            
            <ExportMenu session={activeSession} />
            
            {activeSession && activeSession.messages.length > 0 && (
              <Button
                variant="ghost"
                size={effectiveIsMobile ? "sm" : "sm"}
                onClick={() => {
                  setSessions(prev => prev.map(session => {
                    if (session.id === activeSessionId) {
                      return {
                        ...session,
                        messages: [],
                        updatedAt: Date.now(),
                      };
                    }
                    return session;
                  }));
                }}
                className="text-xs h-7 sm:h-8"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
