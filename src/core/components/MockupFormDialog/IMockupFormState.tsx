// import { Product } from "../../model/Common";
// import { PromoViewModel } from "../../model/Promo/PromoViewModel";

export interface IMockupFormState {
    isLoading: boolean;
    hasValidationError: boolean;
    enableSubmit: boolean;
    formSubmitted: boolean;
    resultIsOK: boolean;
    // viewModel?: PromoViewModel;
    errorMessage: string; 
    selectedIndex: number;
    loadingTypes: boolean;
    // filteredProducts: Product[];

    mainModalOpen: boolean;
    hideDeleteProductDialog: boolean;
    hideModalConfirmationDialog: boolean;
    effective: boolean;
}