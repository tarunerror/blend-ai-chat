
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { DEFAULT_MODEL, sendChatRequest } from "@/lib/openrouter";
import Header from "@/components/Header";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ModelSelector from "@/components/ModelSelector";
import ApiKeyModal from "@/components/ApiKeyModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Trash2 } from "lucide-react";

const Index = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL.id);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const { toast } = useToast();

  // Load API key and messages from localStorage
  useEffect(() => {
    const storedApiKey = localStorage.getItem("openrouter-api-key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setShowApiKeyModal(true);
    }

    const storedMessages = localStorage.getItem("chat-messages");
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages));
      } catch (error) {
        console.error("Failed to parse stored messages:", error);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat-messages", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }

    // Create a new user message
    const userMessage: ChatMessageType = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    // Add user message to the conversation
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Combine previous messages with the new one, but only recent ones for context
      const recentMessages = [...messages.slice(-10), userMessage];
      
      // Send the message to the API
      const response = await sendChatRequest(recentMessages, apiKey, selectedModel);

      // Create assistant message from response
      const assistantMessage: ChatMessageType = {
        id: uuidv4(),
        role: "assistant",
        content: response,
        model: selectedModel,
        timestamp: Date.now(),
      };

      // Add assistant message to the conversation
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
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

  const handleClearMessages = () => {
    setMessages([]);
    localStorage.removeItem("chat-messages");
    
    toast({
      title: "Conversation Cleared",
      description: "All messages have been removed.",
    });
  };

  const handleChangeApiKey = () => {
    setShowApiKeyModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center my-4">
          <div className="flex items-center gap-2">
            <ModelSelector 
              selectedModel={selectedModel} 
              onModelChange={setSelectedModel} 
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleChangeApiKey}
              className="text-xs h-9"
            >
              Change API Key
            </Button>
          </div>
          
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearMessages}
              className="text-xs"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear Chat
            </Button>
          )}
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-6 pb-20">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Welcome to Blend AI Chat</h2>
              <p className="text-muted-foreground max-w-md">
                Get started by sending a message. You can switch between different AI models using the selector above.
              </p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isLast={i === messages.length - 1}
              />
            ))
          )}
          
          {isLoading && (
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
      </main>
      
      <div className="sticky bottom-0 w-full max-w-4xl mx-auto px-4 pb-6 pt-2 bg-gradient-to-t from-background via-background to-background/0">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
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
