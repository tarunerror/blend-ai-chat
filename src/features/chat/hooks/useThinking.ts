
import { useState, useEffect } from "react";

const thinkingPhrases = [
  "Analyzing the context...",
  "Thinking about this...",
  "Processing your request...",
  "Considering all angles...",
  "Gathering relevant information...",
  "Formulating a response...",
  "Connecting the dots...",
];

export function useThinking() {
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState("");

  // Simulate AI thinking process with typing animation
  const simulateThinking = async (prompt: string): Promise<() => Promise<void>> => {
    setIsThinking(true);
    
    // Choose a thinking phrase based on the prompt
    const basePhrase = thinkingPhrases[Math.floor(Math.random() * thinkingPhrases.length)];
    let currentText = "";
    
    const typeThinking = () => {
      return new Promise<void>((resolve) => {
        let i = 0;
        const interval = setInterval(() => {
          if (i < basePhrase.length) {
            currentText += basePhrase.charAt(i);
            setThinkingText(currentText);
            i++;
          } else {
            clearInterval(interval);
            resolve();
          }
        }, 40);
      });
    };
    
    await typeThinking();
    
    // Return a function that can be called to finish the thinking animation
    return async () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setIsThinking(false);
          setThinkingText("");
          resolve();
        }, 500);
      });
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
