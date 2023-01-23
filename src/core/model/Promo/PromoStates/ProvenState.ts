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

export class ProvenState extends PromoState {
    public GetStatusId(): number {
        return PromoStatus.Proven;
    }

    public GetStatusText(): string {
        return Constants.StatusTexts.Proven;
    }

    public async GetViewModel(): Promise<PromoViewModel> {
        let viewModel = new PromoViewModel(this.Entity);

        viewModel.ReadOnlyForm = true;
        viewModel.ShowEvidenceButton = true;

        return viewModel;
    }

}