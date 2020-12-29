import { Entity } from "../../infrastructure";
import { Category, Product, Type } from "../Common";

export class PromoItem extends Entity {
    public AdditionalID: string;
    public ShortDescription: string;
    public Category: Category;
    public Investment?: number;
    public Type: Type;
    public CappedActivity: boolean = false;
    public Product: Product;

    public constructor(init?:Partial<PromoItem>) {
        super();
        (<any>Object).assign(this, init);
    }

    public InvestmentAsString():string {
        return this.Investment != null ? this.Investment.toString() : null;
    }
}