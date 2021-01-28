import { Entity } from "../../infrastructure";
import { Client } from "../Common";
import { NewPromoState, PromoState, DraftPromoState } from "./PromoStates";
import { PromoStatus, PromoViewModel } from "./";
import { PromoItem } from "./PromoItem";
import { ApprovalState } from "./PromoStates/ApprovalState";

export class Promo extends Entity {

    public PromoID: string;
    public Name: string;
    public ActivityObjective: string;
    public Client: Client;
    public Items: PromoItem[];
    public CountryCode: string;
    protected _state: PromoState;

    constructor(conuntryCode: string) {
        super();

        this.CountryCode = conuntryCode;
        this.PromoID = this.CountryCode + "--";
        this.Items = [new PromoItem({AdditionalID: this.PromoID + ".1"})];

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
            case PromoStatus.Approval:
                this._state = new ApprovalState();
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

    public Save(entity: Promo): Promise<void>
    {       
        return this._state.Save(entity);
    }

    public Submit(entity: Promo): Promise<void>
    {       
        return this._state.Submit(entity);
    }
}