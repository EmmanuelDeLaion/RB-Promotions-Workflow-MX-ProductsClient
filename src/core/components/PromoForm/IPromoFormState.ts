import { ActionConfirmationType } from "../../infrastructure";
import { ClientProduct } from "../../model/Common";
import { PromoViewModel } from "../../model/Promo/PromoViewModel";

export interface IPromoFormState {
    isLoading: boolean;
    hasValidationError: boolean;
    enableSubmit: boolean;
    formSubmitted: boolean;
    resultIsOK: boolean;
    viewModel?: PromoViewModel;
    errorMessage?: string;
    selectedIndex: number;
    loadingTypes: boolean;
    filteredProducts: ClientProduct[];
    actionsComments?: string;

    canUploadEvidence?: boolean;
    evidenceDescription?:string;
    evidenceDate?:Date;
    hasEvidenceValidatioNError?: boolean;

    mainModalOpen: boolean;
    hideDeleteProductDialog: boolean;
    hideSavingSpinnerConfirmationDialog: boolean;
    hideModalConfirmationDialog: boolean;
    hideActionConfirmationDialog: boolean;
    hideDeleteEvidenceDialog: boolean;
    hideFileExistsMessageDialog: boolean;

    hideLoading?: boolean;

    actionConfirmationDialogTitle?: string;
    actionConfirmationDialogType?: ActionConfirmationType;
    enableActionValidation: boolean;
    promotionTitle: string;
    copiarPromo: boolean;
    currentUser: String;
    promoProven: boolean;
    flowApproval: boolean;
}
