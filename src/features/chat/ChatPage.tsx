
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { ChatSession } from "@/types/chat";
import Header from "@/components/Header";
import ApiKeyModal from "@/components/ApiKeyModal";
import { DEFAULT_MODEL } from "@/lib/openrouter";
import { useChatSessions } from "./hooks/useChatSessions";
import { useThinking } from "./hooks/useThinking";
import ChatContainer from "./components/ChatContainer";
import ChatSidebar from "./components/ChatSidebar";
import ArticlesContainer from "./components/ArticlesContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "./hooks/useTheme";

const ChatPage = () => {
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL.id);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showArticles, setShowArticles] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();

  // Auto-hide sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  }, [isMobile]);

  const {
    sessions,
    activeSessionId,
    activeSession,
    setSessions,
    setActiveSessionId,
    handleNewSession,
    handleSelectSession,
    handleDeleteSession,
  } = useChatSessions();

  // Create an initial session if none exists
  useEffect(() => {
    if (sessions.length === 0) {
      console.log("No sessions found, creating a new one");
      handleNewSession();
    }
  }, [sessions, handleNewSession]);

  const {
    isLoading,
    isThinking,
    thinkingText,
    realTimeThinking,
    simulateThinking,
    setIsLoading,
    setIsThinking,
  } = useThinking();

  // Make real-time thinking available globally for debugging and integration
  useEffect(() => {
    // Expose real-time thinking to window for debugging and integration
    (window as any).__realTimeThinking = realTimeThinking;
    
    // Add a setter method for other components to update it
    if (!(window as any).__setRealTimeThinking) {
      const subscribers: ((thoughts: string[]) => void)[] = [];
      
      (window as any).__setRealTimeThinking = (thoughts: string[]) => {
        (window as any).__realTimeThinking = thoughts;
        subscribers.forEach(callback => callback(thoughts));
      };
      
      (window as any).__subscribeToRealTimeThinking = (callback: (thoughts: string[]) => void) => {
        subscribers.push(callback);
        // Return unsubscribe function
        return () => {
          const index = subscribers.indexOf(callback);
          if (index !== -1) {
            subscribers.splice(index, 1);
          }
        };
      };
    }
  }, [realTimeThinking]);

  // Check for API key on load
  useEffect(() => {
    const storedApiKey = localStorage.getItem("openrouter-api-key") || import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!storedApiKey) {
      setShowApiKeyModal(true);
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem("openrouter-api-key", key);
    setShowApiKeyModal(false);
    
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved to your browser.",
    });
  };

  const handleToggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  const handleShowArticles = () => {
    setShowArticles(true);
  };

  const handleSelectSessionAndCloseSidebar = (sessionId: string) => {
    handleSelectSession(sessionId);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header onToggleSidebar={handleToggleSidebar} onToggleTheme={toggleTheme} />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar backdrop for mobile */}
        {showSidebar && isMobile && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30" 
            onClick={() => setShowSidebar(false)}
          />
        )}
        
        {/* Sidebar */}
        <div 
          className={`
            absolute md:relative z-40 h-full
            transition-all duration-300 ease-in-out
            ${showSidebar ? 'translate-x-0 w-64' : '-translate-x-full w-0 md:w-0'} 
          `}
        >
          {showSidebar && (
            <ChatSidebar
              sessions={sessions}
              activeSessionId={activeSessionId}
              onNewSession={handleNewSession}
              onSelectSession={handleSelectSessionAndCloseSidebar}
              onDeleteSession={handleDeleteSession}
              onShowArticles={handleShowArticles}
            />
          )}
        </div>
        
        {/* Main content - adjust with transition when sidebar state changes */}
        <div 
          className={`
            flex-1 w-full h-full
            transition-all duration-300 ease-in-out
            ${showSidebar ? 'md:ml-0' : 'ml-0'}
          `}
        >
          {showArticles ? (
            <ArticlesContainer onClose={() => setShowArticles(false)} />
          ) : (
            <ChatContainer
              activeSession={activeSession}
              activeSessionId={activeSessionId}
              sessions={sessions}
              setSessions={setSessions}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              isThinking={isThinking}
              setIsThinking={setIsThinking}
              thinkingText={thinkingText}
              simulateThinking={simulateThinking}
              showSidebar={showSidebar}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>
      
      <ApiKeyModal
        open={showApiKeyModal}
        onOpenChange={setShowApiKeyModal}
        onApiKeySubmit={handleApiKeySubmit}
      />
    </div>
  );
};

export default ChatPage;
