import { IItemAddResult, sp } from "@pnp/sp/presets/all";
import { ClientRepository, ConfigurationRepository } from ".";
import { Client, WorkflowLog } from "../model/Common";
import { PromoItem, PromoStatus, PromoWorkflowState } from "../model/Promo";
import { Promo } from "../model/Promo/Promo";
import { PromoItemRepository } from "./PromoItemRepository";
import { WorkflowLogRepository } from "./WorkflowLogRepository";

export class PromoRepository {
    private static LIST_NAME: string = "Promociones";

    //TODO: Revisar el manejo de excepciones y mensajes de error
    //TODO: Optimizar consulta
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
          "SYS_CurrentStageNumber"
        ).get();  
        
      const items = await PromoItemRepository.GetByPromo(item.ID, item.ClientId);
      const client = item.ClientId ? await ClientRepository.GetById(item.ClientId) : null;
      const workflowLog = await WorkflowLogRepository.GetByPromo(item.ID);

      return PromoRepository.BuildEntity(item, items, client, workflowLog);
    }

    public static async SaveOrUpdate(entity: Promo): Promise<void> {
      const data = {       
        PromoName: entity.Name, 
        ActivityObjective: entity.ActivityObjective,
        ClientId: entity.Client ? entity.Client.ItemId : null,
        Status: entity.GetStatusText(),
        StatusId: entity.GetStatusId(),
        SYS_WorkflowStages: entity.WorkflowStages ? JSON.stringify(entity.WorkflowStages) : null,
        SYS_CurrentStageNumber: entity.CurrentStageNumber
      };

      if(!entity.ItemId) {
        const iar: IItemAddResult = await sp.web.lists.getByTitle(PromoRepository.LIST_NAME).items.add(data);

        //TODO: Obtener prefijo de país desde configuración
        entity.ItemId = iar.data.ID;
        entity.PromoID = entity.CountryCode + iar.data.ID;
        
        await sp.web.lists.getByTitle(PromoRepository.LIST_NAME).items.getById(iar.data.ID).update({
          Title: entity.PromoID
        });
      } 
      else
        await sp.web.lists.getByTitle(PromoRepository.LIST_NAME).items.getById(entity.ItemId).update(data);

      await PromoItemRepository.SaveOrUpdateItems(entity.ItemId, entity.PromoID, entity.Items);
    }

    public static async GetNewPromo() : Promise<Promo>
    {
      let configuration = await ConfigurationRepository.GetInstance();
      return new Promo(configuration.CountryCode, configuration.ApprovalAmountLimit);
    }

    private static async BuildEntity(item: any, items: PromoItem[], client: Client, workflowLog: WorkflowLog[]): Promise<Promo> {

      let entity = await PromoRepository.GetNewPromo();

      entity.ItemId = item.ID;
      entity.Name = item.PromoName;
      entity.PromoID = item.Title;
      entity.ActivityObjective = item.ActivityObjective;
      entity.Client = client;     
      entity.CurrentStageNumber = item.SYS_CurrentStageNumber; 
      entity.WorkflowLog = workflowLog;

      items.map((promoItem) => {
        promoItem.GetBaseGMSum = entity.GetBaseGMSum.bind(entity);
      });

      entity.Items = items;

      if(item.SYS_WorkflowStages) {
        const data: any[] = JSON.parse(item.SYS_WorkflowStages);
        entity.WorkflowStages = [];
        
        data.map((stage) => {
          entity.WorkflowStages.push(new PromoWorkflowState(stage.ApproverIDs, stage.CompletedBy));
        });
      }

      entity.ChangeState(parseInt(item.StatusId));

      return entity;
    }
}