
import { AVAILABLE_MODELS, DEFAULT_MODEL } from "@/lib/openrouter";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <div className="w-full max-w-[220px]">
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-full bg-background border-border/50 focus:ring-primary/20">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className="glass-card">
          <SelectGroup>
            {AVAILABLE_MODELS.map((model) => (
              <SelectItem
                key={model.id}
                value={model.id}
                className="flex flex-col items-start"
              >
                <div className="flex items-center gap-2">
                  <span>{model.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {model.provider}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
