import { PromoStatus } from "..";
import { Constants } from "../../..";
import { NotificacionsManager } from "../../../common/NotificacionsManager";
import { SecurityHelper } from "../../../common/SecurityHelper";
import { PromoRepository } from "../../../data";
import { WorkflowLogRepository } from "../../../data/WorkflowLogRepository";
import { PromoViewModel } from "../PromoViewModel";
import { PromoState } from "./PromoState";

export class ApprovalState extends PromoState {
    public async Initialize(): Promise<void> {
        const to = (await this.GetCurrentStage().GetPendingUserEmails()).join(";");

        return NotificacionsManager.SendTaskAssignedNotification(this.Entity, to);
    }
    
    public GetStatusId(): number {
        return PromoStatus.Approval;
    }

    public GetStatusText(): string {
        return Constants.StatusTexts.Approval;
    }

    public async GetViewModel(): Promise<PromoViewModel> {
        let viewModel = new PromoViewModel(this.Entity);

        viewModel.ReadOnlyForm = true;

        const currentUser = await SecurityHelper.GetCurrentUser();

        if(this.GetCurrentStage().UserCanApprove(currentUser.ItemId)){
            viewModel.ShowApproveButton = true;
            viewModel.ShowRejectButton = true;
        }

        return viewModel;
    }

    public async Approve(comments: string): Promise<void>
    {
        const stage = this.GetCurrentStage();
        
        stage.AddToCompletBy((await SecurityHelper.GetCurrentUser()).ItemId);

        if(stage.IsComplete()) {
            if(this.Entity.CurrentStageNumber == this.Entity.WorkflowStages.length) {
                this.Entity.ChangeState(PromoStatus.Approved);
            }
            else {
                this.Entity.CurrentStageNumber++;
                const to = (await this.GetCurrentStage().GetPendingUserEmails()).join(";");

                NotificacionsManager.SendTaskAssignedNotification(this.Entity, to);
            }
        }

        PromoRepository.SaveOrUpdate(this.Entity);

        return WorkflowLogRepository.Save(this.Entity.ItemId, this.Entity.PromoID, "Aprobar", comments);
    }

    public Reject(comments: string): Promise<void>
    {
        this.Entity.ChangeState(PromoStatus.Rejected);

        PromoRepository.SaveOrUpdate(this.Entity);

        return WorkflowLogRepository.Save(this.Entity.ItemId, this.Entity.PromoID, "Rechazar", comments);
    }
}