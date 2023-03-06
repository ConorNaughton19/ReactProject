import { auth } from "./config/fire";
import { sendEmail } from "../utils/email"; // assuming you have created this module

// Schedule a reminder email to be sent to the currently logged-in user after 10 minutes
const scheduleReminderEmail = () => {
  const user = auth.currentUser;

  if (user) {
    const email = user.email;
    setTimeout(() => {
      sendEmail(email, "Blood Sugar Check Reminder", "Don't forget to check your blood sugar again!");
    }, 10 * 60 * 1000); // 10 minutes in milliseconds
  }
}
