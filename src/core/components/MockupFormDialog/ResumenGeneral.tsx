import { TestImages } from '@uifabric/example-data';
import { getTheme, Icon, IPersonaSharedProps, IStackStyles, Label, Persona, PersonaPresence, PersonaSize, Separator, Stack } from 'office-ui-fabric-react';
import * as React from 'react';

require('./MockupForm.css');

import { initializeTheme } from './Theme';
initializeTheme();
const theme = getTheme();

const repetitiveSectionStyle: IStackStyles = {
    root: {
        minHeight: 320,
    },
};

const verticalSeparatorStyle = {
    root:
        [{
            padding: '0px !important',
            marginBottom: '2px',
            selectors: {
                '::after': {
                    background: '#707070',
                    minHeight: '100%',
                    padding: '0px !important'
                }
            }
        }]
};

const examplePersona: IPersonaSharedProps = {
    imageUrl: TestImages.personaMale,
    imageInitials: 'JS',
    text: 'John Smith',
    secondaryText: 'Cabeza de Canal',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
};

const examplePersona2: IPersonaSharedProps = {
    imageUrl: TestImages.personaFemale,
    imageInitials: 'AL',
    text: 'Annie Lindqvist',
    secondaryText: 'Gerente KAM',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
};

export const ResumenGeneral: React.FunctionComponent = () => {
    return (
        <Stack styles={repetitiveSectionStyle}>

            <Stack className="statusContainer smallPadding padding-right" horizontal horizontalAlign="end">
                <Stack style={{ color: theme.palette.themePrimary, paddingRight: "4px" }}><Icon iconName="MapLayers" /></Stack>
                <Stack className="label">Estado:</Stack>
                <Stack style={{ color: theme.palette.themePrimary, fontWeight: "bold", marginTop: "1px" }}>Pendiente de aprobación</Stack>
            </Stack>

            <Stack horizontal className="padding">

                <Stack grow={8} verticalAlign="start">
                    <Stack className="grayContent padding padding-left padding-right">
                        <Stack horizontal className="verticalPadding">
                            <Label>Cliente</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack className="verticalPadding">
                            <Label>Objetivo de la promoción</Label>
                            <Label className="toRight">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                    </Stack>
                </Stack>

                <Stack grow={4} horizontal>
                    <Stack verticalFill>
                        <Separator vertical={true} styles={verticalSeparatorStyle}></Separator>
                    </Stack>
                    <Stack grow={12}>
                        <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                            <Label className="peopleLabel">Cabeza de canal</Label>
                            <Persona
                                {...examplePersona}
                                size={PersonaSize.size24}
                                presence={PersonaPresence.online}
                                hidePersonaDetails={false}
                                imageAlt="Annie Lindqvist, status is online"
                            />
                        </Stack>
                        <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                            <Label className="peopleLabel">Gerente KAM</Label>
                            <Persona
                                {...examplePersona2}
                                size={PersonaSize.size24}
                                presence={PersonaPresence.online}
                                hidePersonaDetails={false}
                                imageAlt="Annie Lindqvist, status is online"
                            />
                        </Stack>
                        <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                            <Label className="peopleLabel">Canal</Label>
                            <Label>Nombre de canal</Label>
                        </Stack>
                        <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                            <Label className="peopleLabel">Subcanal</Label>
                            <Label>Nombre de subcanal</Label>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>

            <Stack>
                <Stack horizontal className="grayHeader smallPadding padding-left padding-right">
                    <Stack grow={3} horizontal className="verticalPadding preAnalisisPadding">
                        <Icon iconName="DietPlanNotebook" />
                        <Label>Pre análisis MX1.1</Label>
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
                        <Stack horizontal className="verticalPadding">
                            <Label>Total volumen estimado</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                    </Stack>
                    <Stack className="smallPadding padding-right" grow={4}>

                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>NR Base</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>NR Incremental base estimado</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>GM promo estimado</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>Inversión estimada</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                    </Stack>
                    <Stack className="smallPadding" grow={4}>
                        <Stack horizontal className="verticalPadding">
                            <Label>% volumen incremental</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>NR estimado</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>GM base</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>GM Incremental</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>Invesión adicional (MKT)</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                    </Stack>
                </Stack>
            </Stack>

            <Stack>
                <Stack horizontal className="grayHeader smallPadding padding-left padding-right">
                    <Stack grow={3} horizontal className="verticalPadding preAnalisisPadding">
                        <Icon iconName="DietPlanNotebook" />
                        <Label>Pre análisis MX1.2</Label>
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
                        <Stack horizontal className="verticalPadding">
                            <Label>Total volumen estimado</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                    </Stack>
                    <Stack className="smallPadding padding-right" grow={4}>

                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>NR Base</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>NR Incremental base estimado</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>GM promo estimado</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>Inversión estimada</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                    </Stack>
                    <Stack className="smallPadding" grow={4}>
                        <Stack horizontal className="verticalPadding">
                            <Label>% volumen incremental</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>NR estimado</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>GM base</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>GM Incremental</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>Invesión adicional (MKT)</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                    </Stack>
                </Stack>
            </Stack>
        
            <Stack>
                <Stack horizontal className="grayHeader smallPadding padding-left padding-right">
                    <Stack grow={3} horizontal className="verticalPadding preAnalisisPadding">
                        <Icon iconName="DietPlanNotebook" />
                        <Label>Análisis general</Label>
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
                        <Stack horizontal className="verticalPadding">
                            <Label>Total volumen estimado</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                    </Stack>
                    <Stack className="smallPadding padding-right" grow={4}>

                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>NR Base</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>NR Incremental base estimado</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>GM promo estimado</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>Inversión estimada</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                    </Stack>
                    <Stack className="smallPadding" grow={4}>
                        <Stack horizontal className="verticalPadding">
                            <Label>% volumen incremental</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>NR estimado</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>GM base</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>GM Incremental</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                        <Stack horizontal className="verticalPadding">
                            <Label>Invesión adicional (MKT)</Label>
                            <Label className="toRight">Valor</Label>
                        </Stack>
                        <Separator className="graySeparator separatorToTop" />
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
};