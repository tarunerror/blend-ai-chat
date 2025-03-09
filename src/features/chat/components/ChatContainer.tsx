
import { Dispatch, SetStateAction, useEffect } from 'react';
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
  showSidebar?: boolean;
  isMobile?: boolean;
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
  simulateThinking,
  showSidebar = true,
  isMobile = false
}: ChatContainerProps) {
  const { toast } = useToast();

  // Get realTimeThinking from the useThinking hook in ChatPage
  // Since we don't have direct access to it, we'll get it through props in a future update
  // For now, we'll just forward whatever we have
  const realTimeThinking = (window as any).__realTimeThinking || [];

  // Log active session status for debugging
  useEffect(() => {
    console.log("Active session:", activeSessionId);
    console.log("Sessions count:", sessions.length);
  }, [activeSessionId, sessions]);

  // Expose realTimeThinking to window for debugging
  useEffect(() => {
    if ((window as any).__setRealTimeThinking) {
      (window as any).__subscribeToRealTimeThinking((thoughts: string[]) => {
        console.log("Real-time thinking updated:", thoughts);
      });
    }
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) {
      console.log("Empty content, not sending");
      return;
    }

    if (!activeSessionId) {
      console.log("No active session, cannot send message");
      toast({
        title: "Error",
        description: "No active chat session. Please create a new chat.",
        variant: "destructive",
      });
      return;
    }

    console.log("Sending message:", content, "to session:", activeSessionId);

    const userMessage: ChatMessageType = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    // Update the session with the new message
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
      // Start the thinking animation
      const finishThinking = await simulateThinking(content);
      
      // Get the updated session after adding the user message
      const currentSession = sessions.find(session => session.id === activeSessionId);
      if (!currentSession) {
        console.error("Session not found after sending message");
        await finishThinking();
        setIsThinking(false);
        setIsLoading(false);
        return;
      }
      
      const recentMessages = [...currentSession.messages.slice(-10), userMessage];
      
      await finishThinking();
      setIsThinking(false);
      
      // Use either stored API key or env variable
      const apiKey = localStorage.getItem("openrouter-api-key") || import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new Error("API key not found");
      }

      console.log("Calling API with model:", selectedModel);
      const response = await sendChatRequest(recentMessages, apiKey, selectedModel);
      console.log("API response received:", response ? "success" : "empty");

      const assistantMessage: ChatMessageType = {
        id: uuidv4(),
        role: "assistant",
        content: response,
        model: selectedModel,
        timestamp: Date.now(),
      };

      setSessions(prev => {
        console.log("Updating sessions with AI response");
        return prev.map(session => {
          if (session.id === activeSessionId) {
            return {
              ...session,
              messages: [...session.messages, assistantMessage],
              updatedAt: Date.now(),
            };
          }
          return session;
        });
      });
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
    <div className="flex flex-col h-full w-full">
      <ChatHeader 
        activeSession={activeSession}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        activeSessionId={activeSessionId} 
        setSessions={setSessions}
        showSidebar={showSidebar}
        isMobile={isMobile}
      />
      
      <div className="flex-1 overflow-y-auto">
        <div className={`
          transition-all duration-300 ease-in-out
          mx-auto px-4 py-6 space-y-6
          ${!showSidebar && !isMobile ? 'max-w-6xl' : 'max-w-4xl'}
        `}>
          {activeSession && activeSession.messages.length === 0 ? (
            <EmptyState onSendMessage={handleSendMessage} />
          ) : (
            <ChatMessages 
              messages={activeSession?.messages || []} 
              isThinking={isThinking}
              thinkingText={thinkingText}
              isLoading={isLoading}
              realTimeThinking={realTimeThinking}
            />
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-border/50 bg-gradient-to-t from-background via-background to-background/0">
        <div className={`
          mx-auto transition-all duration-300 ease-in-out
          ${!showSidebar && !isMobile ? 'max-w-6xl' : 'max-w-4xl'}
        `}>
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
