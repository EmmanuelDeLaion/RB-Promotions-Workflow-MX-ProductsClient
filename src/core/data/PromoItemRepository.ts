import { sp } from "@pnp/sp/presets/all";
import { Category, Product, Type } from "../model/Common";
import { PromoItem } from "../model/Promo";
import { CategoryRepository } from "./CategoryRepository";
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
                "CategoryId",
                "Investment",
                "Type/ID", 
                "Type/Title", 
                "CappedActivity",
                "BusinessUnit/ID",
                "BusinessUnit/Title",
                "Brand/ID",
                "Brand/Title",
                "ProductCategory/ID",
                "ProductCategory/Title",
                "ProductId",
                "StartDate",
                "EndDate",
                "DiscountPerPiece",
                "NetPrice",
                "COGS"
            ).expand("Type", "BusinessUnit", "Brand", "ProductCategory").filter(`PromoId eq ${promoId}`).get();
        
        //TODO: revisar y mejorar este query
        const collection = items.map(async (item) => { 
            const category = item.CategoryId ? await CategoryRepository.GetById(item.CategoryId) : null;
            const product = item.ProductId ? await ProductRepository.GetById(item.ProductId) : null;
            return PromoItemRepository.BuildEntity(item, category, product);
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
                BusinessUnitId: entity.BusinessUnit ? entity.BusinessUnit.ItemId: null,
                BrandId: entity.Brand ? entity.Brand.ItemId : null,
                ProductCategoryId: entity.ProductCategory ? entity.ProductCategory.ItemId : null,
                ProductId: entity.Product ? entity.Product.ItemId : null,
                StartDate: entity.StartDate,
                EndDate: entity.EndDate,
                DiscountPerPiece: entity.DiscountPerPiece,
                NetPrice: entity.NetPrice,
                COGS: entity.COGS,
                DiscountPercentage: entity.GetDiscountPercentage(),
                GMPercentageNR: entity.GetGMPercentageNR(),
                GMPercentageNRWithPromo: entity.GetGMPercentageNRWithPromo(),
                GMBaseUnit: entity.GetGMBaseUnit(),
                GMPromoUnit: entity.GetGMPromoUnit()
            };

            if(entity.ItemId)
                list.items.getById(entity.ItemId).inBatch(batch).update(data, "*", entityTypeFullName);                
            else
                list.items.inBatch(batch).add(data, entityTypeFullName);                
        });        

        await batch.execute();
    }

    private static BuildEntity(item: any, category?: Category, product?: Product): PromoItem {
        let entity = new PromoItem();
  
        entity.ItemId = item.ID;
        entity.AdditionalID = item.Title;
        entity.ShortDescription = item.ShortDescription;
        entity.Category = category;
        entity.Investment = item.Investment;
        entity.Type = item.Type ? { ItemId: item.Type.ID, Name: item.Type.Title } : null;
        entity.CappedActivity = item.CappedActivity;
        entity.BusinessUnit = item.BusinessUnit ? { ItemId: item.BusinessUnit.ID, Value: item.BusinessUnit.Title } : null;
        entity.Brand = item.Brand ? { ItemId: item.Brand.ID, Value: item.Brand.Title } : null;
        entity.ProductCategory = item.ProductCategory ? { ItemId: item.ProductCategory.ID, Value: item.ProductCategory.Title } : null;
        entity.Product = product;
        entity.StartDate = new Date(item.StartDate);
        entity.EndDate = new Date(item.EndDate);
        entity.DiscountPerPiece = item.DiscountPerPiece;
        entity.NetPrice= item.NetPrice;
        entity.COGS = item.COGS;
  
        return entity;
    }
}