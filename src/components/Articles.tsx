
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, Tag, User, X, Code, BookOpen, ArrowUpRight, MessageSquare, Filter, Zap, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Article } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ArticlesProps {
  onClose: () => void;
}

async function fetchArticles(type: 'top' | 'latest'): Promise<Article[]> {
  const endpoint = type === 'top' ? "https://dev.to/api/articles?top=15" : "https://dev.to/api/articles?state=fresh&per_page=15";
  const response = await fetch(endpoint);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type} articles`);
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
      profileImage: article.user.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.user.name)}&background=random`,
    },
    tags: article.tags ? article.tags.split(", ") : [],
  }));
}

export default function Articles({ onClose }: ArticlesProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'trending' | 'latest'>('trending');
  
  const { 
    data: trendingArticles, 
    isLoading: isTrendingLoading, 
    error: trendingError 
  } = useQuery({
    queryKey: ["articles", "trending"],
    queryFn: () => fetchArticles('top'),
  });
  
  const { 
    data: latestArticles, 
    isLoading: isLatestLoading, 
    error: latestError 
  } = useQuery({
    queryKey: ["articles", "latest"],
    queryFn: () => fetchArticles('latest'),
  });
  
  const articles = activeTab === 'trending' ? trendingArticles : latestArticles;
  const isLoading = activeTab === 'trending' ? isTrendingLoading : isLatestLoading;
  const error = activeTab === 'trending' ? trendingError : latestError;
  
  useEffect(() => {
    if (articles) {
      const tags = Array.from(
        new Set(articles.flatMap(article => article.tags))
      ).filter(Boolean);
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
    <div className="flex flex-col h-full bg-background rounded-lg border border-border animate-fade-in shadow-lg">
      <div className="p-4 flex items-center justify-between sticky top-0 bg-background border-b border-border z-10">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-medium">Developer Articles</h2>
        </div>
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
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs 
        defaultValue="trending" 
        className="w-full" 
        onValueChange={(value) => setActiveTab(value as 'trending' | 'latest')}
      >
        <div className="px-4 pt-2">
          <TabsList className="w-full mb-2">
            <TabsTrigger value="trending" className="flex items-center gap-1 flex-1">
              <Zap className="h-3.5 w-3.5" />
              <span>Trending</span>
            </TabsTrigger>
            <TabsTrigger value="latest" className="flex items-center gap-1 flex-1">
              <ScrollText className="h-3.5 w-3.5" />
              <span>Latest</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Fix the topics filter section to be visible on all screen sizes */}
        <div className="px-4 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <ScrollArea className="w-full" orientation="horizontal">
              <div className="flex gap-2 items-center pb-1 pr-4">
                <Button
                  variant={selectedTag === null ? "default" : "outline"}
                  size="sm"
                  className="text-xs flex-shrink-0"
                  onClick={() => setSelectedTag(null)}
                >
                  All Topics
                </Button>
                
                {allTags.slice(0, 15).map(tag => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    className="text-xs flex-shrink-0 whitespace-nowrap"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        <TabsContent value="trending" className="flex-1 m-0">
          <ArticlesList 
            articles={filteredArticles} 
            isLoading={isLoading} 
            viewMode={viewMode} 
          />
        </TabsContent>
        
        <TabsContent value="latest" className="flex-1 m-0">
          <ArticlesList 
            articles={filteredArticles} 
            isLoading={isLoading} 
            viewMode={viewMode} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ArticlesList({ 
  articles, 
  isLoading, 
  viewMode 
}: { 
  articles?: Article[], 
  isLoading: boolean, 
  viewMode: 'grid' | 'list' 
}) {
  return (
    <ScrollArea className="flex-1">
      {viewMode === 'grid' ? (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons for grid view
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            ))
          ) : (
            articles?.map(article => (
              <ArticleCard key={article.id} article={article} view="grid" />
            ))
          )}
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {isLoading ? (
            // Loading skeletons for list view
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
          ) : (
            articles?.map(article => (
              <ArticleCard key={article.id} article={article} view="list" />
            ))
          )}
        </div>
      )}
    </ScrollArea>
  );
}

function ArticleCard({ article, view }: { article: Article; view: 'grid' | 'list' }) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  if (view === 'list') {
    return (
      <a 
        href={article.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block group"
      >
        <div className="flex gap-4 p-3 rounded-lg hover:bg-secondary/20 transition-colors">
          <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
            <img 
              src={article.coverImage} 
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://picsum.photos/seed/" + article.id + "/800/450";
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
    );
  }

  return (
    <a 
      href={article.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="space-y-3 hover-scale bg-background rounded-lg border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-all">
        <div className="aspect-video overflow-hidden relative">
          <img 
            src={article.coverImage} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://picsum.photos/seed/" + article.id + "/800/450";
            }}
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-background/80 backdrop-blur-sm text-xs hover:bg-background/90">
              <Code className="h-3 w-3 mr-1" />
              <span>{article.tags[0] || "Tech"}</span>
            </Badge>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full overflow-hidden">
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
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{article.readingTimeMinutes} min read</span>
              </div>
              
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>Discuss</span>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              Save
            </Button>
          </div>
        </div>
      </div>
    </a>
  );
}
