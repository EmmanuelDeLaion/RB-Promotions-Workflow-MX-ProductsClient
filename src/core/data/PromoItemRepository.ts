import { sp } from "@pnp/sp/presets/all";
import { Type } from "../model/Common";
import { PromoItem } from "../model/Promo";

export class PromoItemRepository {
    private static LIST_NAME: string = "Promo items";

    public static async SaveOrUpdateItems(promoItemId: number, promoID: string, items: PromoItem[]):Promise<void> {
        let list = sp.web.lists.getByTitle(PromoItemRepository.LIST_NAME);

        const entityTypeFullName = await list.getListItemEntityTypeFullName();

        let batch = sp.web.createBatch();

        items.map((entity, index) => {
            const number = index + 1;
            const data = {
                PromoId: promoItemId,
                Title: promoID + "." + number,
                ShortDescription: entity.ShortDescription,
                CategoryId: entity.Category ? entity.Category.ItemId : null,
                Investment: entity.Investment,
                TypeId: entity.Type ? entity.Type.ItemId : null
            };

            if(entity.ItemId)
                list.items.getById(entity.ItemId).inBatch(batch).update(data, "*", entityTypeFullName);                
            else
                list.items.inBatch(batch).add(data, entityTypeFullName);                
        });        

        await batch.execute();
    }

    private static BuildEntity(item: any): PromoItem {
        let entity = new PromoItem();
  
        entity.ItemId = item.ID;
        entity.AdditionalID = item.Title;
  
        return entity;
    }
}