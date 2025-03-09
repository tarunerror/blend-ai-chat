
import { useState, useRef, useEffect } from "react";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn } from "@/lib/utils";
import { 
  CheckIcon, CopyIcon, UserIcon, Brain, Code, 
  MessageSquare, Share2, ThumbsUp, ThumbsDown,
  Bookmark, Sparkles, Zap, LucideProps
} from "lucide-react";
import { AVAILABLE_MODELS } from "@/lib/openrouter";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: ChatMessageType;
  isLast?: boolean;
  isThinking?: boolean;
  streaming?: boolean;
}

export default function ChatMessage({ message, isLast = false, isThinking = false, streaming = false }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const modelInfo = message.model ? AVAILABLE_MODELS.find(m => m.id === message.model) : null;

  // Animation when message appears
  useEffect(() => {
    if (messageRef.current) {
      // Start animation after a small delay for sequential appearance
      const timeout = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      
      // Scroll into view if it's the last message
      if (isLast) {
        messageRef.current.scrollIntoView({ behavior: "smooth" });
      }
      
      return () => clearTimeout(timeout);
    }
  }, [isLast]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Determine message styles based on role
  const getMessageStyles = () => {
    if (message.role === "user") {
      return "user-message";
    } else {
      return "assistant-message";
    }
  };

  const handleFeedback = (value: boolean) => {
    setLiked(value);
    // In a real app, send feedback to the backend
  };

  const handleSave = () => {
    setSaved(!saved);
    // In a real app, save to user's bookmarks
  };

  // Custom AI avatar with animation
  const AIAvatar = (props: LucideProps) => (
    <div className="relative flex h-10 w-10 items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-primary opacity-20 animate-pulse"></div>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/90 hover:bg-primary transition-colors shadow-glow z-10">
        <Sparkles className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-40 blur-sm"></div>
    </div>
  );

  return (
    <motion.div 
      ref={messageRef}
      className={cn(
        "py-6 first:pt-0 last:pb-0",
        "transition-all duration-500 ease-out",
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 20
      }}
      transition={{ duration: 0.5 }}
    >
      <div className={cn(
        "flex gap-4 max-w-4xl mx-auto",
        "message-card p-4 rounded-xl transition-all duration-300",
        getMessageStyles()
      )}>
        <div className="mt-0.5 flex-shrink-0 relative">
          {message.role === "user" ? (
            <motion.div 
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors shadow-glow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserIcon className="h-6 w-6 text-primary animate-pulse-slow" />
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AIAvatar />
            </motion.div>
          )}
          
          {/* Add a connecting line with gradient effect */}
          {!isLast && (
            <div className="absolute left-1/2 -translate-x-1/2 top-12 w-0.5 h-14 bg-gradient-to-b from-primary/30 to-transparent"></div>
          )}
        </div>
        
        <div className="flex-1 space-y-3 overflow-hidden">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <p className="font-medium text-base">
              {message.role === "user" ? "You" : modelInfo?.name || "AI Assistant"}
            </p>
            {message.role === "assistant" && modelInfo && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 animate-fade-in bg-primary/10">
                <Zap className="h-3 w-3 mr-1 text-primary" />
                {modelInfo.provider}
              </Badge>
            )}
            
            <span className="text-xs text-muted-foreground ml-auto">
              {new Date(message.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </motion.div>
          
          {isThinking ? (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <div className="flex items-start">
                <div className="p-3 bg-secondary/50 rounded-lg animate-pulse mr-3">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-3 w-full">
                  <div className="thinking-line h-4 bg-secondary/50 rounded w-3/4 animate-pulse"></div>
                  <div className="thinking-line h-4 bg-secondary/40 rounded w-2/3 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="thinking-line h-4 bg-secondary/30 rounded w-1/2 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          ) : (
            <motion.div 
              className="prose prose-neutral dark:prose-invert max-w-none"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {message.role === "assistant" ? (
                <ReactMarkdown
                  className="text-balance whitespace-pre-wrap break-words"
                  components={{
                    p: ({ children }) => <p className="whitespace-pre-wrap break-words">{children}</p>,
                    code({node, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !className?.includes('language-') ? (
                        <code className="px-1 py-0.5 bg-secondary/30 rounded text-sm" {...props}>
                          {children}
                        </code>
                      ) : (
                        <div className="relative group">
                          <div className="absolute -top-5 right-2 bg-secondary/30 px-2 py-0.5 rounded text-xs opacity-70">
                            {match?.[1] || 'code'}
                          </div>
                          <SyntaxHighlighter
                            {...props}
                            style={oneDark}
                            language={match?.[1] || 'text'}
                            PreTag="div"
                            className="rounded-md !my-4 overflow-hidden"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      )
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                <p className="text-balance whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              )}
            </motion.div>
          )}
          
          {message.role === "assistant" && !isThinking && (
            <motion.div 
              className="flex justify-start pt-2 space-x-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={copyToClipboard}
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-secondary/30 hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {copied ? (
                        <>
                          <CheckIcon className="h-3 w-3" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy message to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={handleSave}
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-secondary/30 hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Bookmark className={cn("h-3 w-3", saved && "fill-current text-primary")} />
                      <span>{saved ? "Saved" : "Save"}</span>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{saved ? "Remove from saved messages" : "Save this response"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => handleFeedback(true)}
                      className={cn(
                        "inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors",
                        liked === true 
                          ? "bg-green-500/20 text-green-600" 
                          : "bg-secondary/30 hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This was helpful</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => handleFeedback(false)}
                      className={cn(
                        "inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors",
                        liked === false 
                          ? "bg-red-500/20 text-red-600" 
                          : "bg-secondary/30 hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ThumbsDown className="h-3 w-3" />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This wasn't helpful</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {streaming && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-primary/20 text-muted-foreground animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Generating...
                </span>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
