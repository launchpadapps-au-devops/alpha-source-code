// Import Area
import {  NotificationSubcategory } from "../notificationCategory";
import patientInvitationTemplate from "./patient-invitation.template";
import forgotPasswordTemplate from "./forgot-password.template";


// Export Area
const emailTemplates: { [key: string]: string } = {
  [NotificationSubcategory.PATIENT_INVITATION]: patientInvitationTemplate,
  [NotificationSubcategory.FORGOT_PASSWORD_OTP]: forgotPasswordTemplate,
};

export default emailTemplates;


