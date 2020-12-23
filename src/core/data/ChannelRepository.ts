import { sp } from "@pnp/sp/presets/all";
import { Channel } from "../model/Common/Channel";

export class ChannelRepository {
    private static LIST_NAME: string = "Canales";

    public static GetById(id: number): Promise<Channel> {
        const entity = sp.web.lists.getByTitle(ChannelRepository.LIST_NAME)
          .items.getById(id).select("ID", "Title", "HeadOfChannel/ID", "HeadOfChannel/Title").expand("HeadOfChannel").get().then((item) => {      
            return ChannelRepository.BuildEntity(item);
          });
  
        return entity;
    }

    private static BuildEntity(item: any): Channel {
        let entity = new Channel();
  
        entity.ItemId = item.ID;
        entity.Name = item.Title;
        entity.HeadOfChannel = item.HeadOfChannel ? { ItemId: item.HeadOfChannel.ID, Value: item.HeadOfChannel.Title } : null;

        return entity;
    }
}