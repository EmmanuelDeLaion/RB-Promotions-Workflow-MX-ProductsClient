import { sp } from "@pnp/sp/presets/all";
import { Product } from "../model/Common";

export class ProductRepository {
    private static LIST_NAME: string = "Productos";

    public static GetById(id: number): Promise<Product> {
        const entity = sp.web.lists.getByTitle(ProductRepository.LIST_NAME)
          .items.getById(id).select("ID", "Title", "SKUDescription", "BusinessUnit", "Brand", "Category").get().then((item) => {      
            return ProductRepository.BuildEntity(item);
          });
  
        return entity;
    }
    
    public static async GetAll():Promise<Product[]>
    {
        const collection = sp.web.lists.getByTitle(ProductRepository.LIST_NAME)
            .items.select("ID", "Title", "SKUDescription", "BusinessUnit", "Brand", "Category").get().then((items) => { 
                return items.map((item) => {                     
                    return ProductRepository.BuildEntity(item);
                });
            });        

        return collection;
    }

    private static BuildEntity(item: any): Product {
        let entity = new Product();
  
        entity.ItemId = item.ID;
        entity.SKUNumber = item.Title;
        entity.SKUDescription = item.SKUDescription;
        entity.BusinessUnit = item.BusinessUnit;
        entity.Brand = item.Brand;
        entity.Category = item.Category;

        return entity;
    }
}