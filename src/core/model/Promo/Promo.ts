import { Entity } from "../../infrastructure";
import { Client } from "../Common";
import { NewPromoState, PromoState, DraftPromoState } from "./PromoStates";
import { PromoStatus, PromoViewModel } from "./";
import { PromoItem } from "./PromoItem";

export class Promo extends Entity {
    public PromoID: string = "MX--";
    public Name: string;
    public ActivityObjective: string;
    public Client: Client;
    public Items: PromoItem[] = [new PromoItem({AdditionalID: this.PromoID + ".1"})];

    protected _state: PromoState;

    constructor() {
        super();

        this.ChangeState(PromoStatus.New);
    }

    public ChangeState(status: PromoStatus):void {
        switch (status) {
            case PromoStatus.New:
                this._state = new NewPromoState();
                break;
            case PromoStatus.Draft:
                this._state = new DraftPromoState();
                break;
            default:
                break;
        }

        this._state.Entity = this;
    }

    public GetStatusText():string {
        return this._state.GetStatusText();
    }

    public GetStatusId():number {
        return this._state.GetStatusId();
    }

    public GetViewModel(): Promise<PromoViewModel> {
        return this._state.GetViewModel();
    }

    public ExecuteAction1(entity: Promo): Promise<void>
    {       
        return this._state.ExecuteAction1(entity);
    }
}