import { Entity, LookupValue } from "../../infrastructure";
import { CategoryType, Client, WorkflowLog } from "../Common";
import { NewPromoState, PromoState, DraftPromoState } from "./PromoStates";
import { PromoStatus, PromoViewModel } from "./";
import { PromoItem } from "./PromoItem";
import { ApprovalState } from "./PromoStates/ApprovalState";
import { PromoWorkflowState } from "./PromoWorkflowState";
import { ApprovedState } from "./PromoStates/ApprovedState";
import { RejectedState } from "./PromoStates/RejectedState";
import { WorkflowLogRepository } from "../../data/WorkflowLogRepository";

export class Promo extends Entity {

    public PromoID: string;
    public Name: string = "";
    public ActivityObjective: string = "";
    public Client: Client;
    public Items: PromoItem[];
    public CountryCode: string;
    public ApprovalAmountLimit: number;
    public CurrentStageNumber: number;
    public WorkflowStages: PromoWorkflowState[];
    public WorkflowLog: WorkflowLog[] = [];
    protected _state: PromoState;    

    constructor(countryCode: string, approvalAmountLimit: number) {
        super();

        this.CountryCode = countryCode;
        this.ApprovalAmountLimit = approvalAmountLimit;
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

    public Approve(comments: string): Promise<void>
    {       
        return this._state.Approve(comments);
    }

    public Reject(comments: string): Promise<void>
    {       
        return this._state.Reject(comments);
    }

    public GetBaseGMSum(category: CategoryType) {
        let value: number = 0;

        if(this.Items) {
            this.Items.map((item) => {
                if(item.GetCategoryType() == category)
                    value += item.GetBaseGM();
            });
        }

        return value;
    }

    public GetTotalEstimatedInvestment(): number {
        let value: number = 0;

        if(this.Items) {
            this.Items.map((item:PromoItem) => {
                value += item.GetEstimatedInvestment() || 0;
            });
        }

        return value;
    }

    public GetTotalEstimatedInvestmentAsString(): string {
        const value = this.GetTotalEstimatedInvestment();
        return value != null ? value.toFixed(0) : "0";
    }

    public GetROI(): number {
        let value: number = 0;
        let incrementalGM: number = 0;
        let additionalInvestment: number = 0;
        const estimatedInvestment = this.GetTotalEstimatedInvestment();

        if(this.Items) {
            this.Items.map((item:PromoItem) => {
                incrementalGM += item.GetIncrementalGM() || 0;
                additionalInvestment += item.AdditionalInvestment || 0;
            });

            const investment = estimatedInvestment + additionalInvestment;
            value = investment > 0 ? incrementalGM / investment : 0;
        }

        return value;
    }

    public GetROIAsString(): string {
        const value = this.GetROI();
        return value != null ? value.toFixed(2) : "0.00";
    }

    public IsEffective(): boolean {
        const roi = this.GetROI();
        return (roi != null && roi >=1);
    }
}