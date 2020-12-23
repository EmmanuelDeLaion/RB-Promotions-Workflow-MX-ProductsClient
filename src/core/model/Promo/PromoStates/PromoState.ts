import { Constants } from "../../..";
import { Promo } from "../Promo";
import { PromoViewModel } from "../PromoViewModel";

export abstract class PromoState {    
    public Entity:Promo;

    public abstract GetStatusId():number;
    public abstract GetStatusText():string;
    public abstract GetViewModel():Promise<PromoViewModel>;

    public ExecuteAction1(entity: Promo): Promise<void>
    {
        throw new Error(Constants.Messages.NotAllowedAction);
    }

    public ExecuteAction2(entity: Promo): Promise<void>
    {
        throw new Error(Constants.Messages.NotAllowedAction);
    }
}