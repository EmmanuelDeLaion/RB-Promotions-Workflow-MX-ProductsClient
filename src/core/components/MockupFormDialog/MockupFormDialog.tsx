import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseDialog } from '@microsoft/sp-dialog';
import { ExtensionContext } from "@microsoft/sp-extension-base";
import { WebPartContext } from "@microsoft/sp-webpart-base";

import { MockupForm } from './MockupForm';

export class MockupFormDialog extends BaseDialog {
    public title: string;
    public itemId?: number;
    public context: ExtensionContext | WebPartContext;

    constructor(itemId?: number) {
        super({isBlocking: true});
        this.itemId = itemId;
    }

    protected onAfterClose(): void {
        super.onAfterClose();
   
        // Clean up the element for the next dialog
        ReactDOM.unmountComponentAtNode(this.domElement);
    }

    protected render(): void {
        ReactDOM.render(<MockupForm />, this.domElement);
    }

    private submit(): void {
        this.close();      
    }
}