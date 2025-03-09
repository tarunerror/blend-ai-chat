
import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlendLogo from "./BlendLogo";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/features/chat/hooks/useTheme";

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleTheme?: () => void;
}

export default function Header({ onToggleSidebar, onToggleTheme }: HeaderProps) {
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="mr-1"
            title="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6">
              <BlendLogo />
            </div>
            <h1 className="text-lg font-semibold">Blend AI Chat</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {onToggleTheme && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className="rounded-full"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
