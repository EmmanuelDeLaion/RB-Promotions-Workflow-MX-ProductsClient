import { ActionConfirmationType } from "../../infrastructure";
import { ClientProduct } from "../../model/Common";
import { PromoViewModel } from "../../model/Promo/PromoViewModel";
import { Promos } from '../../model/Promo/Promos';

export interface IListTaskToDoState {
    isLoading: boolean;
    hasValidationError: boolean;
    formSubmitted: boolean;
    resultIsOK: boolean;
    mainModalOpen: boolean;
    hideLoading?: boolean;
    promotionTitle: string;
    currentUser: String;
    promoProven: boolean;
    flowApproval: boolean;
    promos: Promos[];
}
