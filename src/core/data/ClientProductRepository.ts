import { sp } from "@pnp/sp/presets/all";
import { ClientProduct } from "../model/Common";
import { Channel } from "../model/Common/Channel";

export class ClientProductRepository {
    private static LIST_NAME: string = "Productos por cliente";

    public static GetById(id: number): Promise<ClientProduct> {
        const entity = sp.web.lists.getByTitle(ClientProductRepository.LIST_NAME)
          .items.getById(id).select("ID", "Price", "COGS").get().then((item) => {
            return ClientProductRepository.BuildEntity(item);
          });
  
        return entity;
    }

    public static async GetByClientAndProduct(clientId: number, productId: number):Promise<ClientProduct>
    {
        const collection = sp.web.lists.getByTitle(ClientProductRepository.LIST_NAME)
            .items.select("ID", "Price", "COGS").filter(`ClientId eq ${clientId} and ProductId eq ${productId}`).get().then((items) => { 
                if(items.length > 0)
                    return ClientProductRepository.BuildEntity(items[0]);
                else
                    return null;
            });

        return collection;
    }

    private static BuildEntity(item: any): ClientProduct {
        let entity = new ClientProduct();
  
        entity.ItemId = item.ID;
        entity.Price = item.Price;
        entity.COGS = item.COGS;

        return entity;
    }
}