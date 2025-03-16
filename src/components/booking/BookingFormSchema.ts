
import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  notes: z.string().optional(),
  serviceName: z.string(),
  emailConfirmation: z.boolean().default(true),
  emailReminders: z.boolean().default(true),
});

export type BookingFormValues = z.infer<typeof formSchema>;
