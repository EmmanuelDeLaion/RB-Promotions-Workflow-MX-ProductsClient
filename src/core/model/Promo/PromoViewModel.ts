import { FieldDisplayMode, LookupValue } from "../../infrastructure";
import { Category, Client, Type } from "../Common";
import { Promo } from "./Promo";

export class PromoViewModel {
    public Entity: Promo;

    constructor(entity: Promo){
        this.Entity = entity;
    }

    //#region Fields Configuration

    public ActivityObjectiveDisplayMode: FieldDisplayMode;
    public ClientDisplayMode: FieldDisplayMode;
    public HeadOfChannelDisplayMode: FieldDisplayMode;
    //public ShortDescriptionDisplayMode: FieldDisplayMode;
    //public PromoCategoryDisplayMode: FieldDisplayMode;

    //#endregion

    //#region Collections

    public Clients: Client[];
    public Categories: Category[];
    public Types: Type[];

    //#endregion
}