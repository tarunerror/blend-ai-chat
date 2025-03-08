
import { Dispatch, SetStateAction } from 'react';
import { Button } from "@/components/ui/button";
import ModelSelector from "@/components/ModelSelector";
import { ChatSession } from "@/types/chat";

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
  return (
    <div className="p-4 border-b border-border/50">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ModelSelector 
          selectedModel={selectedModel} 
          onModelChange={setSelectedModel} 
        />
        
        <div className="flex items-center gap-2">          
          {activeSession && activeSession.messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
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
              className="text-xs"
            >
              Clear Messages
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
