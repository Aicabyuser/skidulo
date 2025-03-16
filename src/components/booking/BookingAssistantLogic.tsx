import { fetchRecommendedTimeSlot } from "@/lib/api";
import { format } from "date-fns";

export interface Message {
  role: 'assistant' | 'user';
  content: string;
  isRecommendation?: boolean;
  recommendedTime?: string;
}

interface TimeSlotPreference {
  time: string;
  score: number;
}

interface BookingAssistantLogicProps {
  userMessage: string;
  username: string | undefined;
  selectedDate: Date | undefined;
  availableSlots: string[] | undefined;
  messages: Message[];
}

// Helper function to categorize time slots
const categorizeTimeSlots = (slots: string[]) => {
  return {
    morning: slots.filter(slot => {
      const hour = parseInt(slot.split(':')[0]);
      return hour >= 7 && hour < 12;
    }),
    afternoon: slots.filter(slot => {
      const hour = parseInt(slot.split(':')[0]);
      return hour >= 12 && hour < 17;
    }),
    evening: slots.filter(slot => {
      const hour = parseInt(slot.split(':')[0]);
      return hour >= 17;
    })
  };
};

// Score time slots based on criteria and preferences
const scoreTimeSlots = (
  slots: string[], 
  preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening'
): TimeSlotPreference[] => {
  const now = new Date();
  const currentHour = now.getHours();
  
  return slots.map(slot => {
    const hour = parseInt(slot.split(':')[0]);
    let score = 0;
    
    // Base score for being in preferred time of day
    if (preferredTimeOfDay === 'morning' && hour >= 7 && hour < 12) {
      score += 3;
    } else if (preferredTimeOfDay === 'afternoon' && hour >= 12 && hour < 17) {
      score += 3;
    } else if (preferredTimeOfDay === 'evening' && hour >= 17) {
      score += 3;
    }
    
    // Score for proximity to user's current time
    // Higher score for times a few hours from current time
    const hourDifference = Math.abs(hour - currentHour);
    if (hourDifference >= 2 && hourDifference <= 6) {
      score += 2;
    } else if (hourDifference < 2) {
      score += 1; // Too soon
    }
    
    // Business hours preference (9AM-5PM)
    if (hour >= 9 && hour <= 17) {
      score += 1;
    }
    
    // Time slot clustering - prefer slots that aren't isolated
    // This is a simple approximation
    const hourSlots = slots.filter(s => {
      const h = parseInt(s.split(':')[0]);
      return Math.abs(h - hour) <= 1;
    });
    
    if (hourSlots.length > 1) {
      score += 1; // There are other slots close to this one
    }
    
    return { time: slot, score };
  });
};

// Extract context from conversation
const extractContextFromMessages = (messages: Message[]): { 
  preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening';
  previousRecommendations: string[];
} => {
  let preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | undefined;
  const previousRecommendations: string[] = [];
  
  // Analyze past messages
  for (const message of messages) {
    const content = message.content.toLowerCase();
    
    // Check for time preferences
    if (content.includes('morning')) {
      preferredTimeOfDay = 'morning';
    } else if (content.includes('afternoon')) {
      preferredTimeOfDay = 'afternoon';
    } else if (content.includes('evening')) {
      preferredTimeOfDay = 'evening';
    }
    
    // Store recommended times to avoid repetition
    if (message.recommendedTime) {
      previousRecommendations.push(message.recommendedTime);
    }
  }
  
  return { preferredTimeOfDay, previousRecommendations };
};

// Helper to get best time based on preferences
const getBestTimeSlot = (
  availableSlots: string[],
  preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening',
  previousRecommendations: string[] = []
): string => {
  // Get scored slots
  const scoredSlots = scoreTimeSlots(availableSlots, preferredTimeOfDay);
  
  // Sort by score, descending
  scoredSlots.sort((a, b) => b.score - a.score);
  
  // First try to find high-scoring slot not previously recommended
  const newRecommendation = scoredSlots.find(
    slot => !previousRecommendations.includes(slot.time)
  );
  
  // Return best new recommendation or fall back to highest scored
  return newRecommendation ? newRecommendation.time : scoredSlots[0].time;
};

export const processUserMessage = async ({
  userMessage,
  username,
  selectedDate,
  availableSlots,
  messages
}: BookingAssistantLogicProps): Promise<Message> => {
  
  if (!username || !selectedDate || !availableSlots || availableSlots.length === 0) {
    return { 
      role: 'assistant', 
      content: "I don't see any available slots for the selected date. Please choose another date with available slots."
    };
  }

  // Extract context from previous conversation
  const { preferredTimeOfDay, previousRecommendations } = extractContextFromMessages([...messages, { role: 'user', content: userMessage }]);
  
  // Categorize available time slots
  const { morning, afternoon, evening } = categorizeTimeSlots(availableSlots);
  
  const userMessageLower = userMessage.toLowerCase();
  
  // Handle specific time of day requests
  if (userMessageLower.includes('morning')) {
    if (morning.length > 0) {
      const recommendedSlot = getBestTimeSlot(morning, 'morning', previousRecommendations);
      return { 
        role: 'assistant', 
        content: `I recommend booking at ${recommendedSlot}. This morning slot should work well with your schedule. Would that work for you?`,
        isRecommendation: true,
        recommendedTime: recommendedSlot
      };
    } else {
      const alternativeText = afternoon.length > 0 
        ? "Would you prefer an afternoon slot instead?"
        : "Would you prefer a different time instead?";
      
      return { 
        role: 'assistant', 
        content: `There are no morning slots available for this date. ${alternativeText}`
      };
    }
  } else if (userMessageLower.includes('afternoon')) {
    if (afternoon.length > 0) {
      const recommendedSlot = getBestTimeSlot(afternoon, 'afternoon', previousRecommendations);
      return { 
        role: 'assistant', 
        content: `I recommend booking at ${recommendedSlot}. This afternoon time should fit your schedule well. Does that work for you?`,
        isRecommendation: true,
        recommendedTime: recommendedSlot
      };
    } else {
      const alternativeText = morning.length > 0 
        ? "Would you prefer a morning slot instead?"
        : evening.length > 0 
          ? "Would you prefer an evening slot instead?"
          : "Would you prefer another date?";
          
      return { 
        role: 'assistant', 
        content: `There are no afternoon slots available for this date. ${alternativeText}`
      };
    }
  } else if (userMessageLower.includes('evening')) {
    if (evening.length > 0) {
      const recommendedSlot = getBestTimeSlot(evening, 'evening', previousRecommendations);
      return { 
        role: 'assistant', 
        content: `I recommend booking at ${recommendedSlot}. This evening slot should work well for you. Does that work for you?`,
        isRecommendation: true,
        recommendedTime: recommendedSlot
      };
    } else {
      const alternativeText = afternoon.length > 0 
        ? "Would you prefer an afternoon slot instead?"
        : "Would you prefer an earlier time instead?";
          
      return { 
        role: 'assistant', 
        content: `There are no evening slots available for this date. ${alternativeText}`
      };
    }
  } else if (userMessageLower.includes('yes') || userMessageLower.includes('book') || 
             userMessageLower.includes('work') || userMessageLower.includes('good') || 
             userMessageLower.includes('great') || userMessageLower.includes('perfect')) {
    // If user agrees to a recommendation that was made previously
    const lastRecommendation = [...messages].reverse().find(m => m.isRecommendation);
    
    if (lastRecommendation && lastRecommendation.recommendedTime) {
      return { 
        role: 'assistant', 
        content: `Great! I've selected ${lastRecommendation.recommendedTime} for you. Please continue with your booking.`,
        recommendedTime: lastRecommendation.recommendedTime
      };
    } else {
      // Get AI recommended time slot
      try {
        const recommendedTime = await fetchRecommendedTimeSlot(username, selectedDate, availableSlots);
        return { 
          role: 'assistant', 
          content: `I've selected ${recommendedTime} for you based on your preferences and availability. Please continue with your booking.`,
          recommendedTime: recommendedTime
        };
      } catch (error) {
        console.error("Error fetching recommended slot:", error);
        const bestTimeSlot = getBestTimeSlot(availableSlots, preferredTimeOfDay, previousRecommendations);
        return { 
          role: 'assistant', 
          content: `I recommend ${bestTimeSlot} based on typical availability patterns. Please continue with your booking.`,
          recommendedTime: bestTimeSlot
        };
      }
    }
  } else if (userMessageLower.includes('recommend') || userMessageLower.includes('suggest') || 
             userMessageLower.includes('best') || userMessageLower.includes('good time') || 
             userMessageLower.includes('time for me') || userMessageLower.includes('available')) {
    // Direct request for a recommendation
    try {
      const recommendedTime = await fetchRecommendedTimeSlot(username, selectedDate, availableSlots);
      return { 
        role: 'assistant', 
        content: `Based on typical booking patterns, I'd recommend ${recommendedTime}. Would that work for you?`,
        isRecommendation: true,
        recommendedTime: recommendedTime
      };
    } catch (error) {
      console.error("Error fetching recommended slot:", error);
      // Fallback to local logic
      const bestTimeSlot = getBestTimeSlot(availableSlots, preferredTimeOfDay, previousRecommendations);
      return { 
        role: 'assistant', 
        content: `I recommend ${bestTimeSlot} based on available times. Would that work for you?`,
        isRecommendation: true,
        recommendedTime: bestTimeSlot
      };
    }
  } else if (userMessageLower.includes('busy') || userMessageLower.includes('popular') || 
             userMessageLower.includes('quiet') || userMessageLower.includes('available time')) {
    // User is asking about busy/popular times
    return { 
      role: 'assistant', 
      content: `Morning slots between 9-11am and afternoon slots around 2-3pm tend to be popular. Would you prefer morning, afternoon, or evening?`
    };
  } else if (userMessageLower.includes('no') || userMessageLower.includes('don\'t') || 
             userMessageLower.includes('doesn\'t') || userMessageLower.includes('not')) {
    // User rejected previous suggestion
    const timeOfDay = preferredTimeOfDay || 
                      (morning.length > 0 ? 'morning' : 
                      (afternoon.length > 0 ? 'afternoon' : 'evening'));
    
    let availableOptions;
    switch(timeOfDay) {
      case 'morning':
        availableOptions = morning.length > 0 ? morning : availableSlots;
        break;
      case 'afternoon':
        availableOptions = afternoon.length > 0 ? afternoon : availableSlots;
        break;
      case 'evening':
        availableOptions = evening.length > 0 ? evening : availableSlots;
        break;
      default:
        availableOptions = availableSlots;
    }
    
    // Filter out previously recommended slots to give a new option
    const newOptions = availableOptions.filter(slot => !previousRecommendations.includes(slot));
    
    if (newOptions.length > 0) {
      const alternativeTime = getBestTimeSlot(newOptions, preferredTimeOfDay);
      return { 
        role: 'assistant', 
        content: `How about ${alternativeTime} instead? Would that work better for you?`,
        isRecommendation: true,
        recommendedTime: alternativeTime
      };
    } else {
      return { 
        role: 'assistant', 
        content: `Would you prefer to look at a different date? Or would you like to see all available times for ${format(selectedDate, 'EEEE, MMMM d')}?`
      };
    }
  } else {
    // Generic response for other queries
    return { 
      role: 'assistant', 
      content: "Would you prefer a morning, afternoon, or evening appointment? I can help find the best time for you."
    };
  }
};
