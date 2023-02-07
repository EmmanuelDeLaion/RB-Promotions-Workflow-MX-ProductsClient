import { Client } from '../Common/Client';
import { FlowType } from '../Common/FlowType';
import { Entity } from '../../infrastructure/Entity';

export class Promos extends Entity {
  public PromoID: string;
  public Title: string;
  public Name: string = "";
  public Client: Client;
  public TipoFlujo: FlowType;
  public EndDate: string;
  public StartDate: string;
  public Status: string;
  public Approvals: string;

  public constructor(init?: Partial<Client>) {
    super();
    (<any>Object).assign(this, init);
  }
}
