import { Constants } from "../../..";
import { Promo } from "../Promo";
import { PromoViewModel } from "../PromoViewModel";
import { PromoWorkflowState } from "../PromoWorkflowState";

export abstract class PromoState {    
    public Entity:Promo;

    public abstract GetStatusId():number;
    public abstract GetStatusText():string;
    public abstract GetViewModel():Promise<PromoViewModel>;

    public Save(entity: Promo): Promise<void>
    {
        throw new Error(Constants.Messages.NotAllowedAction);
    }

    public Submit(entity: Promo): Promise<void>
    {
        throw new Error(Constants.Messages.NotAllowedAction);
    }

    public Approve(entity: Promo): Promise<void>
    {
        throw new Error(Constants.Messages.NotAllowedAction);
    }

    public Reject(entity: Promo): Promise<void>
    {
        throw new Error(Constants.Messages.NotAllowedAction);
    }

    public InitializeWorkflowState(entity: Promo): void {
        //TODO: obtener IDs de aprobadores
        entity.WorkflowState = new PromoWorkflowState([entity.Client.Channel.HeadOfChannel.ItemId, 13, 14]);
        entity.CurrentApprover = entity.Client.Channel.HeadOfChannel;
    }
}