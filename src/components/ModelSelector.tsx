
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
  
  // Find the current model in available models or fallback to default
  // If the selected model is no longer available, reset to default
  const currentModel = AVAILABLE_MODELS.find(model => model.id === selectedModel);
  
  // If current model is not found (might have been removed), reset to default
  if (!currentModel && selectedModel) {
    onModelChange(DEFAULT_MODEL.id);
  }
  
  const modelToDisplay = currentModel || DEFAULT_MODEL;
  
  return (
    <div className="w-full sm:max-w-[240px] relative">
      <Select 
        value={currentModel ? selectedModel : DEFAULT_MODEL.id} 
        onValueChange={onModelChange}
      >
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
        <span>{isMobile ? modelToDisplay.name.split(' ')[0] : modelToDisplay.provider}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs p-3 space-y-2">
              <p className="font-medium">{modelToDisplay.name}</p>
              <p className="text-xs">{modelToDisplay.description}</p>
              {modelToDisplay.strengths && (
                <div>
                  <p className="font-medium text-xs mt-1">Strengths:</p>
                  <ul className="text-xs list-disc pl-4 space-y-0.5 mt-1">
                    {modelToDisplay.strengths.map((strength, i) => (
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
