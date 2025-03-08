
import { Dispatch, SetStateAction } from 'react';
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage as ChatMessageType, ChatSession } from "@/types/chat";
import { sendChatRequest } from "@/lib/openrouter";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "@/components/ChatInput";
import EmptyState from "./EmptyState";

interface ChatContainerProps {
  activeSession: ChatSession | null;
  activeSessionId: string | null;
  sessions: ChatSession[];
  setSessions: Dispatch<SetStateAction<ChatSession[]>>;
  selectedModel: string;
  setSelectedModel: (modelId: string) => void;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isThinking: boolean;
  setIsThinking: Dispatch<SetStateAction<boolean>>;
  thinkingText: string;
  simulateThinking: (prompt: string) => Promise<() => Promise<void>>;
}

export default function ChatContainer({
  activeSession,
  activeSessionId,
  sessions,
  setSessions,
  selectedModel,
  setSelectedModel,
  isLoading,
  setIsLoading,
  isThinking,
  setIsThinking,
  thinkingText,
  simulateThinking
}: ChatContainerProps) {
  const { toast } = useToast();

  const handleChangeApiKey = () => {
    // This functionality is now handled in the parent component
  };

  const handleSendMessage = async (content: string) => {
    if (!activeSessionId) {
      return;
    }

    const userMessage: ChatMessageType = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        let updatedTitle = session.title;
        if (session.messages.length === 0) {
          updatedTitle = content.length > 30 
            ? content.substring(0, 30) + "..." 
            : content;
        }
        
        return {
          ...session,
          title: updatedTitle,
          messages: [...session.messages, userMessage],
          updatedAt: Date.now(),
        };
      }
      return session;
    }));
    
    setIsLoading(true);
    
    try {
      const finishThinking = await simulateThinking(content);
      
      const currentSession = sessions.find(session => session.id === activeSessionId);
      if (!currentSession) {
        await finishThinking();
        setIsThinking(false);
        setIsLoading(false);
        return;
      }
      
      const recentMessages = [...currentSession.messages.slice(-10), userMessage];
      
      await finishThinking();
      setIsThinking(false);
      
      // Use either stored API key or env variable
      const apiKey = localStorage.getItem("openrouter-api-key") || process.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new Error("API key not found");
      }

      const response = await sendChatRequest(recentMessages, apiKey, selectedModel);

      const assistantMessage: ChatMessageType = {
        id: uuidv4(),
        role: "assistant",
        content: response,
        model: selectedModel,
        timestamp: Date.now(),
      };

      setSessions(prev => prev.map(session => {
        if (session.id === activeSessionId) {
          return {
            ...session,
            messages: [...session.messages, assistantMessage],
            updatedAt: Date.now(),
          };
        }
        return session;
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      setIsThinking(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
      <ChatHeader 
        activeSession={activeSession}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        activeSessionId={activeSessionId} 
        setSessions={setSessions}
      />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {activeSession && activeSession.messages.length === 0 ? (
            <EmptyState onSendMessage={handleSendMessage} />
          ) : (
            <ChatMessages 
              messages={activeSession?.messages || []} 
              isThinking={isThinking}
              thinkingText={thinkingText}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-border/50 bg-gradient-to-t from-background via-background to-background/0">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
