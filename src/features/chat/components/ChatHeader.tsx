
import { Dispatch, SetStateAction } from 'react';
import { Button } from "@/components/ui/button";
import ModelSelector from "@/components/ModelSelector";
import { ChatSession } from "@/types/chat";
import ExportMenu from "./ExportMenu";
import { useMobile } from '@/hooks/use-mobile';

interface ChatHeaderProps {
  activeSession: ChatSession | null;
  selectedModel: string;
  setSelectedModel: (modelId: string) => void;
  activeSessionId: string | null;
  setSessions: Dispatch<SetStateAction<ChatSession[]>>;
}

export default function ChatHeader({
  activeSession,
  selectedModel,
  setSelectedModel,
  activeSessionId,
  setSessions
}: ChatHeaderProps) {
  const isMobile = useMobile();

  return (
    <div className="p-2 sm:p-4 border-b border-border/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="w-full sm:w-auto">
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
              size={isMobile ? "sm" : "sm"}
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
  );
}
