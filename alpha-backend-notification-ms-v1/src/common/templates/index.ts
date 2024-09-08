// Import Area
import {  NotificationSubcategory } from "../notificationCategory";
import patientInvitationTemplate from "./patient-invitation.template";
import staffInvitationTemplate from "./staff-invitation.template";
import forgotPasswordTemplate from "./forgot-password.template";
import passwordChangedTemplate from "./password-changed.template";

// Engagement Alert
import doctorAppointmentReminder from "./doctor-appointment-reminder.template";
import thirdInactivity from "./third-inactivity.template";

// Export Area
const emailTemplates: { [key: string]: string } = {
  [NotificationSubcategory.PATIENT_INVITATION]: patientInvitationTemplate,
  [NotificationSubcategory.FORGOT_PASSWORD_OTP]: forgotPasswordTemplate,
  [NotificationSubcategory.STAFF_INVITATION]: staffInvitationTemplate,
  [NotificationSubcategory.PASSWORD_CHANGED]: passwordChangedTemplate,
  [NotificationSubcategory.DOCTOR_APPOINTMENT_REMINDER]: doctorAppointmentReminder,
  [NotificationSubcategory.THIRD_INACTIVITY]: thirdInactivity,
};

export default emailTemplates;


