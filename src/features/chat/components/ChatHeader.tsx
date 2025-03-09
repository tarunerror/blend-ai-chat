
import { Dispatch, SetStateAction } from 'react';
import { Button } from "@/components/ui/button";
import ModelSelector from "@/components/ModelSelector";
import { ChatSession } from "@/types/chat";
import ExportMenu from "./ExportMenu";
import { useIsMobile } from '@/hooks/use-mobile';

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
  
  // If sidebar is hidden and we're in mobile view, don't show the header content
  if (!showSidebar && effectiveIsMobile) {
    return null;
  }

  return (
    <div className="p-2 sm:p-4 border-b border-border/50">
      <div className={`
        mx-auto transition-all duration-300 ease-in-out
        ${!showSidebar && !effectiveIsMobile ? 'max-w-6xl' : 'max-w-4xl'}
      `}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className={`transition-all duration-300 ease-in-out ${!showSidebar && !effectiveIsMobile ? 'w-auto' : 'w-full sm:w-auto'}`}>
            <ModelSelector 
              selectedModel={selectedModel} 
              onModelChange={setSelectedModel} 
            />
          </div>
          
          <div className="flex items-center gap-2 mt-1 sm:mt-0">
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
                className="text-xs h-8"
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
