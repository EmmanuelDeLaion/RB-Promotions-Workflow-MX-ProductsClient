import { Promo, PromoStatus } from "..";
import { Constants } from "../../..";
import { ClientRepository, PromoRepository } from "../../../data";
import { PromoViewModel } from "../PromoViewModel";
import { PromoState } from "./PromoState";

export class DraftPromoState extends PromoState {
    public GetStatusId(): number {
        return PromoStatus.Draft;
    }

    public GetStatusText(): string {
        return Constants.StatusTexts.DraftPromo;
    }

    public async GetViewModel(): Promise<PromoViewModel> {
        let viewModel = new PromoViewModel(this.Entity);

        viewModel.Clients = await ClientRepository.GetClients();

        return viewModel;
    }    

    public ExecuteAction1(entity: Promo): Promise<void>
    {
        entity.ChangeState(PromoStatus.Draft);

        return PromoRepository.SaveOrUpdate(entity);
    }

    public ExecuteAction2(entity: Promo): Promise<void>
    {
        entity.ChangeState(PromoStatus.Approval);

        return PromoRepository.SaveOrUpdate(entity);
    }
}