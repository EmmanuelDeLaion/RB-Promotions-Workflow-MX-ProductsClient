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

        return viewModel;
    } 
}