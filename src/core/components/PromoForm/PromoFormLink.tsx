import * as React from "react";
import { ExtensionContext } from "@microsoft/sp-extension-base";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { PromoFormDialog } from '.';
import { TextField } from "office-ui-fabric-react";

export interface IPromoFormLinkProps{
    context: ExtensionContext | WebPartContext;
}

export class PromoFormLink extends React.Component<IPromoFormLinkProps, {}> {

    public render(): React.ReactElement<IPromoFormLinkProps> {
        var output = 
            <div>
                <a onClick={() => this.openPromoFormDialog()} style={{cursor: "pointer" }}>Nueva promoción</a>
            </div>;

        return output;
    }

    private openPromoFormDialog(): void{
        var dialog: PromoFormDialog = new PromoFormDialog();
        dialog.title = "Nueva promoción";
        dialog.context = this.props.context;
        dialog.show();
    }
}