import { useEffect } from "react";
import { Rocket, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useArticles } from "@/hooks/useArticles";
import { ArticlesList } from "@/components/article/ArticlesList";
import { SearchInput } from "@/components/article/SearchInput";
import { TopicFilter } from "@/components/article/TopicFilter";
import { SourceFilter } from "@/components/article/SourceFilter";
import { ArticlePagination } from "@/components/article/ArticlePagination";
import { ArticleViewToggle } from "@/components/article/ArticleViewToggle";
import { NEWS_TOPICS } from "@/components/article/constants";

interface ArticlesProps {
  onClose: () => void;
}

export default function Articles({ onClose }: ArticlesProps) {
  const {
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
  } = useArticles();
  
  return (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur-sm rounded-lg border border-border animate-fade-in shadow-xl">
      <div className="p-4 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <Rocket className="h-5 w-5 text-primary animate-pulse-slow" />
          </div>
          <h2 className="text-lg font-medium">Spaceflight News Explorer</h2>
          <Badge variant="outline" className="ml-2 animate-fade-in">
            {articles?.length || 0} articles
          </Badge>
        </div>
        
        <ArticleViewToggle 
          viewMode={viewMode}
          setViewMode={setViewMode}
          refetchArticles={refetchArticles}
          onClose={onClose}
        />
      </div>
      
      <Tabs 
        defaultValue="trending" 
        className="w-full" 
        onValueChange={(value) => {
          setActiveTab(value as 'trending' | 'latest');
          setCurrentPage(1);
        }}
      >
        <div className="px-4 pt-2">
          <TabsList className="w-full mb-2 p-1 bg-secondary/30 backdrop-blur-sm">
            <TabsTrigger value="trending" className="flex items-center gap-1 flex-1 data-[state=active]:bg-primary/20">
              <Rocket className="h-3.5 w-3.5" />
              <span>Latest Space News</span>
            </TabsTrigger>
            <TabsTrigger value="latest" className="flex items-center gap-1 flex-1 data-[state=active]:bg-primary/20">
              <Newspaper className="h-3.5 w-3.5" />
              <span>Search News</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="px-4 py-2 border-b border-border">
          {activeTab === 'trending' ? (
            <TopicFilter
              topics={NEWS_TOPICS}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
            />
          ) : (
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              resetSearch={resetSearch}
              isSearching={isSearching}
            />
          )}
          
          {articles && articles.length > 0 && allTags.length > 0 && activeTab === 'latest' && (
            <SourceFilter
              allTags={allTags}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
            />
          )}
        </div>
        
        <TabsContent value="trending" className="flex-1 m-0">
          <ArticlesList 
            articles={filteredArticles} 
            isLoading={isLoading} 
            viewMode={viewMode}
            savedArticles={savedArticles}
            onToggleSave={toggleSaveArticle}
          />
        </TabsContent>
        
        <TabsContent value="latest" className="flex-1 m-0">
          <ArticlesList 
            articles={filteredArticles} 
            isLoading={isLoading} 
            viewMode={viewMode}
            savedArticles={savedArticles}
            onToggleSave={toggleSaveArticle}
          />
        </TabsContent>
      </Tabs>
      
      {/* Pagination controls */}
      {articles && articles.length > 0 && (
        <ArticlePagination 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
