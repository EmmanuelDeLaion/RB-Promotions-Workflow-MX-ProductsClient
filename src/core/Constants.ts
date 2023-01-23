import { IDatePickerStrings } from "office-ui-fabric-react";

export namespace Constants {
    export class StatusTexts{
        public static NewPromo = "Nueva promoción";
        public static DraftPromo = "Borrador";
        public static Approval = "Aprobación";
        public static Approved = "Aprobada";
        public static Rejected = "Rechazada";
        public static Proven = "Comprobada";
    } 
    
    export class Messages {
        public static NotAllowedAction = "Esta acción no está permitida debido al estado actual de la promoción";
        public static RequiredField:string = "Este campo es requerido.";
    }

    export class Groups {
        public static ReadOnlyBaseGroupName = "RB - Solo consulta";
        public static KAMsBaseGroupName = "RB - KAMs";
    }

    export class Miscellaneous{
        public static DayPickerStrings: IDatePickerStrings = {
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
          
            days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
          
            shortDays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
          
            goToToday: 'Ir a hoy',
            prevMonthAriaLabel: 'Ir al mes anterior',
            nextMonthAriaLabel: 'Ir al mes siguiente',
            prevYearAriaLabel: 'Ir al año anterior',
            nextYearAriaLabel: 'Ir al año siguiente',
            closeButtonAriaLabel: 'Cerrar',

            isRequiredErrorMessage: 'Este campo es requerido.',

            invalidInputErrorMessage: 'Formato de fecha inválido.'
        };

        public static ClearSelectionText = "--- Borrar selección ---";        
    }
}