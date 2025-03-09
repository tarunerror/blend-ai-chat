
import { Article } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Rocket } from "lucide-react";
import { ArticleCard } from "./ArticleCard";

interface ArticlesListProps { 
  articles?: Article[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  savedArticles: string[];
  onToggleSave: (id: string) => void;
}

export function ArticlesList({ 
  articles, 
  isLoading, 
  viewMode,
  savedArticles,
  onToggleSave
}: ArticlesListProps) {
  return (
    <ScrollArea className="flex-1">
      {viewMode === 'grid' ? (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            ))
          ) : articles && articles.length > 0 ? (
            articles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                view="grid" 
                isSaved={savedArticles.includes(article.id)}
                onToggleSave={() => onToggleSave(article.id)}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-secondary/30 p-4 rounded-full mb-4">
                <Rocket className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No articles found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-16 w-16 rounded-md flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))
          ) : articles && articles.length > 0 ? (
            articles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                view="list" 
                isSaved={savedArticles.includes(article.id)}
                onToggleSave={() => onToggleSave(article.id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-secondary/30 p-4 rounded-full mb-4">
                <Rocket className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No articles found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}
    </ScrollArea>
  );
}
