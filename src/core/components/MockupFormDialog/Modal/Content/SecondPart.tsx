import { Icon, Label, Separator, Stack, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { initializeTheme } from '../../Theme';
initializeTheme();

export const SecondPart: React.FunctionComponent = () => {

    return (
        <Stack>
            <Stack horizontal className="grayHeader smallPadding padding-left padding-right">
                <Stack grow={3} horizontal className="verticalPadding preAnalisisPadding">
                    <Icon iconName="DietPlanNotebook" />
                    <Label>Pre análisis</Label>
                </Stack>
                <Stack grow={3} horizontalAlign="end">
                    <Label>ROI Estimado por SKU</Label>
                    <Label>1.37</Label>
                </Stack>
                <Stack grow={3} horizontalAlign="end">
                    <Label>ROI Estimado Total</Label>
                    <Label>0.92</Label>
                </Stack>
                <Stack grow={3} horizontalAlign="end">
                    <Label>Efectividad</Label>
                    <div>
                        <span className="notEffectiveLabel">NO EFECTIVA</span>
                    </div>
                </Stack>
            </Stack>   
            <Stack horizontal className="grayContent padding padding-left padding-right">
                <Stack className="smallPadding padding-right controlPadding" grow={4}>
                    <Label htmlFor="estimatedIncrementalVolume">Volumen incremental Estimado</Label>
                    <TextField id="estimatedIncrementalVolume" placeholder="Ingrese el volumen estimado" />
                </Stack>
                <Stack className="smallPadding padding-right" grow={4}>
                    <Stack horizontal className="verticalPadding">
                        <Label>Total volumen estimado</Label>
                        <Label className="toRight">Valor</Label>                        
                    </Stack>
                    <Separator className="graySeparator separatorToTop"/>
                    <Stack horizontal className="verticalPadding">
                        <Label>NR Base</Label>
                        <Label className="toRight">Valor</Label>
                    </Stack>
                    <Separator className="graySeparator separatorToTop"/>
                    <Stack horizontal className="verticalPadding">
                        <Label>NR Incremental base estimado</Label>
                        <Label className="toRight">Valor</Label>
                    </Stack>
                    <Separator className="graySeparator separatorToTop"/>
                    <Stack horizontal className="verticalPadding">
                        <Label>GM promo estimado</Label>
                        <Label className="toRight">Valor</Label>
                    </Stack>
                    <Separator className="graySeparator separatorToTop"/>
                    <Stack horizontal className="verticalPadding">
                        <Label>Inversión estimada</Label>
                        <Label className="toRight">Valor</Label>
                    </Stack>
                    <Separator className="graySeparator separatorToTop"/>
                </Stack>
                <Stack className="smallPadding" grow={4}>
                    <Stack horizontal className="verticalPadding">
                        <Label>% volumen incremental</Label>
                        <Label className="toRight">Valor</Label>
                    </Stack>
                    <Separator className="graySeparator separatorToTop"/>
                    <Stack horizontal className="verticalPadding">
                        <Label>NR estimado</Label>
                        <Label className="toRight">Valor</Label>
                    </Stack>
                    <Separator className="graySeparator separatorToTop"/>
                    <Stack horizontal className="verticalPadding">
                        <Label>GM base</Label>
                        <Label className="toRight">Valor</Label>
                    </Stack>
                    <Separator className="graySeparator separatorToTop"/>
                    <Stack horizontal className="verticalPadding">
                        <Label>GM Incremental</Label>
                        <Label className="toRight">Valor</Label>
                    </Stack>
                    <Separator className="graySeparator separatorToTop"/>
                    <Stack horizontal className="verticalPadding">
                        <Label>Invesión adicional (MKT)</Label>
                        <Label className="toRight">Valor</Label>
                    </Stack>
                    <Separator className="graySeparator separatorToTop"/>
                </Stack>
            </Stack>            
        </Stack>
    );
};