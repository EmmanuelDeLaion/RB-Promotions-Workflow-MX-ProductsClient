import { Entity } from "../../infrastructure";

export class ClientProduct extends Entity {
    public ClientId: number;
    public ProductId: number;
    public Price: number;
    public COGS: number;
}