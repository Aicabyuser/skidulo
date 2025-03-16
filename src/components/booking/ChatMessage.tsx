
import React from "react";
import { Bot, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface ChatMessageProps {
  role: 'assistant' | 'user';
  content: string;
  isRecommendation?: boolean;
  recommendedTime?: string;
  onSelectTime?: (time: string) => void;
}

const ChatMessage = ({ role, content, isRecommendation, recommendedTime, onSelectTime }: ChatMessageProps) => {
  const { t } = useTranslation();
  
  return (
    <div className={`flex items-start gap-2 ${role === 'assistant' ? '' : 'justify-end'}`}>
      {role === 'assistant' && (
        <div className="flex-shrink-0 w-8 h-8 bg-background rounded-full flex items-center justify-center border">
          <Bot className="h-4 w-4 text-highlight-purple" />
        </div>
      )}
      <div 
        className={`max-w-[80%] rounded-lg px-3 py-2 ${
          role === 'assistant' 
            ? 'bg-secondary/80 text-secondary-foreground' 
            : 'bg-highlight-purple/10 text-foreground'
        }`}
      >
        <p className="text-sm">{content}</p>
        {isRecommendation && recommendedTime && onSelectTime && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 text-xs flex items-center gap-1"
            onClick={() => onSelectTime(recommendedTime)}
          >
            <Clock className="h-3 w-3" />
            {t("booking.assistant.selectTime")} {recommendedTime}
          </Button>
        )}
      </div>
      {role === 'user' && (
        <div className="flex-shrink-0 w-8 h-8 bg-highlight-purple/10 rounded-full flex items-center justify-center border border-highlight-purple/20">
          <User className="h-4 w-4 text-highlight-purple" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
