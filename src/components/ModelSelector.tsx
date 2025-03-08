
import { useState } from "react";
import { AVAILABLE_MODELS, DEFAULT_MODEL } from "@/lib/openrouter";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  const currentModel = AVAILABLE_MODELS.find(model => model.id === selectedModel) || DEFAULT_MODEL;
  
  return (
    <div className="w-full sm:max-w-[240px] relative">
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-full bg-background border-border/50 focus:ring-primary/20 text-sm">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className="glass-card">
          <SelectGroup>
            {AVAILABLE_MODELS.map((model) => (
              <SelectItem
                key={model.id}
                value={model.id}
                className="flex flex-col items-start text-sm"
                onMouseEnter={() => setHoveredModel(model.id)}
                onMouseLeave={() => setHoveredModel(null)}
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
      
      <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
        <span>{isMobile ? currentModel.name.split(' ')[0] : currentModel.provider}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs p-3 space-y-2">
              <p className="font-medium">{currentModel.name}</p>
              <p className="text-xs">{currentModel.description}</p>
              {currentModel.strengths && (
                <div>
                  <p className="font-medium text-xs mt-1">Strengths:</p>
                  <ul className="text-xs list-disc pl-4 space-y-0.5 mt-1">
                    {currentModel.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
