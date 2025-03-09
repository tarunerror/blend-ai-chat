
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopicFilterProps {
  topics: string[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

export function TopicFilter({
  topics,
  selectedTag,
  setSelectedTag
}: TopicFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
      <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div className="flex gap-2 items-center">
        {topics.map(topic => (
          <Button
            key={topic}
            variant={selectedTag === (topic === "All" ? null : topic) ? "default" : "outline"}
            size="sm"
            className="text-xs capitalize flex-shrink-0 animate-fade-in"
            onClick={() => {
              setSelectedTag(topic === "All" ? null : topic);
            }}
          >
            {topic}
          </Button>
        ))}
      </div>
    </div>
  );
}
