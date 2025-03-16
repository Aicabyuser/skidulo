
import { useState, useCallback, useEffect } from "react";
import { Message, processUserMessage } from "@/components/booking/BookingAssistantLogic";
import { format } from "date-fns";

interface UseBookingChatProps {
  username: string | undefined;
  selectedDate: Date | undefined;
  onSelectTime: (time: string) => void;
  availableSlots: string[] | undefined;
}

export const useBookingChat = ({
  username,
  selectedDate,
  onSelectTime,
  availableSlots
}: UseBookingChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  // Initialize with dynamic welcome message based on time of day and available slots
  useEffect(() => {
    if (selectedDate && availableSlots) {
      const date = format(selectedDate, 'EEEE, MMMM d');
      let welcomeMessage = `Hi there! I can help you find the perfect time slot for ${date}.`;
      
      // Add information about available slots
      if (availableSlots.length > 0) {
        welcomeMessage += ` There are ${availableSlots.length} available times. What time of day works best for you? Morning, afternoon, or evening?`;
      } else {
        welcomeMessage += ` Unfortunately there are no available slots for this date. Please try another date.`;
      }
      
      setMessages([{ role: 'assistant', content: welcomeMessage }]);
    } else {
      setMessages([{ 
        role: 'assistant', 
        content: "Hi there! I can help you find the perfect time slot. What time of day works best for you? Morning, afternoon, or evening?" 
      }]);
    }
  }, [selectedDate, availableSlots]);

  const addUserMessage = useCallback((content: string) => {
    setMessages(prev => [...prev, { role: 'user', content }]);
  }, []);

  const addAssistantMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const handleSendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isThinking) return;
    
    // Add user message
    addUserMessage(userMessage);
    setIsThinking(true);

    try {
      // Process user message with a delay for a more natural feeling conversation
      setTimeout(async () => {
        try {
          const assistantResponse = await processUserMessage({
            userMessage,
            username,
            selectedDate,
            availableSlots,
            messages
          });
          
          addAssistantMessage(assistantResponse);
          
          // If there's a recommended time in the response and user accepts it, select it
          if (assistantResponse.recommendedTime && 
            (userMessage.toLowerCase().includes('yes') || 
             userMessage.toLowerCase().includes('book') || 
             userMessage.toLowerCase().includes('work') ||
             userMessage.toLowerCase().includes('good') ||
             userMessage.toLowerCase().includes('great') ||
             userMessage.toLowerCase().includes('ok') ||
             userMessage.toLowerCase().includes('okay'))) {
            onSelectTime(assistantResponse.recommendedTime);
          }
        } catch (error) {
          console.error("Error in processing message:", error);
          addAssistantMessage({ 
            role: 'assistant', 
            content: "I'm sorry, I encountered an issue with my recommendations. Could you try a different request or select a time manually?"
          });
        } finally {
          setIsThinking(false);
        }
      }, 800);
    } catch (error) {
      console.error("Error in AI assistant:", error);
      addAssistantMessage({ 
        role: 'assistant', 
        content: "I'm having trouble finding recommendations right now. Please select a time slot manually."
      });
      setIsThinking(false);
    }
  }, [addUserMessage, addAssistantMessage, isThinking, username, selectedDate, availableSlots, messages, onSelectTime]);

  return {
    messages,
    isThinking,
    handleSendMessage,
  };
};
