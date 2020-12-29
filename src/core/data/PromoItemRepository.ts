import { sp } from "@pnp/sp/presets/all";
import { Product, Type } from "../model/Common";
import { PromoItem } from "../model/Promo";
import { ProductRepository } from "./ProductRepository";

export class PromoItemRepository {
    private static LIST_NAME: string = "Promo items";

    public static async GetByPromo(promoId: number):Promise<PromoItem[]>
    {
        const items = await sp.web.lists.getByTitle(PromoItemRepository.LIST_NAME)
            .items.select(
                    "ID", 
                    "Title", 
                    "ShortDescription",
                    "Category/ID", 
                    "Category/Title", 
                    "Investment",
                    "Type/ID", 
                    "Type/Title", 
                    "CappedActivity", 
                    "ProductId").expand("Category", "Type").filter(`PromoId eq ${promoId}`).get();
        
        //TODO: revisar y mejorar este query
        const collection = items.map(async (item) => { 
            const product = item.ProductId ? await ProductRepository.GetById(item.ProductId) : null;
            return PromoItemRepository.BuildEntity(item, product);
        });       

        return Promise.all(collection);
    }

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
                TypeId: entity.Type ? entity.Type.ItemId : null,
                CappedActivity: entity.CappedActivity,
                ProductId: entity.Product ? entity.Product.ItemId : null
            };

            if(entity.ItemId)
                list.items.getById(entity.ItemId).inBatch(batch).update(data, "*", entityTypeFullName);                
            else
                list.items.inBatch(batch).add(data, entityTypeFullName);                
        });        

        await batch.execute();
    }

    private static BuildEntity(item: any, product?: Product): PromoItem {
        let entity = new PromoItem();
  
        entity.ItemId = item.ID;
        entity.AdditionalID = item.Title;
        entity.ShortDescription = item.ShortDescription;
        entity.Category = item.Category ? { ItemId: item.Category.ID, Name: item.Category.Title } : null;
        entity.Investment = item.Investment;
        entity.Type = item.Type ? { ItemId: item.Type.ID, Name: item.Type.Title } : null;
        entity.CappedActivity = item.CappedActivity;
        entity.Product = product;

        console.log(entity);
  
        return entity;
    }
}