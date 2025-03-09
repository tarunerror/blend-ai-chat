
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

// Thinking process simulation phrases
const thinkingProcessPhrases = [
  "Let me think about this question...",
  "I need to consider several aspects here...",
  "This requires careful analysis...",
  "Breaking down the problem step by step...",
  "Examining different perspectives on this...",
  "Let's approach this systematically...",
  "I should consider the relevant context...",
  "Drawing from my knowledge base...",
  "Connecting related concepts together...",
  "Building a coherent explanation...",
  "Structuring a clear response for you...",
  "Making sure my reasoning is sound...",
];

// Real-time thinking snippets
const thinkingSnippets = [
  "First, I should understand what's being asked...",
  "The key elements in this question are...",
  "This relates to concepts in...",
  "I need to clarify the underlying assumptions...",
  "Let me break this down into manageable parts...",
  "The approach here should involve...",
  "An important consideration is...",
  "Looking at similar cases, we can see that...",
  "This reminds me of...",
  "What are the potential implications?",
  "The most accurate way to address this is...",
  "Let me evaluate different perspectives...",
  "The evidence suggests that...",
  "Drawing from established principles...",
  "I should structure my response to emphasize...",
  "The connection between these ideas is...",
  "A helpful framework to understand this is...",
  "To ensure accuracy, I need to check...",
  "An example that illustrates this concept is...",
  "In conclusion, the most important points are...",
];

export function useThinking() {
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState("");
  const [realTimeThinking, setRealTimeThinking] = useState<string[]>([]);
  const [isStreamingThoughts, setIsStreamingThoughts] = useState(false);

  // Clear thinking state when not thinking
  useEffect(() => {
    if (!isThinking) {
      setRealTimeThinking([]);
    }
  }, [isThinking]);

  // Simulate AI thinking process with typing animation
  const simulateThinking = async (prompt: string): Promise<() => Promise<void>> => {
    setIsThinking(true);
    setIsStreamingThoughts(true);
    
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
    
    // Start the real-time thinking stream
    startThinkingStream();
    
    // Return a function that can be called to finish the thinking animation
    return async () => {
      return new Promise<void>((resolve) => {
        setIsStreamingThoughts(false);
        setTimeout(() => {
          setIsThinking(false);
          setThinkingText("");
          setRealTimeThinking([]);
          resolve();
        }, 500);
      });
    };
  };

  // Simulate a stream of thinking thoughts
  const startThinkingStream = () => {
    // Start with an introductory phrase
    const initialThought = thinkingProcessPhrases[
      Math.floor(Math.random() * thinkingProcessPhrases.length)
    ];
    setRealTimeThinking([initialThought]);
    
    // Generate new thoughts every 1-3 seconds
    let timeoutIds: NodeJS.Timeout[] = [];
    
    const generateThought = (index: number) => {
      // Maximum 10 thoughts or until streaming is stopped
      if (index < 20) {
        const delay = 800 + Math.random() * 1500; // Random delay between 0.8-2.3 seconds
        
        const timeoutId = setTimeout(() => {
          if (isStreamingThoughts) {
            const newThought = thinkingSnippets[
              Math.floor(Math.random() * thinkingSnippets.length)
            ];
            
            setRealTimeThinking(prev => {
              // Avoid duplicate consecutive thoughts
              if (prev.length > 0 && prev[prev.length - 1] === newThought) {
                const alternateThought = thinkingSnippets[
                  (thinkingSnippets.indexOf(newThought) + 1) % thinkingSnippets.length
                ];
                return [...prev, alternateThought];
              }
              return [...prev, newThought];
            });
            
            generateThought(index + 1);
          }
        }, delay);
        
        timeoutIds.push(timeoutId);
      }
    };
    
    generateThought(0);
    
    // Cleanup on component unmount
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      setIsStreamingThoughts(false);
    };
  };

  return {
    isLoading,
    isThinking,
    thinkingText,
    realTimeThinking,
    simulateThinking,
    setIsLoading,
    setIsThinking,
  };
}
