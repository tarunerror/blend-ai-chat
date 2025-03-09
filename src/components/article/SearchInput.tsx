
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  resetSearch: () => void;
  isSearching: boolean;
}

export function SearchInput({
  searchQuery,
  setSearchQuery,
  handleSearch,
  resetSearch,
  isSearching
}: SearchInputProps) {
  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search space news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <div className="absolute left-3 top-2.5 text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
      </div>
      <Button type="submit" size="sm">Search</Button>
      {isSearching && (
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={resetSearch}
        >
          Clear
        </Button>
      )}
    </form>
  );
}
