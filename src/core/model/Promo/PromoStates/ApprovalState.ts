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

export class ApprovalState extends PromoState {
    public GetStatusId(): number {
        return PromoStatus.Approval;
    }

    public GetStatusText(): string {
        return Constants.StatusTexts.Approval;
    }

    public async GetViewModel(): Promise<PromoViewModel> {
        let viewModel = new PromoViewModel(this.Entity);

        viewModel.ReadOnlyForm = true;

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

        viewModel.ShowApproveButton = true;
        viewModel.ShowRejectButton = true;

        return viewModel;
    }    

    public Approve(entity: Promo): Promise<void>
    {
        //TODO: Implementar lógica del workflow
        entity.ChangeState(PromoStatus.Approved);

        return PromoRepository.SaveOrUpdate(entity);
    }

    public Submit(entity: Promo): Promise<void>
    {
        entity.ChangeState(PromoStatus.Rejected);

        return PromoRepository.SaveOrUpdate(entity);
    }
}