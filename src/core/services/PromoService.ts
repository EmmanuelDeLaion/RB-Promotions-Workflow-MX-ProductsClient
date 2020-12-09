import { Promo } from "../model/Promo";
import { sp } from "@pnp/sp/presets/all";

export class PromoService {
    static LIST_NAME: string = "Promociones";

    //TODO: Revisar si hay que mejorar los mensajes de error
    public static GetById(id: number): Promise<Promo> {
      const entity = sp.web.lists.getByTitle(PromoService.LIST_NAME)
        .items.getById(id).fieldValuesAsText.get().then((item) => {      
          return PromoService.BuildEntity(item);
        }, (error) => {
          console.error(error.message);
        });

      return entity;
    }

    static BuildEntity(item: any): Promo {
      let entity = new Promo();

      entity.ItemId = item.ID;
      entity.PromoID = item.PromoID;
      entity.Name = item.Title;
      entity.Description = item.Description;

      return entity;
    }
}