// Import Area
import {  NotificationSubcategory } from "../notificationCategory";
import patientInvitationTemplate from "./patient-invitation.template";


// Export Area
const emailTemplates: { [key: string]: string } = {
  [NotificationSubcategory.PATIENT_INVITATION]: patientInvitationTemplate,
};

export default emailTemplates;


