import { Constants } from "../../..";
import { ApproversRepository } from "../../../data/ApproversRepository";
import { Promo } from "../Promo";
import { PromoViewModel } from "../PromoViewModel";
import { PromoWorkflowState } from "../PromoWorkflowState";
import { FlowType } from "../../Common";

export abstract class PromoState {
    public Entity: Promo;

    public abstract GetStatusId(): number;
    public abstract GetStatusText(): string;
    public abstract GetViewModel(): Promise<PromoViewModel>;

    public async Initialize(): Promise<void> {
        return;
    }

    public async Save(entity: Promo): Promise<void> {
        throw new Error(Constants.Messages.NotAllowedAction);
    }

    public Submit(entity: Promo): Promise<void> {
        throw new Error(Constants.Messages.NotAllowedAction);
    }

    public async Approve(comments: string): Promise<void> {
        throw new Error(Constants.Messages.NotAllowedAction);
    }

    public Reject(comments: string): Promise<void> {
        return;
        //throw new Error(Constants.Messages.NotAllowedAction);
    }

    public async Proven(comments: string): Promise<void> {
        return;
        //throw new Error(Constants.Messages.NotAllowedAction);
    }

    public async FlowAsign(entity: Promo, comments: string, flowType: FlowType): Promise<void> {
        return;
    }

    public async InitializeWorkflowState(entity: Promo): Promise<void> {
        const approvers = await ApproversRepository.GetInstance();
        const kamUserId = entity.Client.Channel.HeadOfChannel.ItemId;
        const teamLeader = entity.Client.teamLeader;

        console.log(entity);


        if (entity.TipoFlujo == undefined || entity.TipoFlujo == null) {
            let ids: number[] = [approvers.Phase0Coordinator1.ItemId];

            if (ids.indexOf(approvers.Phase0Coordinator2.ItemId) == -1)
                ids.push(approvers.Phase0Coordinator2.ItemId);
            if (ids.indexOf(approvers.Phase0Coordinator3.ItemId) == -1)
                ids.push(approvers.Phase0Coordinator3.ItemId);

            entity.WorkflowStages = [new PromoWorkflowState(ids)];

        }

        else {
            if (entity.TipoFlujo.ItemId == 1) {
                entity.WorkflowStages = [new PromoWorkflowState([
                    approvers.Phase1Approver1.ItemId])];

                    console.log(entity.WorkflowStages);
            }

            else if (entity.TipoFlujo.ItemId == 2) {
                let ids: number[] = [teamLeader.ItemId];
                if (ids.indexOf(kamUserId) == -1)
                    ids.push(kamUserId);
                if (ids.indexOf(approvers.Phase2Approver1.ItemId) == -1)
                    ids.push(approvers.Phase2Approver1.ItemId);
                entity.WorkflowStages = [new PromoWorkflowState(ids)];

                console.log(ids);
                console.log(entity.WorkflowStages);

            }
            else if (entity.TipoFlujo.ItemId == 3) {
                let ids: number[] = [teamLeader.ItemId];
                if (ids.indexOf(kamUserId) == -1)
                    ids.push(kamUserId);
                if (ids.indexOf(approvers.Phase2Approver1.ItemId) == -1)
                    ids.push(approvers.Phase2Approver1.ItemId);
                if (ids.indexOf(approvers.Phase3Approver1.ItemId) == -1)
                    ids.push(approvers.Phase3Approver1.ItemId);
                if (ids.indexOf(approvers.Phase3Approver2.ItemId) == -1)
                    ids.push(approvers.Phase3Approver2.ItemId);

                entity.WorkflowStages = [new PromoWorkflowState(ids)];

            }
        }

        entity.CurrentStageNumber = 1;
    }

    public GetCurrentStage(): PromoWorkflowState {
        return this.Entity.CurrentStageNumber > 0 ? this.Entity.WorkflowStages[this.Entity.CurrentStageNumber - 1] : null;
    }
}
