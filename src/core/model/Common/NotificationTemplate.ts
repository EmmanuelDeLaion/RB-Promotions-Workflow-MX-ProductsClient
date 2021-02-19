import { Entity } from "../../infrastructure";

export class NotificationTemplate extends Entity {
    public To: string;
    public Cc: string;
    public Subject: string;
    public Body: string;
    
    public constructor(init?:Partial<NotificationTemplate>) {
        super();
        (<any>Object).assign(this, init);
    }
}