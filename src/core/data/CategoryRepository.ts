import { sp } from "@pnp/sp/presets/all";
import { Category } from "../model/Common";

export class CategoryRepository {
    private static LIST_NAME: string = "Categorías";

    public static GetById(id: number): Promise<Category> {
        const entity = sp.web.lists.getByTitle(CategoryRepository.LIST_NAME)
          .items.getById(id).select("ID", "Title").get().then((item) => {      
            return CategoryRepository.BuildEntity(item);
          });
  
        return entity;
    }
    
    public static async GetAll():Promise<Category[]>
    {
        const collection = sp.web.lists.getByTitle(CategoryRepository.LIST_NAME)
            .items.select("ID", "Title").get().then((items) => { 
                return items.map((item) => {                     
                    return CategoryRepository.BuildEntity(item);
                });
            });        

        return collection;
    }

    private static BuildEntity(item: any): Category {
        let entity = new Category();
  
        entity.ItemId = item.ID;
        entity.Name = item.Title;

        return entity;
    }
}