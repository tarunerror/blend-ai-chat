
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ArticlePaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export function ArticlePagination({
  currentPage,
  setCurrentPage
}: ArticlePaginationProps) {
  const handlePrevious = () => {
    setCurrentPage(Math.max(1, currentPage - 1));
  };
  
  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="p-4 border-t border-border flex justify-between items-center bg-background/80 backdrop-blur-sm">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      
      <span className="text-sm text-muted-foreground">
        Page {currentPage}
      </span>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleNext}
      >
        Next
      </Button>
    </div>
  );
}
