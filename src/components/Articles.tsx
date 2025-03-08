
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, Tag, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Article } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ArticlesProps {
  onClose: () => void;
}

async function fetchArticles(): Promise<Article[]> {
  const response = await fetch("https://dev.to/api/articles?top=10");
  
  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }
  
  const data = await response.json();
  
  return data.map((article: any) => ({
    id: article.id.toString(),
    title: article.title,
    description: article.description || "No description available",
    url: article.url,
    coverImage: article.cover_image || "https://picsum.photos/seed/" + article.id + "/800/450",
    publishedAt: article.published_at,
    readingTimeMinutes: article.reading_time_minutes || Math.ceil(article.body_markdown?.length / 1500) || 3,
    author: {
      name: article.user.name,
      profileImage: article.user.profile_image,
    },
    tags: article.tags,
  }));
}

export default function Articles({ onClose }: ArticlesProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });
  
  useEffect(() => {
    if (articles) {
      const tags = Array.from(new Set(articles.flatMap(article => article.tags)));
      setAllTags(tags);
    }
  }, [articles]);
  
  const filteredArticles = selectedTag 
    ? articles?.filter(article => article.tags.includes(selectedTag))
    : articles;
  
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load articles. Please try again later.",
      variant: "destructive",
    });
  }
  
  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-border animate-fade-in">
      <div className="p-4 flex items-center justify-between sticky top-0 bg-background border-b border-border z-10">
        <h2 className="text-lg font-medium">Developer Articles</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 border-b border-border overflow-x-auto">
        <div className="flex gap-2">
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            className="text-xs"
            onClick={() => setSelectedTag(null)}
          >
            All
          </Button>
          
          {allTags.slice(0, 10).map(tag => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-32 w-full" />
              </div>
            ))
          ) : (
            filteredArticles?.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <a 
      href={article.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="space-y-3 hover-scale">
        <div className="aspect-video overflow-hidden rounded-lg">
          <img 
            src={article.coverImage} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://picsum.photos/seed/" + article.id + "/800/450";
            }}
          />
        </div>
        
        <div>
          <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {article.description}
          </p>
          
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{article.author.name}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{article.readingTimeMinutes} min read</span>
            </div>
            
            {article.tags[0] && (
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span>{article.tags[0]}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Separator className="mt-6" />
    </a>
  );
}
