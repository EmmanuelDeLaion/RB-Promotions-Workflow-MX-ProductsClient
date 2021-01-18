import { Entity, LookupValue } from "../../infrastructure";

export class Category extends Entity {
    public Name: string;
    public RequiresInvestment: boolean;
    public RequiresDiscountPerPiece: boolean;
    public RequiresNetPrice: boolean;

    public constructor(init?:Partial<Category>) {
        super();
        (<any>Object).assign(this, init);
    }
}