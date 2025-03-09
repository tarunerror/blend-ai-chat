
import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";

interface ArticleViewToggleProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  refetchArticles: () => void;
  onClose: () => void;
}

export function ArticleViewToggle({
  viewMode,
  setViewMode,
  refetchArticles,
  onClose
}: ArticleViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setViewMode('grid')}
        className={viewMode === 'grid' ? 'bg-secondary/50' : ''}
      >
        <div className="grid grid-cols-2 gap-0.5">
          <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
        </div>
        <span className="sr-only">Grid view</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setViewMode('list')}
        className={viewMode === 'list' ? 'bg-secondary/50' : ''}
      >
        <div className="flex flex-col gap-0.5 justify-center items-center">
          <div className="w-3.5 h-1 bg-current rounded-sm"></div>
          <div className="w-3.5 h-1 bg-current rounded-sm"></div>
          <div className="w-3.5 h-1 bg-current rounded-sm"></div>
        </div>
        <span className="sr-only">List view</span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={refetchArticles}
        className="hover:animate-spin-slow"
      >
        <RefreshCw className="h-4 w-4" />
        <span className="sr-only">Refresh</span>
      </Button>
      
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
