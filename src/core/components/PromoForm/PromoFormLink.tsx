import * as React from "react";
import { ExtensionContext } from "@microsoft/sp-extension-base";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { PromoFormDialog } from '.';
import {
  Stack,
  getTheme,
  PrimaryButton
} from "office-ui-fabric-react";
import { CommonHelper } from "../../common/CommonHelper";

import { initializeTheme } from './Theme';
import { SecurityHelper } from "../../common";
import { Constants } from "../../Constants";
import { ClientRepository, ConfigurationRepository } from "../../data";
import { PromoFormDialogTaskToDo } from './PromoFormDialogTaskToDo';
initializeTheme();
const theme = getTheme();

export interface IPromoFormLinkProps {
  context: ExtensionContext | WebPartContext;
}

export interface IPromoFormLinkState {
  showButton: boolean;
}

export class PromoFormLink extends React.Component<IPromoFormLinkProps, IPromoFormLinkState> {

  constructor(props: IPromoFormLinkProps) {
    super(props);
    this.state = {
      showButton: false
    };
  }

  private banner: any = require('../../../assets/images/banner.png');

  private mainStakStyles = {
    backgroundImage: "url(" + this.banner + ")",
    padding: "16px",
    height: "240px",
    backgroundSize: 'cover'
  };

  private headerStyles = {
    font: "normal normal 600 32px/48px Segoe UI",
    color: "#FFFFFF",
  };

  private subHeaderStyles = {
    font: "normal normal normal 18px/24px Segoe UI",
    color: "#FFFFFF",
  };

  private openPromotionButtonStyles = {
    width: "180px",
    backgroundColor: "#425C68",
    border: "transparent",
    margin: "5px"
  };

  public componentDidMount() {
    var itemId = CommonHelper.getParameterByName("ItemId");

    if (itemId != null)
      this.openPromoFormDialog();


    ConfigurationRepository.GetInstance().then((config) => {
      SecurityHelper.GetCurrentUser().then((user) => {
        SecurityHelper.UserIsMemberOfGroup(user.ItemId, config.KAMsGroupName).then((isMember) => {
          if (isMember) {
            ClientRepository.UserIsKAM(user.ItemId).then((isKAM) => {
              this.setState({ showButton: isKAM });
            });
          }
        });
      });
    });
  }

  public render(): React.ReactElement<IPromoFormLinkProps> {
    var output =
      <Stack style={this.mainStakStyles}>
        <Stack verticalFill verticalAlign="start">
          <span style={this.headerStyles}>TPM ??? Trade Promotions Management</span>
          <span style={this.subHeaderStyles}>LATAM</span>
        </Stack>
        <Stack verticalAlign="end" horizontal>
          <div hidden={!this.state.showButton}>
            <PrimaryButton
              onClick={() => this.openPromoFormDialog()}
              style={this.openPromotionButtonStyles}
              text="Nueva promoci??n"
              title="Nueva promoci??n" />
          </div>
          {/* //TODO: Mis pendientes */}
          <div hidden={false}>
            <PrimaryButton
            onClick={() => this.openTasksToDo()}
              style={this.openPromotionButtonStyles}
              text="Mis pendientes"
              title="Mis pendientes" />
          </div>
        </Stack>
      </Stack>;
    return output;
  }

  private openPromoFormDialog(): void {
    var itemId = CommonHelper.getParameterByName("ItemId");
    var dialog: PromoFormDialog = new PromoFormDialog(!isNaN(parseFloat(itemId)) ? parseFloat(itemId) : null);
    dialog.context = this.props.context;
    dialog.show();
  }


  // TODO: Mis pendientes
  private openTasksToDo(): void {
    console.log("Abrir lista de pendientes");
    let dialog : PromoFormDialogTaskToDo = new PromoFormDialogTaskToDo();
    dialog.context = this.props.context;
    dialog.show();
  }



}
