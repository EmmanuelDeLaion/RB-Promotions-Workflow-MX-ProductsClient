import { override } from '@microsoft/decorators';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'PromoFormWebPartWebPartStrings';
import { IPromoFormLinkProps, PromoFormLink } from '../../core/components/PromoForm';
import { sp } from '@pnp/sp';

export interface IPromoFormWebPartWebPartProps {
  description: string;
}

export default class PromoFormWebPartWebPart extends BaseClientSideWebPart <IPromoFormWebPartWebPartProps> {

  @override
  protected onInit(): Promise<void> {

    return super.onInit().then(_ => { 
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<IPromoFormLinkProps> = React.createElement(
      PromoFormLink,
      {
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private openPromoFormDialog(): void{
    console.log("Open promo form...");
}

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
