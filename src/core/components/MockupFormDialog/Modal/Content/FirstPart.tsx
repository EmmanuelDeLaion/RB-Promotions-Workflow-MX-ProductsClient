import { ComboBox, DatePicker, DayOfWeek, IComboBoxOption, Icon, IDatePickerStrings, IStackStyles, Label, mergeStyleSets, SelectableOptionMenuItemType, Separator, Stack, TextField, Toggle } from 'office-ui-fabric-react';
import * as React from 'react';
import { useState } from 'react';
import { initializeTheme } from '../../Theme';
initializeTheme();

const DayPickerStrings: IDatePickerStrings = {
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],

  shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],

  days: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],

  shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

  goToToday: 'Ir a hoy',
  prevMonthAriaLabel: 'Ir a mes anterior',
  nextMonthAriaLabel: 'Ir a siguiente mes',
  prevYearAriaLabel: 'Ir a año anterior',
  nextYearAriaLabel: 'Ir a siguiente año',
  closeButtonAriaLabel: 'Cerrar selector de fecha',
  monthPickerHeaderAriaLabel: '{0}, seleccione para cambiar el año',
  yearPickerHeaderAriaLabel: '{0}, seleccione para cambiar el mes',
  isRequiredErrorMessage: 'Este campo es requerido',
  invalidInputErrorMessage: 'Formato invalido',
};

const firstDayOfWeek = DayOfWeek.Sunday;

const repetitiveSectionStyle: IStackStyles = {
  root: {
    minHeight: 320,
  },
};

const promotionCategoryOptions: IComboBoxOption[] = [
  { key: 'A', text: 'Categoría de promoción 1' },
  { key: 'B', text: 'Categoría de promoción  2' },
  { key: 'C', text: 'Categoría de promoción  3' },
];
  
const promotionTypesOptions: IComboBoxOption[] = [
  { key: 'A', text: 'Tipo de promoción 1' },
  { key: 'B', text: 'Tipo de promoción 2' },
  { key: 'C', text: 'Tipo de promoción 3' },
];

const brandOptions: IComboBoxOption[] = [
  { key: 'A', text: 'Marca 1' },
  { key: 'B', text: 'Marca 2' },
  { key: 'C', text: 'Marca 3' },
];

const investmentOptions: IComboBoxOption[] = [
  { key: 'A', text: 'Inversión 1' },
  { key: 'B', text: 'Inversión 2' },
  { key: 'C', text: 'Inversión 3' },
];

const categoryOptions: IComboBoxOption[] = [
  { key: 'A', text: 'Categoría 1' },
  { key: 'B', text: 'Categoría 2' },
  { key: 'C', text: 'Categoría 3' },
];

const verticalSeparatorStyle = {
  root:
    [{
      padding: '0px !important',
      selectors: {
        '::after': {
          background: '#707070',
          minHeight: '100%',
          padding: '0px !important'
        }
      }
    }]
};
export const FirstPart: React.FunctionComponent = () => {

  const [errorMessage, setState] = useState("");

  function _validationsTriggerClicked(): void {
    if(errorMessage == "")
      setState("Este campo es requerido");
    else
      setState("");
  }

  return (
    <Stack horizontal styles={repetitiveSectionStyle} className="padding">
      <Stack grow={8}>
        <Stack styles={{root: {maxHeight: "30px"}}} className="smallPadding padding-right" grow={6}>
          <Stack horizontal className="actividadTopadaContainer smallPadding-left">
            <Stack>
              <Label>Actividad Topada</Label>
            </Stack>
            <Stack className="toRight smallPadding actividadTopadaToggle">
              <Toggle onText="Si" offText="No" />
            </Stack>
          </Stack>
        </Stack>
        <Stack horizontal grow={12} styles={{root: {paddingTop: "16px"}}}>
          <Stack className="smallPadding" grow={6}>
            <Stack className="padding-right controlPadding">
              <ComboBox
                label="Categoría de la promoción"
                allowFreeform
                autoComplete="on"
                options={promotionCategoryOptions}
                placeholder="Seleccion la categoría" 
                required
                errorMessage={errorMessage}/>
            </Stack>
            <Stack className="padding-right controlPadding">
              <ComboBox
                label="Tipo de la promoción"
                allowFreeform
                autoComplete="on"
                options={promotionTypesOptions}
                placeholder="Seleccione el tipo"
                required
                errorMessage={errorMessage}/>
            </Stack>
            <Stack className="padding-right controlPadding">
              <TextField 
                id="bu"
                placeholder="Ingrese la unidad de negocios"
                label="BU" 
                required
                errorMessage={errorMessage}/>
            </Stack>
            <Stack className="padding-right controlPadding">
              <TextField 
                id="sku"
                placeholder="Ingrese el SKU"
                label="SKU" 
                required
                errorMessage={errorMessage}/>
            </Stack>
            <Stack className="padding-right controlPadding">
              <DatePicker
                label="Fecha de inicio"
                firstDayOfWeek={firstDayOfWeek}
                strings={DayPickerStrings}
                placeholder="Seleccione una fecha..."
                ariaLabel="Seleccione una fecha"
                isRequired={true}
              />
            </Stack>
            <Stack className="padding-right controlPadding">
              <TextField 
                id="discaoutPerUnit"
                placeholder="Ingrese el descuento por pieza"
                label="Descuento por pieza" 
                required
                errorMessage={errorMessage}/>
            </Stack>
          </Stack>
          <Stack className="smallPadding" grow={6}>
            <Stack className="padding-right controlPadding">
              <ComboBox
                label="Inversión"
                allowFreeform
                autoComplete="on"
                options={investmentOptions}
                placeholder="Ingrese una inversión"
                required 
                errorMessage={errorMessage}/>
            </Stack>
            <Stack className="padding-right controlPadding">
              <TextField 
                id="shortDescription" 
                label="Descripción corta"
                placeholder="Ingrese una descripción" 
                required
                errorMessage={errorMessage}/>
            </Stack>
            <Stack className="padding-right controlPadding">
              <ComboBox
                label="Marca"
                allowFreeform
                autoComplete="on"
                options={brandOptions}
                placeholder="Ingrese una marca"
                required
                errorMessage={errorMessage}/>
            </Stack>
            <Stack className="padding-right controlPadding">
              <ComboBox
                label="Categoría"
                allowFreeform
                autoComplete="on"
                options={categoryOptions}
                placeholder="Ingrese una categoría"
                required
                errorMessage={errorMessage}/>
            </Stack>
            <Stack className="padding-right controlPadding">
              <DatePicker
                label="Fecha de finalización"
                firstDayOfWeek={firstDayOfWeek}
                strings={DayPickerStrings}
                placeholder="Seleccione una fecha..."
                ariaLabel="Seleccione una fecha"
                isRequired={true}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack grow={4}>
        <Stack className="smallPadding" grow={4} horizontal>
          <Separator vertical={true} styles={verticalSeparatorStyle}></Separator>
          <Stack grow={12}>
            <Stack horizontal className="grayHeader padding padding-left padding-right" 
              onClick={_validationsTriggerClicked}>
              <Icon iconName="DietPlanNotebook" />
              <Label>Detalles de la promoción</Label>
            </Stack>
            <Stack className="grayContent smallPadding padding-left padding-right" verticalFill>
              <Stack horizontal className="verticalPadding" verticalFill verticalAlign="center">
                <Label>BEP NR</Label>
                <Label className="toRight">Valor</Label>
              </Stack>
              <Separator className="graySeparator separatorToTop" />
              <Stack horizontal className="verticalPadding" verticalFill verticalAlign="center">
                <Label>COS</Label>
                <Label className="toRight">Valor</Label>
              </Stack>
              <Separator className="graySeparator separatorToTop" />
              <Stack horizontal className="verticalPadding" verticalFill verticalAlign="center">
                <Label>GM %NR</Label>
                <Label className="toRight">Valor</Label>
              </Stack>
              <Separator className="graySeparator separatorToTop" />
              <Stack horizontal className="verticalPadding" verticalFill verticalAlign="center">
                <Label>GM NR con promo</Label>
                <Label className="toRight">Valor</Label>
              </Stack>
              <Separator className="graySeparator separatorToTop" />
              <Stack horizontal className="verticalPadding" verticalFill verticalAlign="center">
                <Label>GM Base Unit</Label>
                <Label className="toRight">Valor</Label>
              </Stack>
              <Separator className="graySeparator separatorToTop" />
              <Stack horizontal className="verticalPadding" verticalFill verticalAlign="center">
                <Label>GM Promo Unit</Label>
                <Label className="toRight">Valor</Label>
              </Stack>
              <Separator className="graySeparator separatorToTop" />
              <Stack horizontal className="verticalPadding" verticalFill verticalAlign="center">
                <Label>BEP GM</Label>
                <Label className="toRight">Valor</Label>
              </Stack>
              <Separator className="graySeparator separatorToTop" />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};