import { Entity } from "../../infrastructure";

export class Product extends Entity {
    public SKUNumber: string;
    public SKUDescription: string;
    public BusinessUnit: string;
    public Category: string;
    public Brand: string;

    public constructor(init?:Partial<Product>) {
        super();
        (<any>Object).assign(this, init);
    }
}