// Import Area
import { NotificationCategory } from "../notificationCategory";
import staffInvitationTemplate from "./account-invitation.template";


// Export Area
const emailTemplates: { [key: string]: string } = {
  [NotificationCategory.ACCOUNT_INVITATION]: staffInvitationTemplate,
};

export default emailTemplates;


