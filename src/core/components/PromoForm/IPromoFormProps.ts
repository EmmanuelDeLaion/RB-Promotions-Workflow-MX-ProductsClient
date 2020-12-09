import { ExtensionContext } from "@microsoft/sp-extension-base";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IPromoFormProps {
    context: ExtensionContext | WebPartContext;
}