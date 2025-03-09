
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Article } from "@/types/chat";
import { fetchNewsArticles } from "@/lib/newsapi";

export function useArticles() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'trending' | 'latest'>('trending');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Load saved articles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedArticles');
    if (saved) {
      setSavedArticles(JSON.parse(saved));
    }
  }, []);
  
  // Save articles to localStorage when changed
  useEffect(() => {
    localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
  }, [savedArticles]);
  
  // Function to toggle saving an article
  const toggleSaveArticle = useCallback((articleId: string) => {
    setSavedArticles(prev => {
      if (prev.includes(articleId)) {
        toast({
          title: "Article removed from bookmarks",
          description: "You can add it back anytime.",
        });
        return prev.filter(id => id !== articleId);
      } else {
        toast({
          title: "Article saved to bookmarks",
          description: "You can find it in your saved articles.",
        });
        return [...prev, articleId];
      }
    });
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetchArticles();
    setIsSearching(!!searchQuery);
  };
  
  const resetSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    refetchArticles();
  };
  
  // Query for trending articles
  const { 
    data: trendingArticles, 
    isLoading: isTrendingLoading,
    error: trendingError,
    refetch: refetchTrending
  } = useQuery({
    queryKey: ["articles", "trending", currentPage],
    queryFn: () => fetchNewsArticles({
      pageSize: 50,
      page: currentPage
    }),
  });
  
  // Query for searched articles
  const { 
    data: latestArticles, 
    isLoading: isLatestLoading,
    error: latestError,
    refetch: refetchLatest
  } = useQuery({
    queryKey: ["articles", "latest", searchQuery, currentPage],
    queryFn: () => fetchNewsArticles({
      query: searchQuery,
      pageSize: 50,
      page: currentPage
    }),
    enabled: activeTab === 'latest' || isSearching
  });
  
  // Combined refetch function
  const refetchArticles = () => {
    if (activeTab === 'trending') {
      refetchTrending();
    } else {
      refetchLatest();
    }
  };
  
  const articles = activeTab === 'trending' ? trendingArticles : latestArticles;
  const isLoading = activeTab === 'trending' ? isTrendingLoading : isLatestLoading;
  const error = activeTab === 'trending' ? trendingError : latestError;
  
  // Extract unique tags (sources) from articles
  useEffect(() => {
    if (articles) {
      const tags = Array.from(
        new Set(articles.flatMap(article => article.tags))
      ).filter(Boolean);
      setAllTags(tags);
    }
  }, [articles]);
  
  // Filter articles by selected tag
  const filteredArticles = selectedTag 
    ? articles?.filter(article => article.tags.includes(selectedTag))
    : articles;
  
  // Display error toast if API fails
  useEffect(() => {
    if (error) {
      toast({
        title: "News API Error",
        description: "Failed to load articles. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error]);

  return {
    selectedTag,
    setSelectedTag,
    allTags,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    isSearching,
    setIsSearching,
    savedArticles,
    currentPage,
    setCurrentPage,
    toggleSaveArticle,
    handleSearch,
    resetSearch,
    refetchArticles,
    articles,
    filteredArticles,
    isLoading,
    error
  };
}
