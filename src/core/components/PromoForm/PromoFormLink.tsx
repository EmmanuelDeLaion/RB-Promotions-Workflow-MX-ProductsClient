import * as React from "react";
import { ExtensionContext } from "@microsoft/sp-extension-base";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { PromoFormDialog } from '.';
import { Stack, 
        DefaultButton, 
        getTheme } from "office-ui-fabric-react";
import { CommonHelper } from "../../common/CommonHelper";

import { initializeTheme } from './Theme';
initializeTheme();
const theme = getTheme();

export interface IPromoFormLinkProps{
    context: ExtensionContext | WebPartContext;
}

export class PromoFormLink extends React.Component<IPromoFormLinkProps, {}> {

    private banner: any = require('../../../assets/images/banner.png');

    private mainStakStyles = {
        backgroundImage: "url(" + this.banner + ")",
        padding: "16px",
        height: "200px",
        backgroundSize: 'cover'
    };

    private headerStyles = {
        font: "normal normal 600 32px/64px Segoe UI",
        color: "#FFFFFF",
    };

    private subHeaderStyles = {
        font: "normal normal normal 18px/38px Segoe UI",
        color: "#FFFFFF",
    };

    private openPromotionButtonStyles = {
        width: "180px"
    };

    public render(): React.ReactElement<IPromoFormLinkProps> {
        var output = 
            <Stack style={this.mainStakStyles}>
                <Stack verticalFill verticalAlign="start">
                    <span style={this.headerStyles}>Sistema de Promociones</span>
                    <span style={this.subHeaderStyles}>Portal de carga y aprobaciones de Promociones</span>
                </Stack>
                <Stack verticalAlign="end" horizontal>
                    <DefaultButton 
                        onClick={() => this.openPromoFormDialog()} 
                        style={this.openPromotionButtonStyles} 
                        text="Nueva promoción" 
                        title="Nueva promoción" />
                </Stack>
            </Stack>;

        return output;
    }

    private openPromoFormDialog(): void{
        var itemId = CommonHelper.getParameterByName("ItemId");
        var dialog: PromoFormDialog = new PromoFormDialog(!isNaN(parseFloat(itemId)) ? parseFloat(itemId) : null);
        //dialog.title = "Nueva promoción";
        dialog.context = this.props.context;
        dialog.show();
    }
}