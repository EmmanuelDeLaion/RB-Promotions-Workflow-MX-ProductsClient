import { IItemAddResult, sp } from "@pnp/sp/presets/all";
import { ClientRepository, ConfigurationRepository } from ".";
import { Client } from "../model/Common";
import { PromoItem, PromoStatus } from "../model/Promo";
import { Promo } from "../model/Promo/Promo";
import { PromoItemRepository } from "./PromoItemRepository";

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
          "SYS_WorkflowState"
        ).get();  
        
      const items = await PromoItemRepository.GetByPromo(item.ID, item.ClientId);
      const client = item.ClientId ? await ClientRepository.GetById(item.ClientId) : null;

      return PromoRepository.BuildEntity(item, items, client);
    }

    public static async SaveOrUpdate(entity: Promo): Promise<void> {
      const data = {       
        PromoName: entity.Name, 
        ActivityObjective: entity.ActivityObjective,
        ClientId: entity.Client ? entity.Client.ItemId : null,
        Status: entity.GetStatusText(),
        StatusId: entity.GetStatusId(),
        SYS_WorkflowState: entity.WorkflowState ? JSON.stringify(entity.WorkflowState) : null,
        CurrentApproverId: entity.CurrentApprover ? entity.CurrentApprover.ItemId : null
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
      return new Promo(configuration.CountryCode);
    }

    private static async BuildEntity(item: any, items: PromoItem[], client?: Client): Promise<Promo> {

      let entity = await PromoRepository.GetNewPromo();

      entity.ItemId = item.ID;
      entity.Name = item.PromoName;
      entity.PromoID = item.Title;
      entity.ActivityObjective = item.ActivityObjective;
      entity.Client = client;
      entity.WorkflowState = item.SYS_WorkflowState ? JSON.parse(item.SYS_WorkflowState) : null;
      entity.Items = items;

      entity.ChangeState(parseInt(item.StatusId));      

      return entity;
    }
}