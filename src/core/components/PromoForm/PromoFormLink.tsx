import * as React from "react";
import { ExtensionContext } from "@microsoft/sp-extension-base";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { PromoFormDialog } from '.';
import { MockupFormDialog } from '../MockupFormDialog/MockupFormDialog';
import { TextField } from "office-ui-fabric-react";
import { CommonHelper } from "../../common/CommonHelper";

export interface IPromoFormLinkProps{
    context: ExtensionContext | WebPartContext;
}

export class PromoFormLink extends React.Component<IPromoFormLinkProps, {}> {

    public render(): React.ReactElement<IPromoFormLinkProps> {
        var output = 
            <div>
                <a onClick={() => this.openPromoFormDialog()} style={{cursor: "pointer" }}>Nueva promoción</a>

                <br/><br/>

                {/* <a onClick={() => this.openMockupFormDialog()} style={{cursor: "pointer" }}>Maquetado</a> */}
            </div>;

        return output;
    }

    private openPromoFormDialog(): void{
        var itemId = CommonHelper.getParameterByName("ItemId");
        var dialog: PromoFormDialog = new PromoFormDialog(!isNaN(parseFloat(itemId)) ? parseFloat(itemId) : null);
        //dialog.title = "Nueva promoción";
        dialog.context = this.props.context;
        dialog.show();
    }

    // private openMockupFormDialog(): void{
    // {
    //     var dialog: MockupFormDialog = new MockupFormDialog();
    //     dialog.context = this.props.context;
    //     dialog.show();
    // }
}
}