
import { Clock, Tag, User, ArrowUpRight, Share2, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Article } from "@/types/chat";

interface ArticleCardProps {
  article: Article;
  view: 'grid' | 'list';
  isSaved: boolean;
  onToggleSave: () => void;
}

export function ArticleCard({ 
  article, 
  view, 
  isSaved, 
  onToggleSave 
}: ArticleCardProps) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  if (view === 'list') {
    return (
      <div className="relative group">
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          <div className="flex gap-4 p-4 rounded-lg hover:bg-secondary/20 transition-colors border border-transparent hover:border-border/50">
            <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-secondary/30">
              <img 
                src={article.coverImage} 
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=News";
                }}
              />
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors flex items-center gap-1">
                {article.title}
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              
              <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                {article.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{article.author.name}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{article.readingTimeMinutes} min</span>
                </div>
                
                {article.tags[0] && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                    {article.tags[0]}
                  </Badge>
                )}
                
                <span className="text-[10px]">{formattedDate}</span>
              </div>
            </div>
          </div>
        </a>
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 bg-background/80 backdrop-blur-sm rounded-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSave();
            }}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <a 
        href={article.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block h-full"
      >
        <div className="h-full space-y-3 bg-background rounded-lg border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300">
          <div className="aspect-video overflow-hidden relative">
            <img 
              src={article.coverImage} 
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=News";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-2 right-2">
              <Badge className="bg-background/80 backdrop-blur-sm text-xs hover:bg-background/90">
                <Tag className="h-3 w-3 mr-1" />
                <span>{article.tags[0] || "News"}</span>
              </Badge>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full overflow-hidden bg-secondary">
                <img 
                  src={article.author.profileImage}
                  alt={article.author.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author.name)}&background=random`;
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{article.author.name}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </div>
            
            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors flex items-start gap-1">
              {article.title}
              <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {article.description}
            </p>
            
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{article.readingTimeMinutes} min read</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Share2 className="h-3 w-3" />
                  <span>Share</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-3 left-3 h-8 w-8 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleSave();
        }}
      >
        {isSaved ? (
          <BookmarkCheck className="h-4 w-4 text-primary" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
