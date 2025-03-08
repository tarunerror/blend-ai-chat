
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { ChatSession } from "@/types/chat";
import Header from "@/components/Header";
import ApiKeyModal from "@/components/ApiKeyModal";
import { DEFAULT_MODEL } from "@/lib/openrouter";
import { useChatSessions } from "./hooks/useChatSessions";
import { useThinking } from "./hooks/useThinking";
import ChatContainer from "./components/ChatContainer";
import ChatSidebar from "./components/ChatSidebar";
import ArticlesContainer from "./components/ArticlesContainer";

const ChatPage = () => {
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL.id);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showArticles, setShowArticles] = useState(false);
  const { toast } = useToast();

  const {
    sessions,
    activeSessionId,
    activeSession,
    setSessions,
    setActiveSessionId,
    handleNewSession,
    handleSelectSession,
    handleDeleteSession,
  } = useChatSessions(toast);

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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onToggleSidebar={handleToggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <div className={`${showSidebar ? 'w-64' : 'w-0'} transition-all duration-300 md:w-64 overflow-hidden h-[calc(100vh-4rem)]`}>
          <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onNewSession={handleNewSession}
            onSelectSession={handleSelectSession}
            onDeleteSession={handleDeleteSession}
            onShowArticles={handleShowArticles}
          />
        </div>
        
        <main className="flex-1 flex overflow-hidden">
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
