import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseDialog } from '@microsoft/sp-dialog';
import { ExtensionContext } from "@microsoft/sp-extension-base";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ListTaskToDo } from '../ListTaskToDo/ListTaskToDo';

export class PromoFormDialogTaskToDo extends BaseDialog {
  public title: string;
  public context: ExtensionContext | WebPartContext;

  constructor() {
    super({ isBlocking: true });
  }

  protected onAfterClose(): void {
    super.onAfterClose();
    ReactDOM.unmountComponentAtNode(this.domElement);
  }

  protected render(): void {
    ReactDOM.render(
      <div>
        <ListTaskToDo
          title={this.title}
          close={this.close}
          submit={this.submit}
          context={this.context}
        />
      </div>
      , this.domElement);
  }

  private submit(): void {
    this.close();
  }


}
