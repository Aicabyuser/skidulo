import { format } from "date-fns";

// Mock data for provider profiles
const providers = [
  {
    username: "johndoe",
    name: "John Doe",
    title: "Business Consultant",
    bio: "I help businesses optimize their operations and growth strategies with 10+ years of experience in the industry.",
    avatar: "https://i.pravatar.cc/150?u=johndoe",
    serviceName: "Business Strategy Session",
    serviceDescription: "One-on-one consultation to discuss your business challenges and develop actionable strategies.",
    duration: 30,
    price: 0, // Free
    availability: {
      monday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
      tuesday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
      wednesday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
      thursday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
      friday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
    },
    popularTimes: {
      morning: ["10:00", "11:00"],
      afternoon: ["14:00", "15:00"],
      evening: []
    }
  },
  {
    username: "janedoe",
    name: "Jane Doe",
    title: "Career Coach",
    bio: "Certified career coach helping professionals navigate career transitions and achieve their professional goals.",
    avatar: "https://i.pravatar.cc/150?u=janedoe",
    serviceName: "Career Coaching Session",
    serviceDescription: "Personalized coaching to help you navigate your career path and achieve your professional goals.",
    duration: 45,
    price: 50, // $50 per session
    availability: {
      monday: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      tuesday: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      wednesday: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      thursday: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      friday: ["10:00", "11:00", "14:00"],
    },
    popularTimes: {
      morning: ["11:00"],
      afternoon: ["14:00", "15:00"],
      evening: ["16:00"]
    }
  },
];

// Mock user booking history for personalization
const userBookingHistory = {
  // Simulating history based on user device/browser fingerprint
  timePreferences: {
    morningBookings: 2,
    afternoonBookings: 5,
    eveningBookings: 1
  },
  preferredDays: ["tuesday", "thursday"],
  lastBookedTime: "14:00"
};

// Fetch provider profile
export const fetchProviderProfile = async (username: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const provider = providers.find(p => p.username === username);
  
  if (!provider) {
    throw new Error("Provider not found");
  }
  
  return provider;
};

// Fetch available time slots for a specific date
export const fetchAvailableTimeSlots = async (username: string, date: Date) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const provider = providers.find(p => p.username === username);
  
  if (!provider) {
    throw new Error("Provider not found");
  }
  
  // Get day of week
  const dayOfWeek = format(date, "EEEE").toLowerCase();
  
  // Get available slots for this day
  let availableSlots: string[] = [];
  
  if (dayOfWeek === "monday" && provider.availability.monday) {
    availableSlots = provider.availability.monday;
  } else if (dayOfWeek === "tuesday" && provider.availability.tuesday) {
    availableSlots = provider.availability.tuesday;
  } else if (dayOfWeek === "wednesday" && provider.availability.wednesday) {
    availableSlots = provider.availability.wednesday;
  } else if (dayOfWeek === "thursday" && provider.availability.thursday) {
    availableSlots = provider.availability.thursday;
  } else if (dayOfWeek === "friday" && provider.availability.friday) {
    availableSlots = provider.availability.friday;
  }
  
  // Simulate some slots being already booked
  // In a real app, you would check against actual bookings in the database
  if (date.getDate() % 2 === 0) {
    availableSlots = availableSlots.filter((_, index) => index % 2 === 0);
  } else {
    availableSlots = availableSlots.filter((_, index) => index % 3 !== 0);
  }
  
  return availableSlots;
};

// Enhanced AI-powered function to get recommended time slot
export const fetchRecommendedTimeSlot = async (
  username: string, 
  date: Date, 
  availableSlots: string[]
): Promise<string> => {
  // Simulate API call delay to AI service
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  if (!availableSlots || availableSlots.length === 0) {
    throw new Error("No available slots");
  }
  
  const provider = providers.find(p => p.username === username);
  if (!provider) {
    throw new Error("Provider not found");
  }
  
  // Get day of week for determining if it's a preferred day
  const dayOfWeek = format(date, "EEEE").toLowerCase();
  const isPreferredDay = userBookingHistory.preferredDays.includes(dayOfWeek);
  
  // Get current time to determine time of day preferences
  const now = new Date();
  const currentHour = now.getHours();
  
  // Determine time of day (morning, afternoon, evening)
  let timeOfDay = "afternoon"; // Default
  if (currentHour < 12) {
    timeOfDay = "morning";
  } else if (currentHour >= 17) {
    timeOfDay = "evening";
  }
  
  // Filter slots by time of day
  const morningSlots = availableSlots.filter(slot => {
    const hour = parseInt(slot.split(':')[0]);
    return hour >= 8 && hour < 12;
  });
  
  const afternoonSlots = availableSlots.filter(slot => {
    const hour = parseInt(slot.split(':')[0]);
    return hour >= 12 && hour < 17;
  });
  
  const eveningSlots = availableSlots.filter(slot => {
    const hour = parseInt(slot.split(':')[0]);
    return hour >= 17;
  });
  
  // Determine user's preferred time based on history
  let userPreferredTimeOfDay = "afternoon";
  const { morningBookings, afternoonBookings, eveningBookings } = userBookingHistory.timePreferences;
  const totalBookings = morningBookings + afternoonBookings + eveningBookings;
  
  if (morningBookings > afternoonBookings && morningBookings > eveningBookings) {
    userPreferredTimeOfDay = "morning";
  } else if (eveningBookings > morningBookings && eveningBookings > afternoonBookings) {
    userPreferredTimeOfDay = "evening";
  }
  
  // Check if provider has popular times and if any match user preferences
  if (provider.popularTimes[userPreferredTimeOfDay].length > 0) {
    const popularSlots = provider.popularTimes[userPreferredTimeOfDay].filter(
      time => availableSlots.includes(time)
    );
    
    if (popularSlots.length > 0) {
      return popularSlots[0]; // Return the first popular slot that matches user preference
    }
  }
  
  // Try to find a slot matching user preference
  let preferredSlots: string[] = [];
  if (userPreferredTimeOfDay === "morning" && morningSlots.length > 0) {
    preferredSlots = morningSlots;
  } else if (userPreferredTimeOfDay === "afternoon" && afternoonSlots.length > 0) {
    preferredSlots = afternoonSlots;
  } else if (userPreferredTimeOfDay === "evening" && eveningSlots.length > 0) {
    preferredSlots = eveningSlots;
  }
  
  // If we have preferred slots, return one
  if (preferredSlots.length > 0) {
    return preferredSlots[0];
  }
  
  // Fallback based on time of day if no preferred slots available
  if (timeOfDay === "morning") {
    // Morning - suggest afternoon
    if (afternoonSlots.length > 0) {
      return afternoonSlots[0];
    } else if (eveningSlots.length > 0) {
      return eveningSlots[0];
    }
  } else if (timeOfDay === "afternoon") {
    // Afternoon - suggest late afternoon or morning next day
    const lateAfternoon = afternoonSlots.filter(slot => {
      const hour = parseInt(slot.split(':')[0]);
      return hour >= 14;
    });
    
    if (lateAfternoon.length > 0) {
      return lateAfternoon[0];
    } else if (morningSlots.length > 0) {
      return morningSlots[0];
    }
  } else {
    // Evening - suggest morning of next day
    if (morningSlots.length > 0) {
      return morningSlots[0];
    } else if (afternoonSlots.length > 0) {
      return afternoonSlots[0];
    }
  }
  
  // Last resort: return first available slot
  return availableSlots[0];
};

// Create a new booking
interface BookingData {
  name: string;
  email: string;
  notes?: string;
  date: Date;
  time: string;
  meetingType: "video" | "in-person";
  providerName: string;
  serviceName: string;
  paid?: boolean;
  amount?: number;
}

export const createBooking = async (bookingData: BookingData) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, this would create a booking in the database
  console.log("Creating booking:", bookingData);
  
  // Process payment (in a real app, this would call Stripe or another payment processor)
  if (bookingData.amount && bookingData.amount > 0) {
    console.log(`Processing payment of $${bookingData.amount}`);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Update user booking history (in a real app, this would be stored in a database)
  const bookingHour = parseInt(bookingData.time.split(':')[0]);
  
  if (bookingHour < 12) {
    userBookingHistory.timePreferences.morningBookings += 1;
  } else if (bookingHour < 17) {
    userBookingHistory.timePreferences.afternoonBookings += 1;
  } else {
    userBookingHistory.timePreferences.eveningBookings += 1;
  }
  
  userBookingHistory.lastBookedTime = bookingData.time;
  const dayOfWeek = format(bookingData.date, "EEEE").toLowerCase();
  if (!userBookingHistory.preferredDays.includes(dayOfWeek)) {
    // Add this day if it's not already in the preferred days list
    if (userBookingHistory.preferredDays.length >= 3) {
      // Keep only the 2 most recent days
      userBookingHistory.preferredDays.shift();
    }
    userBookingHistory.preferredDays.push(dayOfWeek);
  }
  
  // Simulate successful booking
  return {
    id: `booking-${Date.now()}`,
    ...bookingData,
    status: "confirmed",
    createdAt: new Date(),
    paymentStatus: bookingData.amount && bookingData.amount > 0 ? "paid" : "free",
  };
};
