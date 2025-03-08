
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

  const {
    isLoading,
    isThinking,
    thinkingText,
    simulateThinking,
    setIsLoading,
    setIsThinking,
  } = useThinking();

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
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar backdrop for mobile */}
        {showSidebar && isMobile && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30" 
            onClick={() => setShowSidebar(false)}
          />
        )}
        
        {/* Sidebar wrapper */}
        <div 
          className={`
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'} 
            transition-all duration-300 w-64 z-40
            ${isMobile ? 'fixed left-0 top-16 h-[calc(100vh-4rem)]' : 'relative flex-shrink-0 h-full'}
          `}
        >
          <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onNewSession={handleNewSession}
            onSelectSession={handleSelectSessionAndCloseSidebar}
            onDeleteSession={handleDeleteSession}
            onShowArticles={handleShowArticles}
          />
        </div>
        
        {/* Main content - adjusts width based on sidebar state */}
        <main 
          className={`
            flex-1 flex overflow-hidden transition-all duration-300
            ${showSidebar && !isMobile ? 'ml-0' : 'ml-0 w-full'}
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
              sidebarVisible={showSidebar && !isMobile}
            />
          )}
        </main>
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
