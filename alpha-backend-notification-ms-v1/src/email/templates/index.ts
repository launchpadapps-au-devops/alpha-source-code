// Import Area
import {  NotificationSubcategory } from "../../common/notificationCategory";
import patientInvitationTemplate from "./patient-invitation.template";
import staffInvitationTemplate from "./staff-invitation.template";
import forgotPasswordTemplate from "./forgot-password.template";


// Export Area
const emailTemplates: { [key: string]: string } = {
  [NotificationSubcategory.PATIENT_INVITATION]: patientInvitationTemplate,
  [NotificationSubcategory.FORGOT_PASSWORD_OTP]: forgotPasswordTemplate,
  [NotificationSubcategory.STAFF_INVITATION]: staffInvitationTemplate,
};

export default emailTemplates;


