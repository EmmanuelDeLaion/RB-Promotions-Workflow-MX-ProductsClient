import { EmailSenderRepository } from "../data/EmailSenderRepository";
import { NotificationTemplateRepository } from "../data/NotificationTemplateRepository";
import { NotificationTemplateId } from "../model/Common";
import { Promo } from "../model/Promo";

export class NotificacionsManager {

    public static SendTaskAssignedNotification(entity: Promo, to: string, cc?: string): Promise<void> {
        return NotificacionsManager.SendNotification(NotificationTemplateId.TaskAssigned, entity, to, cc);        
    }

    public static SendTaskRejectedNotification(entity: Promo, to: string, cc?: string): Promise<void> {
        return NotificacionsManager.SendNotification(NotificationTemplateId.TaskRejected, entity, to, cc);
    }

    public static SendWorkflowApprovedNotification(entity: Promo, to: string, cc?: string): Promise<void> {
        return NotificacionsManager.SendNotification(NotificationTemplateId.WorkflowApproved, entity, to, cc);
    }

    private static async SendNotification(notificationTemplateId: NotificationTemplateId, entity: Promo, to: string, cc?: string) {
        var template = await NotificationTemplateRepository.GetByNotificationTemplateId(notificationTemplateId);
        
        console.log(template.Subject);
        console.log(template.Body);

        var replacements = NotificacionsManager.GetReplacementCollection();

        replacements.forEach((value: string, key: string) => 
            template.Subject = template.Subject.replace(key, value));

        replacements.forEach((value: string, key: string) => 
            template.Body = template.Body.replace(key, value));

        console.log(to);
        console.log(cc);
        console.log(template.Subject);
        console.log(template.Body);

        EmailSenderRepository.Add(
            to,
            cc,
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