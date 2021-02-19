import { EmailSenderRepository } from "../data/EmailSenderRepository";
import { NotificationTemplateRepository } from "../data/NotificationTemplateRepository";
import { NotificationTemplateId } from "../model/Common";

export class NotificacionsManager{

    public static SendTaskAssignedNotification(): void {
        NotificacionsManager.SendNotification(NotificationTemplateId.TaskAssigned);        
    }

    public static SendTaskRejectedNotification(): void {
        NotificacionsManager.SendNotification(NotificationTemplateId.TaskRejected);
    }

    public static SendWorkflowApprovedNotification(): void {
        NotificacionsManager.SendNotification(NotificationTemplateId.WorkflowApproved);
    }

    private static async SendNotification(notificationTemplateId: NotificationTemplateId) {
        var template = await NotificationTemplateRepository.GetByNotificationTemplateId(notificationTemplateId);
        
        console.log(template.To);
        console.log(template.Cc);
        console.log(template.Subject);
        console.log(template.Body);

        var replacements = NotificacionsManager.GetReplacementCollection();

        replacements.forEach((value: string, key: string) => 
            template.Subject = template.Subject.replace(key, value));

        replacements.forEach((value: string, key: string) => 
            template.Body = template.Body.replace(key, value));

        console.log(template.To);
        console.log(template.Cc);
        console.log(template.Subject);
        console.log(template.Body);

        EmailSenderRepository.Add(
            template.To,
            template.Cc,
            template.Subject,
            template.Body);
    }

    private static GetReplacementCollection(): Map<string, string>
    {
        let retVal = new Map<string, string>();

        retVal.set("{{TITLE}}", "THIS IS THE TITLE!!!");

        return retVal;
    }
}