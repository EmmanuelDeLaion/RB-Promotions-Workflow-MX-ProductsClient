import { Entity, LookupValue } from "../../infrastructure";
import { Category, Product, Type } from "../Common";

export class PromoItem extends Entity {
    public AdditionalID: string;
    public ShortDescription: string;
    public Category: Category;
    public Investment?: number;
    public Type: Type;
    public CappedActivity: boolean = false;
    public BusinessUnit: LookupValue;
    public Brand: LookupValue;
    public ProductCategory: LookupValue;
    public Product: Product;
    public StartDate: Date;
    public EndDate: Date;

    public constructor(init?:Partial<PromoItem>) {
        super();
        (<any>Object).assign(this, init);
    }

    public InvestmentAsString():string {
        return this.Investment != null ? this.Investment.toString() : null;
    }

    public StartDateAsString():string {
        //TODO: Implementar
        return this.StartDate.toDateString();
    }

    public RequiresInvestment():boolean {
        return this.Category && this.Category.RequiresInvestment;
    }
}