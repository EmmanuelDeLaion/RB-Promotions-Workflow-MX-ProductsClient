import { Promo, PromoStatus } from "..";
import { Constants } from "../../..";
import { 
    CategoryRepository, 
    ClientRepository, 
    MasterDataRepository, 
    ProductRepository, 
    PromoRepository, 
    TypeRepository 
} from "../../../data";
import { LookupValue } from "../../../infrastructure";
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
        viewModel.BusinessUnits = await MasterDataRepository.GetBusinessUnits();
        viewModel.Brands = await MasterDataRepository.GetBrands();
        viewModel.ProductCategories = await MasterDataRepository.GetProductCategories();
        viewModel.Products = await ProductRepository.GetAll();

        viewModel.BusinessUnits.unshift(new LookupValue());
        viewModel.Brands.unshift(new LookupValue());
        viewModel.ProductCategories.unshift(new LookupValue());
        
        if(this.Entity.Items.length > 0 && this.Entity.Items[0].Category)
            viewModel.Types = await TypeRepository.GetByCategory(this.Entity.Items[0].Category.ItemId);

        viewModel.ShowSaveButton = true;
        viewModel.ShowSubmitButton = true;

        return viewModel;
    }    

    public Save(entity: Promo): Promise<void>
    {
        entity.ChangeState(PromoStatus.Draft);

        return PromoRepository.SaveOrUpdate(entity);
    }

    public Submit(entity: Promo): Promise<void>
    {
        entity.ChangeState(PromoStatus.Approval);

        this.InitializeWorkflowState(entity);

        return PromoRepository.SaveOrUpdate(entity);
    }
}