import { IItemAddResult, sp } from "@pnp/sp/presets/all";
import { ClientRepository } from ".";
import { Client } from "../model/Common";
import { PromoStatus } from "../model/Promo";
import { Promo } from "../model/Promo/Promo";
import { DraftPromoState } from "../model/Promo/PromoStates/DraftPromoState";

export class PromoRepository {
    private static LIST_NAME: string = "Promociones";

    //TODO: Revisar el manejo de excepciones y mensajes de error
    //TODO: Optimizar consulta
    public static GetById(id: number): Promise<Promo> {
      const entity = sp.web.lists.getByTitle(PromoRepository.LIST_NAME)
        .items.getById(id).select("ID", "PromoID","Title", "ActivityObjective", "ClientId", "StatusId").get().then((item) => { 
            console.log(item);
            if(item.ClientId){
              return ClientRepository.GetById(item.ClientId).then((client) => {
                return PromoRepository.BuildEntity(item, client);
              });            
            }    
            else
              return PromoRepository.BuildEntity(item);      
        });

      return entity;
    }

    public static async SaveOrUpdate(entity: Promo): Promise<void> {
      const data = {        
        Title: entity.Name,
        ActivityObjective: entity.ActivityObjective,
        ClientId: entity.Client ? entity.Client.ItemId : null,
        Status: entity.GetStatusText(),
        StatusId: entity.GetStatusId()
      };

      if(!entity.ItemId) {
        const iar: IItemAddResult = await sp.web.lists.getByTitle(PromoRepository.LIST_NAME).items.add(data);

        //TODO: Obtener prefijo de país desde configuración
        await sp.web.lists.getByTitle(PromoRepository.LIST_NAME).items.getById(iar.data.ID).update({
          PromoID: "MX" + iar.data.ID
        });
      } 
      else
        await sp.web.lists.getByTitle(PromoRepository.LIST_NAME).items.getById(entity.ItemId).update(data);
    }

    private static BuildEntity(item: any, client?: Client): Promo {
      let entity = new Promo();

      entity.ItemId = item.ID;
      entity.PromoID = item.PromoID;
      entity.Name = item.Title;
      entity.ActivityObjective = item.ActivityObjective;
      entity.Client = client;

      entity.ChangeState(parseInt(item.StatusId));



      return entity;
    }
}