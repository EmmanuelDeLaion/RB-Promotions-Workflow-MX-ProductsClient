import { Constants } from "../../..";
import { ApproversRepository } from "../../../data/ApproversRepository";
import { Promo } from "../Promo";
import { PromoViewModel } from "../PromoViewModel";
import { PromoWorkflowState } from "../PromoWorkflowState";

export abstract class PromoState {    
    public Entity:Promo;

    public abstract GetStatusId():number;
    public abstract GetStatusText():string;
    public abstract GetViewModel():Promise<PromoViewModel>;

    public async Initialize(): Promise<void> {
        return;
    }

    public Save(entity: Promo): Promise<void>
    {
        throw new Error(Constants.Messages.NotAllowedAction);
    }    

    public Submit(entity: Promo): Promise<void>
    {
        throw new Error(Constants.Messages.NotAllowedAction);
    }

    public async Approve(comments: string): Promise<void>
    {
        throw new Error(Constants.Messages.NotAllowedAction);
    }

    public Reject(comments: string): Promise<void>
    {
        throw new Error(Constants.Messages.NotAllowedAction);
    }

    public async InitializeWorkflowState(entity: Promo): Promise<void> {
        const approvers = await ApproversRepository.GetInstance();

        entity.WorkflowStages = [new PromoWorkflowState([entity.Client.Channel.HeadOfChannel.ItemId, approvers.Role1.ItemId])];

        if(entity.GetTotalEstimatedInvestment() > entity.ApprovalAmountLimit)
            entity.WorkflowStages.push(new PromoWorkflowState([approvers.Role2.ItemId,approvers.Role3.ItemId]));

        entity.CurrentStageNumber = 1;
    }

    protected GetCurrentStage(): PromoWorkflowState {
        return this.Entity.WorkflowStages[this.Entity.CurrentStageNumber - 1];
    }
}