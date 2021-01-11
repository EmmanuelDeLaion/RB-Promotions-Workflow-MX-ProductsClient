import * as React from 'react';

import { DefaultButton, Label, PrimaryButton, Separator, Stack } from 'office-ui-fabric-react';

export const ModalBottom: React.FunctionComponent = () => {

    return (
        <div className="modalBottom">
            <Label>Estado general de la promoción</Label>
            <Separator className="graySeparator separatorToTop"/>
            <Stack className="modalBottomContent" horizontal grow={12}>
                <Stack grow={3}>
                    <Label className="modalBottomContentHeader">Efectividad</Label>
                    <div>
                        <span className="notEffectiveLabel">NO EFECTIVA</span>
                    </div>
                </Stack>
                <Stack grow={3}>
                    <Label className="modalBottomContentHeader">ROI Estimado por SKU</Label>
                    <Label className="modalBottomContentValue">1.37</Label>
                </Stack>
                <Stack grow={3}>
                    <Label className="modalBottomContentHeader">ROI Estimado total</Label>
                    <Label className="modalBottomContentValue">0.92</Label>
                </Stack>
                <Stack className="modalBottomButtonsContainer" grow={3} horizontal horizontalAlign="end">
                    <Stack>
                        <DefaultButton text="Guardar borrador" allowDisabledFocus />
                    </Stack>
                    <Stack>
                        <PrimaryButton text="Enviar a aprobación" allowDisabledFocus />
                    </Stack>
                </Stack>    
            </Stack>
        </div>
    );
};