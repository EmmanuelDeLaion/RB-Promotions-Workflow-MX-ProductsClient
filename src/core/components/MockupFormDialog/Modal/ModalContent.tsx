import * as React from 'react';
import { useState } from 'react';
import { FirstPart } from './Content/FirstPart';
import { SecondPart } from './Content/SecondPart';
import { useId, useBoolean } from '@uifabric/react-hooks';

import {
  Modal,
  Toggle,
  DefaultButton,
  PrimaryButton,
  Stack,
  DefaultPalette,
  IStackStyles,
  Separator,
  Text,
  Link,
  FontWeights,
  DialogFooter,
  Dialog,
  DialogType,
} from 'office-ui-fabric-react';


import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence, ComboBox, IComboBox, IComboBoxOption, SelectableOptionMenuItemType } from 'office-ui-fabric-react/lib/index';
import { FontSizes } from '@fluentui/theme';
import { SharedColors } from '@fluentui/theme';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Label, ILabelStyles } from 'office-ui-fabric-react/lib/Label';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
/*import { Pivot, PivotItem, PivotLinkFormat } from 'office-ui-fabric-react/lib/Pivot';
*/
import { ThemeProvider, Pivot, PivotItem, PivotLinkSize, IPivotItemProps, IPivotStyleProps, IPivotStyles } from "@fluentui/react-tabs";

import { AnimationVariables, IStyleSet } from 'office-ui-fabric-react/lib/Styling';
import { TestImages } from '@uifabric/example-data';

import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';

function _alertClicked(): void {
  alert('Clicked');
}

const magenta = SharedColors.magentaPink10;
const lightMagenta = "#fde7e9";

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
  root: { marginTop: 10 },
};

const controlClass = mergeStyleSets({
  control: {
    margin: '0 0 15px 0',
    maxWidth: '300px',
  },
});

const repetitiveSectionStyle: IStackStyles = {
  root: {
    minHeight: 320,
  },
};

const clientsOptions: IComboBoxOption[] = [
  { key: 'A', text: 'Cliente 1' },
  { key: 'B', text: 'Cliente 2' },
  { key: 'C', text: 'Cliente 3' }
];

const channelOptions: IComboBoxOption[] = [
  { key: 'A', text: 'Canal 1' },
  { key: 'B', text: 'Canal 2' },
  { key: 'C', text: 'Canal 3' }
];

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


export const ModalContent: React.FunctionComponent = () => {

  const [errorMessage, setState] = useState("");
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const labelId: string = useId('dialogLabel');
  const subTextId: string = useId('subTextLabel');
  const dialogStyles = { main: { maxWidth: '450px' } };
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Eliminar producto',
    closeButtonAriaLabel: 'Cerrar',
    subText: 'Esta seguro que desea eliminar este producto de la promoción?',
  };

  const modalProps = React.useMemo(
    () => ({
      titleAriaId: labelId,
      subtitleAriaId: subTextId,
      isBlocking: false,
      styles: dialogStyles,
      dragOptions: undefined,
    }),
    [labelId, subTextId],
  );

  function _validationsTriggerClicked(): void {
    if (errorMessage == "")
      setState("Este campo es requerido");
    else
      setState("");
  }

  return (

    <Stack className="mainPdding">
      <Pivot aria-label="Main Pivot" className="mainPivot" overflowBehavior="menu">
        <PivotItem onRenderItemLink={_customPromotionPivotItemRenderer}>
          <Stack styles={repetitiveSectionStyle}>
            <Stack className="statusContainer smallPadding padding-right" horizontal horizontalAlign="end">
              <Stack style={{ color: magenta, paddingRight: "4px" }}><Icon iconName="MapLayers" /></Stack>
              <Stack className="label">Estado:</Stack>
              <Stack style={{ color: magenta, fontWeight: "bold", marginTop: "1px" }}>Pendiente de aprobación</Stack>
            </Stack>
            {/* Promotion section */}
            <Stack horizontal className="padding">

              <Stack grow={8} verticalAlign="start">
                <Stack grow={12} horizontal className="smallPadding">
                  <Stack grow={6} className="padding-right controlPadding">
                    <TextField
                      id="promoName"
                      label="Nombre de la promoción"
                      placeholder="Ingrese el nombre de la promoción"
                      required
                      errorMessage={errorMessage} />
                  </Stack>
                  <Stack grow={6} className="padding-right controlPadding">
                    <div>
                      <ComboBox
                        label="Cliente"
                        allowFreeform
                        autoComplete="on"
                        options={clientsOptions}
                        placeholder="Seleccione un cliente"
                        required
                        errorMessage={errorMessage} />
                    </div>
                  </Stack>
                </Stack >
                <Stack grow={12} className="padding-right multilineControlPadding">
                  <TextField
                    id="activityObjective"
                    label="Objetivo de la actividad"
                    placeholder="Ingrese el objetivo"
                    required
                    errorMessage={errorMessage}
                    multiline
                    rows={3} />
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
                      onClick={_validationsTriggerClicked}
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

            {/* Repetitive section */}
            <Stack>
              <Pivot className="innerPivot" aria-label="Inner Pivot" overflowBehavior="menu">
                <PivotItem
                  headerText="MX1.1"
                  headerButtonProps={{
                    'data-order': 1,
                    'data-title': 'MX1.1',
                  }}>
                  <Stack className="deleteProductContainer" horizontal horizontalAlign="end">
                    <Stack className="label">
                      <Link onClick={toggleHideDialog}><Icon iconName="MapLayers" /><span style={{ color: '#323130' }}>Borrar producto</span></Link>
                    </Stack>

                    <Dialog
                      hidden={hideDialog}
                      onDismiss={toggleHideDialog}
                      dialogContentProps={dialogContentProps}
                      modalProps={modalProps}
                    >
                      <DialogFooter>
                        <PrimaryButton onClick={toggleHideDialog} text="Eliminar" />
                        <DefaultButton onClick={toggleHideDialog} text="Cancelar" />
                      </DialogFooter>
                    </Dialog>

                  </Stack>
                  <FirstPart />
                  <SecondPart />
                </PivotItem>
                <PivotItem headerText="MX1.2">
                  <Stack styles={repetitiveSectionStyle}>
                    <Label styles={labelStyles}>MX1.2</Label>
                  </Stack>
                </PivotItem>
                <PivotItem headerText="MX1.3">
                  <Stack styles={repetitiveSectionStyle}>
                    <Label styles={labelStyles}>MX1.3</Label>
                  </Stack>
                </PivotItem>
                <PivotItem headerText="Nuevo" itemIcon="Add">
                  <Stack styles={repetitiveSectionStyle}>
                    <Label styles={labelStyles}>Nuevo</Label>
                  </Stack>
                </PivotItem>
              </Pivot>
            </Stack>
          </Stack>
        </PivotItem>
        <PivotItem onRenderItemLink={_customPromotionSummaryPivotItemRenderer}>
          <Stack className="summarySectionContainer">
            Resumen General
          </Stack>
        </PivotItem>
      </Pivot>
    </Stack >
  );
};

function _customPromotionPivotItemRenderer(link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element): JSX.Element {
  return (
    <Stack horizontal>
      {defaultRenderer(link)}
      <Label style={{ color: magenta }}><Icon iconName="DietPlanNotebook" /></Label>
      <Label>ID Promoción&nbsp;:&nbsp;</Label>
      <Label style={{ color: magenta, fontWeight: "bold" }}>MX-9999</Label>
    </Stack>
  );
}

function _customPromotionSummaryPivotItemRenderer(link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element): JSX.Element {
  return (
    <Stack horizontal>
      {defaultRenderer(link)}
      <Label style={{ color: magenta }}><Icon iconName="DietPlanNotebook" /></Label>
      <Label>Resumen General</Label>
    </Stack>
  );
}