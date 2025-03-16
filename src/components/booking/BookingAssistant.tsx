
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
import { useBookingChat } from "@/hooks/useBookingChat";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface BookingAssistantProps {
  username: string | undefined;
  selectedDate: Date | undefined;
  onSelectTime: (time: string) => void;
  availableSlots: string[] | undefined;
}

const BookingAssistant = ({ username, selectedDate, onSelectTime, availableSlots }: BookingAssistantProps) => {
  const { t } = useTranslation();
  const { messages, isThinking, handleSendMessage } = useBookingChat({
    username,
    selectedDate,
    onSelectTime,
    availableSlots
  });

  // Generate subtitle text based on date and available slots
  const getSubtitleText = () => {
    if (!selectedDate) return t("booking.assistant.askAbout");
    
    const dateText = format(selectedDate, "EEEE, MMMM d");
    
    if (!availableSlots || availableSlots.length === 0) {
      return `${t("booking.assistant.noSlots")} ${dateText}`;
    }
    
    return `${t("booking.assistant.askAboutDate")} ${dateText}`;
  };

  return (
    <Card className="relative h-[360px] flex flex-col overflow-hidden backdrop-blur-sm bg-card/50 border-highlight-purple/10">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-highlight-purple" />
          <CardTitle className="text-lg">{t("booking.assistant.title")}</CardTitle>
        </div>
        <CardDescription>{getSubtitleText()}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto scrollbar-thin pb-0">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
              isRecommendation={message.isRecommendation}
              recommendedTime={message.recommendedTime}
              onSelectTime={onSelectTime}
            />
          ))}
          {isThinking && <TypingIndicator />}
        </div>
      </CardContent>
      <CardFooter className="pt-3 pb-2">
        <ChatInput 
          onSubmit={handleSendMessage}
          isDisabled={isThinking || (!availableSlots || availableSlots.length === 0)}
        />
      </CardFooter>
    </Card>
  );
};

export default BookingAssistant;
