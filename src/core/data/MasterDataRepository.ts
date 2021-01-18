import { sp } from "@pnp/sp/presets/all";
import { LookupValue } from "../infrastructure";

export class MasterDataRepository {
    private static BU_LIST_NAME: string = "Unidades de negocio";
    private static BRANDS_LIST_NAME: string = "Marcas";
    private static PRODUCT_CATEGORIES_LIST_NAME: string = "Categorías de producto";

    public static async GetBusinessUnits():Promise<LookupValue[]>
    {
        const collection = sp.web.lists.getByTitle(MasterDataRepository.BU_LIST_NAME)
            .items.select("ID", "Title").orderBy("Title").get().then((items) => { 
                return items.map((item) => {                     
                    return { ItemId: item.ID, Value: item.Title };
                });
            });

        return collection;
    }

    public static async GetBrands():Promise<LookupValue[]>
    {
        const collection = sp.web.lists.getByTitle(MasterDataRepository.BRANDS_LIST_NAME)
            .items.select("ID", "Title").orderBy("Title").get().then((items) => { 
                return items.map((item) => {                     
                    return { ItemId: item.ID, Value: item.Title };
                });
            });

        return collection;
    }

    public static async GetProductCategories():Promise<LookupValue[]>
    {
        const collection = sp.web.lists.getByTitle(MasterDataRepository.PRODUCT_CATEGORIES_LIST_NAME)
            .items.select("ID", "Title").get().then((items) => { 
                return items.map((item) => {                     
                    return { ItemId: item.ID, Value: item.Title };
                });
            });

        return collection;
    }
}