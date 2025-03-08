
import { useState } from "react";

export function useThinking() {
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState("");

  const simulateThinking = async (prompt: string) => {
    setIsThinking(true);
    setThinkingText("");
    
    const generateThinkingPoints = (userPrompt: string) => {
      const thinkingPoints = [
        "Analyzing context and user intent...",
        `Researching information about "${userPrompt.substring(0, 20)}${userPrompt.length > 20 ? '...' : ''}"`,
        "Evaluating relevant knowledge and sources...",
        "Determining the most accurate response...",
        "Formulating a comprehensive answer..."
      ];
      
      if (userPrompt.toLowerCase().includes("code") || userPrompt.toLowerCase().includes("program")) {
        thinkingPoints.splice(2, 0, "Checking code syntax and best practices...");
      }
      if (userPrompt.toLowerCase().includes("history") || userPrompt.toLowerCase().includes("when")) {
        thinkingPoints.splice(2, 0, "Reviewing historical timeline and events...");
      }
      if (userPrompt.toLowerCase().includes("math") || userPrompt.toLowerCase().includes("calculate")) {
        thinkingPoints.splice(2, 0, "Performing mathematical calculations...");
      }
      
      return thinkingPoints;
    };
    
    const thinkingPoints = generateThinkingPoints(prompt);
    
    for (const point of thinkingPoints) {
      setThinkingText("");
      for (let i = 0; i < point.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 30));
        setThinkingText(prev => prev + point.charAt(i));
      }
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    
    const minimumThinkingTime = 1500;
    const startTime = Date.now();
    return () => {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minimumThinkingTime) {
        return new Promise(resolve => setTimeout(resolve, minimumThinkingTime - elapsedTime));
      }
      return Promise.resolve();
    };
  };

  return {
    isLoading,
    isThinking,
    thinkingText,
    simulateThinking,
    setIsLoading,
    setIsThinking,
  };
}
