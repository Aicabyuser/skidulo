
import React from "react";
import { Bot } from "lucide-react";

const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-2">
      <div className="flex-shrink-0 w-8 h-8 bg-background rounded-full flex items-center justify-center border">
        <Bot className="h-4 w-4 text-highlight-purple" />
      </div>
      <div className="bg-secondary/80 text-secondary-foreground max-w-[80%] rounded-lg px-3 py-2">
        <div className="flex gap-1 items-center">
          <div className="h-2 w-2 bg-highlight-purple/50 rounded-full animate-pulse"></div>
          <div className="h-2 w-2 bg-highlight-purple/50 rounded-full animate-pulse delay-75"></div>
          <div className="h-2 w-2 bg-highlight-purple/50 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
