
import Sidebar from "@/components/Sidebar";
import { ChatSession } from "@/types/chat";

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewSession: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onShowArticles: () => void;
}

export default function ChatSidebar({
  sessions,
  activeSessionId,
  onNewSession,
  onSelectSession,
  onDeleteSession,
  onShowArticles
}: ChatSidebarProps) {
  return (
    <Sidebar
      sessions={sessions}
      activeSessionId={activeSessionId}
      onNewSession={onNewSession}
      onSelectSession={onSelectSession}
      onDeleteSession={onDeleteSession}
      onShowArticles={onShowArticles}
    />
  );
}
