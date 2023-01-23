import { PromoStatus } from "..";
import { Constants } from "../../..";
import {
    CategoryRepository,
    ClientRepository,
    ProductRepository,
    PromoRepository,
    TypeRepository
} from "../../../data";
import { SecurityHelper } from "../../../common/SecurityHelper";
import { WorkflowLogRepository } from "../../../data/WorkflowLogRepository";
import { Promo } from "../Promo";
import { PromoViewModel } from "../PromoViewModel";
import { PromoState } from "./PromoState";

export class ApprovedState extends PromoState {

    public GetStatusId(): number {
        return PromoStatus.Approved;
    }

    public GetStatusText(): string {
        return Constants.StatusTexts.Approved;
    }

    public async GetViewModel(): Promise<PromoViewModel> {
        let viewModel = new PromoViewModel(this.Entity);

        viewModel.ReadOnlyForm = true;
        viewModel.ShowEvidenceButton = true;

        return viewModel;
    }

    public async Proven(comments: string): Promise<void>
    {
        await WorkflowLogRepository.Save(this.Entity.ItemId, this.Entity.PromoID, "Comprobada", comments, this.Entity);
        this.Entity.ChangeState(PromoStatus.Proven);
        return PromoRepository.SaveOrUpdate(this.Entity, 1);

    }

}
