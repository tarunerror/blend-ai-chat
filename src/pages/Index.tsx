import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage as ChatMessageType, ChatSession } from "@/types/chat";
import { DEFAULT_MODEL, sendChatRequest } from "@/lib/openrouter";
import Header from "@/components/Header";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ModelSelector from "@/components/ModelSelector";
import ApiKeyModal from "@/components/ApiKeyModal";
import Sidebar from "@/components/Sidebar";
import Articles from "@/components/Articles";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Brain } from "lucide-react";

const Index = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL.id);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showArticles, setShowArticles] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState("");
  const { toast } = useToast();

  const activeSession = activeSessionId 
    ? sessions.find(session => session.id === activeSessionId) 
    : null;
  
  useEffect(() => {
    const storedApiKey = localStorage.getItem("openrouter-api-key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setShowApiKeyModal(true);
    }

    const storedSessions = localStorage.getItem("chat-sessions");
    if (storedSessions) {
      try {
        const parsedSessions = JSON.parse(storedSessions);
        setSessions(parsedSessions);
        
        const lastActiveSessionId = localStorage.getItem("active-session-id");
        if (lastActiveSessionId && parsedSessions.some((s: ChatSession) => s.id === lastActiveSessionId)) {
          setActiveSessionId(lastActiveSessionId);
        } else if (parsedSessions.length > 0) {
          setActiveSessionId(parsedSessions[0].id);
        }
      } catch (error) {
        console.error("Failed to parse stored sessions:", error);
      }
    } else {
      handleNewSession();
    }
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("chat-sessions", JSON.stringify(sessions));
    }
    
    if (activeSessionId) {
      localStorage.setItem("active-session-id", activeSessionId);
    }
  }, [sessions, activeSessionId]);

  const handleNewSession = () => {
    const newSessionId = uuidv4();
    const newSession: ChatSession = {
      id: newSessionId,
      title: `New Chat`,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
    setShowArticles(false);
    
    toast({
      title: "New conversation started",
      description: "You can now start chatting with the AI",
    });
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setShowArticles(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    
    if (activeSessionId === sessionId) {
      const remainingSessions = sessions.filter(session => session.id !== sessionId);
      if (remainingSessions.length > 0) {
        setActiveSessionId(remainingSessions[0].id);
      } else {
        handleNewSession();
      }
    }
    
    toast({
      title: "Conversation deleted",
      description: "The conversation has been removed",
    });
  };

  const simulateThinking = async (prompt: string) => {
    setIsThinking(true);
    setThinkingText("");
    
    const generateThinkingPoints = (userPrompt: string) => {
      const thinkingPoints = [
        "Analyzing context and user intent...",
        `Researching information about "${userPrompt.substring(0, 20)}${userPrompt.length > 20 ? '...' : ''}"`,
        "Evaluating relevant knowledge and sources...",
        "Determining the most accurate response...",
        "Formulating a comprehensive answer..."
      ];
      
      if (userPrompt.toLowerCase().includes("code") || userPrompt.toLowerCase().includes("program")) {
        thinkingPoints.splice(2, 0, "Checking code syntax and best practices...");
      }
      if (userPrompt.toLowerCase().includes("history") || userPrompt.toLowerCase().includes("when")) {
        thinkingPoints.splice(2, 0, "Reviewing historical timeline and events...");
      }
      if (userPrompt.toLowerCase().includes("math") || userPrompt.toLowerCase().includes("calculate")) {
        thinkingPoints.splice(2, 0, "Performing mathematical calculations...");
      }
      
      return thinkingPoints;
    };
    
    const thinkingPoints = generateThinkingPoints(prompt);
    
    for (const point of thinkingPoints) {
      setThinkingText("");
      for (let i = 0; i < point.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 30));
        setThinkingText(prev => prev + point.charAt(i));
      }
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    
    const minimumThinkingTime = 1500;
    const startTime = Date.now();
    return () => {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minimumThinkingTime) {
        return new Promise(resolve => setTimeout(resolve, minimumThinkingTime - elapsedTime));
      }
      return Promise.resolve();
    };
  };

  const handleSendMessage = async (content: string) => {
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }

    if (!activeSessionId) {
      handleNewSession();
      return;
    }

    const userMessage: ChatMessageType = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    const thinkingMessage: ChatMessageType = {
      id: uuidv4(),
      role: "assistant",
      content: thinkingText,
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

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    localStorage.setItem("openrouter-api-key", key);
    setShowApiKeyModal(false);
    
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved to your browser.",
    });
  };

  const handleChangeApiKey = () => {
    setShowApiKeyModal(true);
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
          <Sidebar
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
            <div className="flex-1 p-4 overflow-hidden">
              <Articles onClose={() => setShowArticles(false)} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
              <div className="p-4 border-b border-border/50">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <ModelSelector 
                    selectedModel={selectedModel} 
                    onModelChange={setSelectedModel} 
                  />
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleChangeApiKey}
                      className="text-xs h-9"
                    >
                      Change API Key
                    </Button>
                    
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
              
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                  {activeSession && activeSession.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 animate-fade-in">
                      <div className="rounded-full bg-primary/10 p-3 mb-4">
                        <Brain className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2">Start a conversation with AI</h2>
                      <p className="text-muted-foreground max-w-md">
                        Ask questions, get creative responses, or discuss complex topics. This AI can help with coding problems, explain concepts, or just chat.
                      </p>
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          className="text-sm" 
                          onClick={() => {
                            const content = "Can you explain how neural networks work in simple terms?";
                            handleSendMessage(content);
                          }}
                        >
                          "Explain neural networks"
                        </Button>
                        <Button 
                          variant="outline" 
                          className="text-sm" 
                          onClick={() => {
                            const content = "What are the best practices for writing clean React components?";
                            handleSendMessage(content);
                          }}
                        >
                          "React best practices"
                        </Button>
                      </div>
                    </div>
                  ) : (
                    activeSession?.messages.map((msg, i) => (
                      <ChatMessage
                        key={msg.id}
                        message={msg}
                        isLast={i === activeSession.messages.length - 1}
                      />
                    ))
                  )}
                  
                  {isThinking && (
                    <ChatMessage
                      message={{
                        id: "thinking",
                        role: "assistant",
                        content: thinkingText,
                        timestamp: Date.now(),
                      }}
                      isLast={true}
                      isThinking={true}
                    />
                  )}
                  
                  {isLoading && !isThinking && (
                    <div className="flex items-center gap-4 max-w-4xl mx-auto py-6 animate-fade-in">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                          <span className="text-primary-foreground font-medium text-sm">AI</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">
                            Assistant
                          </p>
                          <span className="text-xs text-muted-foreground">
                            Thinking...
                          </span>
                        </div>
                        <div className="mt-2 h-4 w-24 rounded bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 border-t border-border/50 bg-gradient-to-t from-background via-background to-background/0">
                <div className="max-w-4xl mx-auto">
                  <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </div>
              </div>
            </div>
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

export default Index;
