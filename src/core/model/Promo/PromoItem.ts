import { Entity } from "../../infrastructure";
import { Category, Type } from "../Common";

export class PromoItem extends Entity {
    public AdditionalID: string;
    public ShortDescription: string;
    public Category: Category;
    public Investment?: number;
    public Type: Type;

    public InvestmentAsString():string {
        return this.Investment != null ? this.Investment.toString() : null;
    }
}