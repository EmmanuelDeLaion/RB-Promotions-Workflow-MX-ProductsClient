import { concat } from "lodash";
import { PromoStatus } from "..";
import { Constants } from "../../..";
import { NotificacionsManager } from "../../../common/NotificacionsManager";
import { SecurityHelper } from "../../../common/SecurityHelper";
import { PromoRepository } from "../../../data";
import { FlowApproversRepository } from "../../../data/FlowApproversRepository";
import { WorkflowLogRepository } from "../../../data/WorkflowLogRepository";
import { FlowType } from "../../Common";
import { PromoViewModel } from "../PromoViewModel";
import { PromoState } from "./PromoState";
import { Promo } from "../Promo";
import { ApproversRepository } from "../../../data/ApproversRepository";
import { PromoWorkflowState } from "../PromoWorkflowState";
import { sp } from "@pnp/sp/presets/all";

export class ApprovalState extends PromoState {


  public async Initialize(): Promise<void> {
    const users = await this.GetCurrentStage().GetPendingUsers();

    await SecurityHelper.SetPromoPermissions(this.Entity.ItemId, [this.Entity.Client.KeyAccountManager.ItemId], this.GetCurrentStage().GetPendingUserIDs());

    await Promise.all(users.map(async (user) => {
      await NotificacionsManager.SendTaskAssignedNotification(this.Entity, user.Email, null, user.Value);
    }));
  }


  public GetStatusId(): number {
    return PromoStatus.Approval;
  }


  public GetStatusText(): string {
    return Constants.StatusTexts.Approval;
  }


  public async GetViewModel(): Promise<PromoViewModel> {
    console.log("version 7.1");
    let viewModel = new PromoViewModel(this.Entity);
    viewModel.ReadOnlyForm = true;
    const currentUser = await SecurityHelper.GetCurrentUser();
    viewModel.FlowsTypes = await FlowApproversRepository.GetAll();
    let puedeAprobar: Boolean = false;
    let indexUser: number = -1;
    let largoWorkFlow: number = viewModel.Entity.WorkflowStages[0].ApproverIDs.length;

    for (let i = 0; i < largoWorkFlow; i++) {
      if (viewModel.Entity.WorkflowStages[0].ApproverIDs[i] == currentUser.ItemId) {
        indexUser = i;
        largoWorkFlow -= 1;
      }
    }

    if (indexUser > 0) {
      if (!this.GetCurrentStage().UserCanApprove(viewModel.Entity.WorkflowStages[0].ApproverIDs[indexUser - 1])
        && this.GetCurrentStage().UserCanApprove(currentUser.ItemId))
        puedeAprobar = true;
    }
    else if (indexUser == 0 && this.GetCurrentStage().UserCanApprove(currentUser.ItemId))
      puedeAprobar = true;

    if (
      puedeAprobar &&
      viewModel.Entity.TipoFlujo != null) {
      viewModel.ShowApproveButton = true;
      viewModel.ShowRejectButton = true;
    }
    console.log(viewModel);
    return viewModel;

  }



  public async Approve(comments: string): Promise<void> {
    const stage = this.GetCurrentStage();
    const user = await SecurityHelper.GetCurrentUser();
    const kam = await SecurityHelper.GetUserById(this.Entity.Client.KeyAccountManager.ItemId);

    stage.AddToCompletBy(user.ItemId);

    if (stage.IsComplete()) {
      this.Entity.ChangeState(PromoStatus.Approved);
      const to = kam.Email;
      NotificacionsManager.SendWorkflowApprovedNotification(this.Entity, to);
    }

    let readerIDs = [this.Entity.Client.KeyAccountManager.ItemId];

    for (let i = 0; i < this.Entity.CurrentStageNumber; i++)
      readerIDs = readerIDs.concat(this.Entity.WorkflowStages[i].CompletedBy);

    const apr = await sp.web.lists.getByTitle(PromoRepository.LIST_NAME)
      .items.getById(this.Entity.ItemId).select(
        "Approvals"
      ).get();

    let aprobadores = "";
    let encontrado: boolean = false;

    if (apr.Approvals && apr.Approvals != "" && apr.Approvals != undefined && apr.Approvals != null) {
      apr.Approvals.split("|").map((data) => {
        if (Number(data.split("-")[0]) == user.ItemId && !encontrado) {
          console.log("Primer IF");
          if (data.replace("Pendiente", "Aprobar") !== data) {
            console.log("Segundo IF");
            aprobadores = concat(aprobadores + data.replace("Pendiente", "Aprobar") + "|").toString();
            encontrado = true;
          }
          else {
            data != null || data != "" || data ? aprobadores = concat(aprobadores + data + "|").toString() : null;
            console.log("Primer else");
          }
        }
        else {
          data != null || data != "" || data ? aprobadores = concat(aprobadores + data + "|").toString() : null;
          console.log("Segundo else");
        }
      });
    }

    this.Entity.Approvals = aprobadores;

    await SecurityHelper.SetPromoPermissions(this.Entity.ItemId, readerIDs, this.GetCurrentStage().GetPendingUserIDs());
    await PromoRepository.SaveOrUpdate(this.Entity, 1).then(async () => {
      const users = await this.GetCurrentStage().GetPendingUsers();

      await Promise.all(users.map(async (usr) => {
        await NotificacionsManager.SendTaskAssignedNotification(this.Entity, usr.Email, null, usr.Value);
      }));
    });
    await WorkflowLogRepository.Save(this.Entity.ItemId, this.Entity.PromoID, "Aprobar", comments, this.Entity);

    return NotificacionsManager.SendTaskApprovedNotification(this.Entity, user.Value, kam.Email);
  }



  public async Reject(comments: string): Promise<void> {
    const stage = this.GetCurrentStage();
    const user = await SecurityHelper.GetCurrentUser();
    const approvers = await ApproversRepository.GetInstance();

    let ids: number[] = [approvers.Phase0Coordinator1.ItemId]; //[12]

    if (ids.indexOf(approvers.Phase0Coordinator2.ItemId) == -1)
      ids.push(approvers.Phase0Coordinator2.ItemId);
    if (ids.indexOf(approvers.Phase0Coordinator3.ItemId) == -1)
      ids.push(approvers.Phase0Coordinator3.ItemId);


    this.Entity.WorkflowStages = [new PromoWorkflowState(ids)];

    this.Entity.TipoFlujo = undefined;

    this.Entity.ChangeState(PromoStatus.Rejected);

    stage.AddToCompletBy(user.ItemId);

    await PromoRepository.SaveOrUpdate(this.Entity, 1);
    await WorkflowLogRepository.Save(this.Entity.ItemId, this.Entity.PromoID, "Rechazar", comments, this.Entity);

    let readerIDs = [this.Entity.Client.KeyAccountManager.ItemId];

    for (let i = 0; i < this.Entity.CurrentStageNumber; i++)
      readerIDs = readerIDs.concat(this.Entity.WorkflowStages[i].CompletedBy);

    readerIDs = readerIDs.concat(stage.GetPendingUserIDs());

    await SecurityHelper.SetPromoPermissions(this.Entity.ItemId, readerIDs);

    const to = (await SecurityHelper.GetUserById(this.Entity.Client.KeyAccountManager.ItemId)).Email;

    return NotificacionsManager.SendTaskRejectedNotification(this.Entity, comments, user.Value, to);
  }



  public async FlowAsign(entity: Promo, comments: string, flowType: FlowType): Promise<void> {
    const user = await SecurityHelper.GetCurrentUser();
    const kam = await SecurityHelper.GetUserById(entity.Client.KeyAccountManager.ItemId);
    const teamLeaderEmail = await SecurityHelper.GetUserById(entity.Client.teamLeader.ItemId);

    let aprobadores: string = "";
    const approvers = await ApproversRepository.GetInstance();
    const kamUser = entity.Client.Channel.HeadOfChannel;
    const teamLeader = entity.Client.teamLeader;


    if (flowType.ItemId == 1)
      aprobadores = concat(approvers.Phase1Approver1.ItemId + "-" + approvers.Phase1Approver1.Value + ": " + "Pendiente|").toString();

    else if (flowType.ItemId == 2) {
      let ids: number[] = [teamLeader.ItemId];
      aprobadores = concat(teamLeader.ItemId + "-" + teamLeader.Value + ": " + "Pendiente|").toString();
      if (ids.indexOf(kamUser.ItemId) == -1) {
        aprobadores = concat(aprobadores + " " + kamUser.ItemId + "-" + kamUser.Value + ": " + "Pendiente|").toString();
        ids.push(kamUser.ItemId);
      }
      if (ids.indexOf(approvers.Phase2Approver1.ItemId) == -1)
        aprobadores = concat(aprobadores + " " + approvers.Phase2Approver1.ItemId + "-" + approvers.Phase2Approver1.Value + ": " + "Pendiente|").toString();
    }

    else if (flowType.ItemId == 3) {
      let ids: number[] = [teamLeader.ItemId];
      aprobadores = concat(teamLeader.ItemId + "-" + teamLeader.Value + ": " + "Pendiente|").toString();
      if (ids.indexOf(kamUser.ItemId) == -1) {
        aprobadores = concat(aprobadores + " " + kamUser.ItemId + "-" + kamUser.Value + ": " + "Pendiente|").toString()
        ids.push(kamUser.ItemId);
      }
      if (ids.indexOf(approvers.Phase2Approver1.ItemId) == -1) {
        aprobadores = concat(aprobadores + " " + approvers.Phase2Approver1.ItemId + "-" + approvers.Phase2Approver1.Value + ": " + "Pendiente|").toString()
        ids.push(approvers.Phase2Approver1.ItemId);
      }
      if (ids.indexOf(approvers.Phase3Approver1.ItemId) == -1) {
        aprobadores = concat(aprobadores + " " + approvers.Phase3Approver1.ItemId + "-" + approvers.Phase3Approver1.Value + ": " + "Pendiente|").toString()
        ids.push(approvers.Phase3Approver1.ItemId);
      }
      if (ids.indexOf(approvers.Phase3Approver2.ItemId) == -1)
        aprobadores = concat(aprobadores + " " + approvers.Phase3Approver2.ItemId + "-" + approvers.Phase3Approver2.Value + ": " + "Pendiente|").toString()
    }


    entity.Approvals = aprobadores;
    await this.InitializeWorkflowState(entity);

    let readerIDs = [entity.Client.KeyAccountManager.ItemId];

    for (let i = 0; i < entity.CurrentStageNumber; i++)
      readerIDs = readerIDs.concat(entity.WorkflowStages[i].CompletedBy);

    entity.TipoFlujo = flowType;
    let mensaje = "Asignado" + "-" + flowType.Name as string;
    await SecurityHelper.SetPromoPermissions(entity.ItemId, readerIDs, this.GetCurrentStage().GetPendingUserIDs());

    await PromoRepository.SaveOrUpdate(entity, 1).then(async () => {
      const users = await this.GetCurrentStage().GetPendingUsers();
      await Promise.all(users.map(async (usr) => {
        await NotificacionsManager.SendTaskAssignedNotification(entity, usr.Email, null, usr.Value);
      }));

      // Notificacion para TeamLeader
      if (flowType.ItemId == 2 || flowType.ItemId == 3) {
        await NotificacionsManager.SendTaskAssignedNotification(entity, teamLeaderEmail.Email, null, teamLeaderEmail.Value);
      }

    });
    await WorkflowLogRepository.Save(entity.ItemId, entity.PromoID, mensaje, comments, entity);

    //return NotificacionsManager.SendTaskApprovedNotification(entity, user.Value, kam.Email);
  }
}
