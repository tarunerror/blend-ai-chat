
import Articles from "@/components/Articles";

interface ArticlesContainerProps {
  onClose: () => void;
}

export default function ArticlesContainer({ onClose }: ArticlesContainerProps) {
  return (
    <div className="flex-1 p-4 overflow-hidden">
      <Articles onClose={onClose} />
    </div>
  );
}
