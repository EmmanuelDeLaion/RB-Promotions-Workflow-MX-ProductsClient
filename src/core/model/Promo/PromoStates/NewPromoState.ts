import { Promo } from "..";
import { Constants } from "../../..";
import { 
    ClientRepository, 
    PromoRepository,
    CategoryRepository,
    ProductRepository,
} from "../../../data";
import { PromoStatus } from "../PromoStatus";
import { PromoViewModel } from "../PromoViewModel";
import { PromoState } from "./PromoState";

export class NewPromoState extends PromoState {
    public GetStatusId(): number {
        return PromoStatus.New;
    }
    
    public GetStatusText(): string {
        return Constants.StatusTexts.NewPromo;
    }

    public async GetViewModel(): Promise<PromoViewModel> {
        let viewModel = new PromoViewModel(this.Entity);

        viewModel.Clients = await ClientRepository.GetClients();
        viewModel.Categories = await CategoryRepository.GetAll();
        viewModel.Products = await ProductRepository.GetAll();

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