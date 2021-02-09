import { Entity, LookupValue } from "../../infrastructure";
import { CategoryType, Client } from "../Common";
import { NewPromoState, PromoState, DraftPromoState } from "./PromoStates";
import { PromoStatus, PromoViewModel } from "./";
import { PromoItem } from "./PromoItem";
import { ApprovalState } from "./PromoStates/ApprovalState";
import { PromoWorkflowState } from "./PromoWorkflowState";
import { ApprovedState } from "./PromoStates/ApprovedState";
import { RejectedState } from "./PromoStates/RejectedState";

export class Promo extends Entity {

    public PromoID: string;
    public Name: string;
    public ActivityObjective: string;
    public Client: Client;
    public Items: PromoItem[];
    public CountryCode: string;
    public CurrentStageNumber: number;
    public WorkflowStages: PromoWorkflowState[];
    protected _state: PromoState;    

    constructor(conuntryCode: string) {
        super();

        this.CountryCode = conuntryCode;
        this.PromoID = this.CountryCode + "--";
        this.Items = [new PromoItem({AdditionalID: this.PromoID + ".1", GetBaseGMSum: this.GetBaseGMSum.bind(this)})];

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
            case PromoStatus.Approved:
                this._state = new ApprovedState();
                break;
            case PromoStatus.Rejected:
                this._state = new RejectedState();
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

    public Approve(): Promise<void>
    {       
        return this._state.Approve();
    }

    public Reject(): Promise<void>
    {       
        return this._state.Reject();
    }

    public GetBaseGMSum(category: CategoryType) {
        let sum: number = 0;

        if(this.Items){
            this.Items.map((item) => {
                if(item.GetCategoryType() == category)
                    sum += item.GetBaseGM();
            });
        }

        return sum;
    }
}