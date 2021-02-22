import { PromoStatus } from "..";
import { Constants } from "../../..";
import { 
    CategoryRepository, 
    ClientRepository,  
    ProductRepository, 
    TypeRepository 
} from "../../../data";
import { PromoViewModel } from "../PromoViewModel";
import { PromoState } from "./PromoState";

export class RejectedState extends PromoState {
    public GetStatusId(): number {
        return PromoStatus.Rejected;
    }

    public GetStatusText(): string {
        return Constants.StatusTexts.Rejected;
    }

    public async GetViewModel(): Promise<PromoViewModel> {
        let viewModel = new PromoViewModel(this.Entity);

        viewModel.ReadOnlyForm = true;

        viewModel.Clients = await ClientRepository.GetClients();
        viewModel.Categories = await CategoryRepository.GetAll();
        viewModel.Products = await ProductRepository.GetAll();
        
        if(this.Entity.Items.length > 0 && this.Entity.Items[0].Category)
            viewModel.Types = await TypeRepository.GetByCategory(this.Entity.Items[0].Category.ItemId);

        return viewModel;
    } 
}