import { IItemAddResult, sp } from "@pnp/sp/presets/all";
import { concat, isNumber } from "lodash";
import { ClientRepository, ConfigurationRepository } from ".";
import { Client, WorkflowLog, FlowType } from "../model/Common";
import { PromoItem, PromoWorkflowState } from "../model/Promo";
import { Promo } from "../model/Promo/Promo";
import { PromoEvidence } from "../model/Promo/PromoEvidence";
import { ApproversRepository } from "./ApproversRepository";
import { FlowApproversRepository } from "./FlowApproversRepository";
import { EvidenceRepository } from "./EvidenceRepository";
import { PromoItemRepository } from "./PromoItemRepository";
import { WorkflowLogRepository } from "./WorkflowLogRepository";

export class PromoRepository {
  public static LIST_NAME: string = "Promociones";


  public static async GetById(id: number): Promise<Promo> {
    const item = await sp.web.lists.getByTitle(PromoRepository.LIST_NAME)
      .items.getById(id).select(
        "ID",
        "Title",
        "PromoName",
        "ActivityObjective",
        "ClientId",
        "StatusId",
        "SYS_WorkflowStages",
        "SYS_CurrentStageNumber",
        "Approvals",
        "TipoFlujoId"
      ).get();

    const items = await PromoItemRepository.GetByPromo(item.ID, item.ClientId);
    const client = item.ClientId ? await ClientRepository.GetById(item.ClientId) : null;
    const workflowLog = await WorkflowLogRepository.GetByPromo(item.ID);
    const evidence = await EvidenceRepository.GetByPromoID(item.Title);
    const flowtype = item.TipoFlujoId ? await FlowApproversRepository.GetById(item.TipoFlujoId) : null;

    return PromoRepository.BuildEntity(item, items, client, workflowLog, evidence, flowtype);
  }


  public static async SaveOrUpdate(entity: Promo, sU: number = 0): Promise<void> {
    const pendingApprovers = entity.GetPendingApproverIDs();

    const data = {
      PromoName: entity.Name,
      ActivityObjective: entity.ActivityObjective,
      ClientId: entity.Client ? entity.Client.ItemId : null,
      TotalEstimatedROI: entity.GetROI(),
      StartDate: entity.GetFromDate(),
      EndDate: entity.GetToDate(),
      Status: entity.GetStatusText(),
      StatusId: entity.GetStatusId(),
      SYS_WorkflowStages: entity.WorkflowStages ? JSON.stringify(entity.WorkflowStages) : null,
      SYS_CurrentStageNumber: entity.CurrentStageNumber,
      PendingApproversId: { results: pendingApprovers ? entity.GetPendingApproverIDs() : [] },
      TotalEstimatedInvestment: entity.GetTotalEstimatedInvestment(),
      Approvals: entity.Approvals,
      TipoFlujoId: entity.TipoFlujo ? entity.TipoFlujo.ItemId : null
    };

    if (!entity.ItemId) {
      const iar: IItemAddResult = await sp.web.lists.getByTitle(PromoRepository.LIST_NAME).items.add(data);

      //TODO: Obtener prefijo de país desde configuración
      entity.ItemId = iar.data.ID;
      entity.PromoID = entity.Config.CountryCode + iar.data.ID;

      await sp.web.lists.getByTitle(PromoRepository.LIST_NAME).items.getById(iar.data.ID).update({
        Title: entity.PromoID,
        PromoLink: entity.PromoID
      });
    }
    else
      await sp.web.lists.getByTitle(PromoRepository.LIST_NAME).items.getById(entity.ItemId).update(data);

    await PromoItemRepository.SaveOrUpdateItems(entity.ItemId, entity.PromoID, entity.Items, entity.ItemsToDelete);
  }


  public static async GetNewPromo(): Promise<Promo> {
    let configuration = await ConfigurationRepository.GetInstance();
    return new Promo(configuration);
  }


  private static async BuildEntity(item: any, items: PromoItem[], client: Client, workflowLog: WorkflowLog[], evidence: PromoEvidence[], flowtype: FlowType): Promise<Promo> {
    let entity = await PromoRepository.GetNewPromo();

    entity.ItemId = item.ID;
    entity.Name = item.PromoName;
    entity.PromoID = item.Title;
    entity.ActivityObjective = item.ActivityObjective;
    entity.Client = client;
    entity.CurrentStageNumber = item.SYS_CurrentStageNumber;
    entity.WorkflowLog = workflowLog;
    entity.Evidence = evidence;
    entity.TipoFlujo = flowtype;

    items.map((promoItem) => {
      promoItem.GetBaseGMSum = entity.GetBaseGMSum.bind(entity);
    });

    entity.Items = items;

    if (item.SYS_WorkflowStages) {

      entity.WorkflowStages = [];

      const lengthDataIDS: number = item.SYS_WorkflowStages.split('[')[2].split(']')[0].split(',').length;
      const lenghtDataComplete: number = item.SYS_WorkflowStages.split('[')[3].split(']')[0].split(',').length;
      const datosComplete: string[] = item.SYS_WorkflowStages.split('[')[3].split(']')[0].split(',');

      let dataIDS: number[] = [];
      let dataComplete: number[] = [];

      for (let i = 0; i < lengthDataIDS; i++) {
        let numero: number = parseInt(item.SYS_WorkflowStages.split('[')[2].split(']')[0].split(',')[i], 10);
        if (dataIDS.indexOf(numero) == -1)
          dataIDS.push(numero);
      }

      if (datosComplete.length >= 1 && datosComplete[0] != "")
        for (let i = 0; i < lenghtDataComplete; i++) {
          let numero: number = parseInt(item.SYS_WorkflowStages.split('[')[3].split(']')[0].split(',')[i], 10);
          if (dataComplete.indexOf(numero) == -1)
            dataComplete.push(numero);
        }

      const workFlowState: PromoWorkflowState = new PromoWorkflowState(dataIDS, dataComplete);
      entity.WorkflowStages = [workFlowState];
    }

    entity.ChangeState(parseInt(item.StatusId));
    return entity;
  }
}
