import { ExtensionContext } from "@microsoft/sp-extension-base";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IMockupFormProps {
    itemId?: number;
    title: string;
    close?: () => void;
    submit?: () => void;  
    context: ExtensionContext | WebPartContext;  
}