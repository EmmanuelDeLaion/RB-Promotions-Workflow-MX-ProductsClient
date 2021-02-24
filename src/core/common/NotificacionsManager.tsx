import { EmailSenderRepository } from "../data/EmailSenderRepository";
import { NotificationTemplateRepository } from "../data/NotificationTemplateRepository";
import { NotificationTemplateId } from "../model/Common";
import { Promo } from "../model/Promo";
import { CommonHelper } from "./CommonHelper";

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

        var replacements = NotificacionsManager.GetReplacementCollection(notificationTemplateId, entity, to, cc);

        console.log(replacements);

        replacements.forEach((value: string, key: string) => 
            template.Subject = CommonHelper.replaceAll(template.Subject, key, value));

        replacements.forEach((value: string, key: string) => 
            template.Body = CommonHelper.replaceAll(template.Body, key, value));

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

    private static GetReplacementCollection(notificationTemplateId: NotificationTemplateId, entity: Promo, to: string, cc?: string): Map<string, string>
    {
        let retVal = new Map<string, string>();

        retVal.set("{{ACTIVITY_OBJECTIVE}}", entity.ActivityObjective);
        retVal.set("{{APPROVAL_AMOUNT_LIMIT}}", entity.ApprovalAmountLimit.toString());
        retVal.set("{{NAME}}", entity.Name);
        retVal.set("{{PROMO_ID}}", entity.PromoID);
        retVal.set("{{LINK_TO_PROMO}}", "https://sgiovannini.sharepoint.com//sites/RBPromociones/Mexico?itemId=" + entity.ItemId.toString());

        retVal.set("{{CC}}", cc);
        retVal.set("{{TO}}", to);

        return retVal;
    }
}