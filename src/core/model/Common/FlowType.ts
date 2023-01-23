import { Entity, LookupValue } from "../../infrastructure";

export class FlowType extends Entity {
    public Name: string;

    public constructor(init?:Partial<FlowType>) {
        super();
        (<any>Object).assign(this, init);
    }
}