import { Promo, PromoStatus } from "..";
import { Constants } from "../../..";
import { CategoryRepository, ClientRepository, ProductRepository, PromoRepository, TypeRepository } from "../../../data";
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
        viewModel.Categories = await CategoryRepository.GetAll();
        viewModel.Products = await ProductRepository.GetAll();
        
        if(this.Entity.Items.length > 0 && this.Entity.Items[0].Category)
            viewModel.Types = await TypeRepository.GetByCategory(this.Entity.Items[0].Category.ItemId);

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