
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SourceFilterProps {
  allTags: string[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

export function SourceFilter({
  allTags,
  selectedTag,
  setSelectedTag
}: SourceFilterProps) {
  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <Tag className="h-3 w-3 text-muted-foreground flex-shrink-0" />
        <div className="w-full overflow-x-auto topic-buttons-container">
          <div className="flex gap-2 items-center pb-1 pr-4">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              className="text-xs flex-shrink-0 topic-button"
              onClick={() => setSelectedTag(null)}
            >
              All Sources
            </Button>
            
            {allTags.slice(0, 15).map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                className="text-xs flex-shrink-0 whitespace-nowrap topic-button"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
