
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatSession } from "@/types/chat";
import { Toast } from "@/hooks/use-toast";

export function useChatSessions(toast: Toast) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const activeSession = activeSessionId 
    ? sessions.find(session => session.id === activeSessionId) 
    : null;

  // Load sessions from localStorage on mount
  useEffect(() => {
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

  // Save sessions to localStorage when they change
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
    
    toast({
      title: "New conversation started",
      description: "You can now start chatting with the AI",
    });
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
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

  return {
    sessions,
    activeSessionId,
    activeSession,
    setSessions,
    setActiveSessionId,
    handleNewSession,
    handleSelectSession,
    handleDeleteSession,
  };
}
