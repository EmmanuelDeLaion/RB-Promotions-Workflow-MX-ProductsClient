import { sp } from "@pnp/sp/presets/all";
import { SecurityHelper } from "../common/SecurityHelper";
import { WorkflowLog } from "../model/Common/WorkflowLog";
import { Promo } from "../model/Promo/Promo";
import { PromoRepository } from "./PromoRepository";
import { ApproversRepository } from "./ApproversRepository";
import { concat } from "lodash";

export class WorkflowLogRepository {
    private static LIST_NAME: string = "Workflow log";

    public static GetByPromo(promoId: number): Promise<WorkflowLog[]> {
        const collection = sp.web.lists.getByTitle(WorkflowLogRepository.LIST_NAME)
        .items.select(
            "ID",            
            "DateAndTime",
            "User/ID",
            "User/Title",
            "Action", 
            "Comments").expand("User").filter(`PromoId eq ${promoId}`).getAll().then((items) => { 
            return items.map((item) => {                     
                return WorkflowLogRepository.BuildEntity(item);
            });
        });

        return collection;
    }

    public static async Save(promoItemId: number, promoID: string, action: string, comments: string, entity: Promo):Promise<void> {
        const date = new Date();        
        const currentUser = await SecurityHelper.GetCurrentUser();

        const data = { 
            Title: promoID + "_" + date.toISOString(),
            PromoId: promoItemId,      
            DateAndTime: date,
            UserId: currentUser.ItemId,
            Action: action,
            Comments: comments
        };

        await sp.web.lists.getByTitle(WorkflowLogRepository.LIST_NAME).items.add(data);
    }

    private static BuildEntity(item: any): WorkflowLog {
        let entity = new WorkflowLog();
  
        entity.ItemId = item.ID;
        entity.DateAndTime = new Date(item.DateAndTime);
        entity.User = item.User ? { ItemId: item.User.ID, Value: item.User.Title } : null;
        entity.Action = item.Action;
        entity.Comments = item.Comments;

        return entity;
    }
}