
import { useState } from "react";
import { MessageSquarePlus, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChatSession } from "@/types/chat";
import { cn } from "@/lib/utils";
import BlendLogo from "./BlendLogo";

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewSession: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onShowArticles: () => void;
}

export default function Sidebar({
  sessions,
  activeSessionId,
  onNewSession,
  onSelectSession,
  onDeleteSession,
  onShowArticles,
}: SidebarProps) {
  const [hoveredSessionId, setHoveredSessionId] = useState<string | null>(null);

  return (
    <div className="w-full h-full flex flex-col bg-sidebar/50 backdrop-blur-lg border-r border-primary/20 shadow-lg">
      <div className="p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 sm:h-6 sm:w-6 neon-glow-primary">
            <BlendLogo />
          </div>
          <h2 className="font-medium text-sm sm:text-base gradient-text">Chats</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewSession}
          className="hover-scale text-primary h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary/10 neon-glow-primary"
        >
          <MessageSquarePlus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">New Chat</span>
        </Button>
      </div>
      
      <Separator className="bg-primary/20" />
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "group flex items-center justify-between rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm transition-all hover:bg-primary/10",
                activeSessionId === session.id ? "bg-primary/20 text-foreground border-l-2 border-primary" : "text-muted-foreground",
                "animate-fade-in cursor-pointer"
              )}
              onClick={() => onSelectSession(session.id)}
              onMouseEnter={() => setHoveredSessionId(session.id)}
              onMouseLeave={() => setHoveredSessionId(null)}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden">
                <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-neon-blue">
                  <BlendLogo small />
                </div>
                <span className="truncate">{session.title}</span>
              </div>
              
              {(hoveredSessionId === session.id || activeSessionId === session.id) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground/70 hover:text-destructive transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                >
                  <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="sr-only">Delete</span>
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <Separator className="bg-primary/20" />
      
      <div className="p-3 sm:p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 border-primary/30 py-1.5 sm:py-2"
          onClick={onShowArticles}
        >
          <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neon-blue" />
          <span>Articles</span>
        </Button>
      </div>
    </div>
  );
}
