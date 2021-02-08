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

    public async Approve(): Promise<void>
    {
        throw new Error(Constants.Messages.NotAllowedAction);
    }

    public Reject(): Promise<void>
    {
        throw new Error(Constants.Messages.NotAllowedAction);
    }

    public InitializeWorkflowState(entity: Promo): void {
        //TODO: obtener IDs de aprobadores
        entity.WorkflowStages = [new PromoWorkflowState([entity.Client.Channel.HeadOfChannel.ItemId, 15])];

        //TODO: Implementar lógica para determinar si aplica la segunda etapa de aprobación
        entity.WorkflowStages.push(new PromoWorkflowState([16,17]));

        entity.CurrentStageNumber = 0;
    }
}