import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage as ChatMessageType, ChatSession } from "@/types/chat";
import { sendChatRequest } from "@/lib/openrouter";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "@/components/ChatInput";
import EmptyState from "./EmptyState";
import { cn } from '@/lib/utils';

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
  const [streamingMessageId, setStreamingMessageId] = useState<string | undefined>(undefined);
  const [streamContent, setStreamContent] = useState("");

  // Get realTimeThinking from the useThinking hook in ChatPage
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
      
      // Create a placeholder message for streaming
      const streamingId = uuidv4();
      setStreamingMessageId(streamingId);
      setStreamContent("");
      
      // Add the placeholder message to the session
      setSessions(prev => prev.map(session => {
        if (session.id === activeSessionId) {
          return {
            ...session,
            messages: [
              ...session.messages, 
              {
                id: streamingId,
                role: "assistant",
                content: "",
                model: selectedModel,
                timestamp: Date.now(),
              }
            ],
            updatedAt: Date.now(),
          };
        }
        return session;
      }));

      // Start streaming the response
      const response = await sendChatRequest(
        recentMessages, 
        apiKey, 
        selectedModel,
        (chunk) => {
          // Update the streaming content with each chunk
          setStreamContent(prev => {
            const newContent = prev + chunk;
            
            // Update the message in the session
            setSessions(prevSessions => prevSessions.map(session => {
              if (session.id === activeSessionId) {
                return {
                  ...session,
                  messages: session.messages.map(msg => {
                    if (msg.id === streamingId) {
                      return {
                        ...msg,
                        content: newContent
                      };
                    }
                    return msg;
                  }),
                  updatedAt: Date.now(),
                };
              }
              return session;
            }));
            
            return newContent;
          });
        }
      );

      console.log("API response complete:", response ? "success" : "empty");
      
      // Once streaming is complete, clear the streaming message ID
      setStreamingMessageId(undefined);
      
    } catch (error) {
      console.error("Error sending message:", error);
      setIsThinking(false);
      setStreamingMessageId(undefined);
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
    <div className="flex flex-col h-full w-full bg-background relative">
      <ChatHeader 
        activeSession={activeSession}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        activeSessionId={activeSessionId} 
        setSessions={setSessions}
        showSidebar={showSidebar}
        isMobile={isMobile}
      />
      
      <div className={cn(
        "flex-1 overflow-y-auto scrollbar-thin no-scrollbar",
        "bg-background bg-opacity-90",
        "relative z-0"
      )}>
        <div className={cn(
          "mx-auto transition-all duration-300 ease-in-out h-full",
          (!showSidebar && !isMobile) ? 'max-w-6xl' : 'max-w-4xl'
        )}>
          {activeSession && activeSession.messages.length === 0 ? (
            <EmptyState onSendMessage={handleSendMessage} />
          ) : (
            <ChatMessages 
              messages={activeSession?.messages || []} 
              isThinking={isThinking}
              thinkingText={thinkingText}
              isLoading={isLoading}
              realTimeThinking={realTimeThinking}
              streamingMessageId={streamingMessageId}
            />
          )}
        </div>
      </div>
      
      <div className={cn(
        "p-2 sm:p-4 border-t border-border/30 bg-gradient-to-t from-background via-background to-background/0",
        "sticky bottom-0 z-10"
      )}>
        <div className={cn(
          "mx-auto transition-all duration-300 ease-in-out",
          (!showSidebar && !isMobile) ? 'max-w-6xl' : 'max-w-4xl'
        )}>
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
