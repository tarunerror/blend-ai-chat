
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatSession } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get active session object
  const activeSession = activeSessionId
    ? sessions.find((session) => session.id === activeSessionId) || null
    : null;

  // Load sessions from localStorage on component mount
  useEffect(() => {
    const storedSessions = localStorage.getItem("chat-sessions");
    if (storedSessions) {
      try {
        const parsedSessions = JSON.parse(storedSessions);
        setSessions(parsedSessions);
        
        // Set active session to most recently updated if it exists
        if (parsedSessions.length > 0) {
          const sortedSessions = [...parsedSessions].sort(
            (a, b) => b.updatedAt - a.updatedAt
          );
          setActiveSessionId(sortedSessions[0].id);
        }
      } catch (error) {
        console.error("Error parsing stored sessions:", error);
      }
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chat-sessions", JSON.stringify(sessions));
  }, [sessions]);

  // Create a new chat session
  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  // Select an existing session
  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
  };

  // Delete a session
  const handleDeleteSession = (sessionId: string) => {
    const sessionToDelete = sessions.find((s) => s.id === sessionId);
    
    if (sessionToDelete) {
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));
      
      if (activeSessionId === sessionId) {
        const remainingSessions = sessions.filter((s) => s.id !== sessionId);
        if (remainingSessions.length > 0) {
          // Set the most recently updated session as active
          const mostRecent = [...remainingSessions].sort(
            (a, b) => b.updatedAt - a.updatedAt
          )[0];
          setActiveSessionId(mostRecent.id);
        } else {
          setActiveSessionId(null);
        }
      }
      
      toast({
        title: "Chat Deleted",
        description: `"${sessionToDelete.title}" has been deleted.`,
      });
    }
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
