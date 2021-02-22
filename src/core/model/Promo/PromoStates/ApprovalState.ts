import { Promo, PromoStatus } from "..";
import { Constants } from "../../..";
import { SecurityHelper } from "../../../common/SecurityHelper";
import { 
    CategoryRepository, 
    ClientRepository,  
    ProductRepository, 
    PromoRepository, 
    TypeRepository 
} from "../../../data";
import { PromoViewModel } from "../PromoViewModel";
import { PromoWorkflowState } from "../PromoWorkflowState";
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
        viewModel.Products = await ProductRepository.GetAll();
        
        if(this.Entity.Items.length > 0 && this.Entity.Items[0].Category)
            viewModel.Types = await TypeRepository.GetByCategory(this.Entity.Items[0].Category.ItemId);

        const currentUser = await SecurityHelper.GetCurrentUser();

        console.log(this.Entity.WorkflowStages);

        if(this.GetCurrentStage().UserCanApprove(currentUser.ItemId)){
            viewModel.ShowApproveButton = true;
            viewModel.ShowRejectButton = true;
        }

        return viewModel;
    }    

    private GetCurrentStage(): PromoWorkflowState {
        return this.Entity.WorkflowStages[this.Entity.CurrentStageNumber - 1];
    }

    public async Approve(): Promise<void>
    {
        const stage = this.GetCurrentStage();
        
        stage.AddToCompletBy((await SecurityHelper.GetCurrentUser()).ItemId);

        if(stage.IsComplete()) {
            if(this.Entity.CurrentStageNumber == this.Entity.WorkflowStages.length) {
                this.Entity.ChangeState(PromoStatus.Approved);
            }
            else {
                this.Entity.CurrentStageNumber++;
                //TODO: Implementar lógica para envío de notificaciones
            }
        }

        return PromoRepository.SaveOrUpdate(this.Entity);
    }

    public Reject(): Promise<void>
    {
        this.Entity.ChangeState(PromoStatus.Rejected);

        return PromoRepository.SaveOrUpdate(this.Entity);
    }
}