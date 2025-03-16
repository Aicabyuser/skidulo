import { reminderService } from '@/lib/services/reminder';

export async function processReminders() {
  console.log('Processing reminders...');
  try {
    await reminderService.processReminders();
    console.log('Reminders processed successfully');
  } catch (error) {
    console.error('Error processing reminders:', error);
  }
}

// If running this file directly (e.g., through a cron job)
if (require.main === module) {
  processReminders()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error processing reminders:', error);
      process.exit(1);
    });
} 