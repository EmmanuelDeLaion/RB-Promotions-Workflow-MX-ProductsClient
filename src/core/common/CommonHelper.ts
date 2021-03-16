import { FieldCustomizerContext } from '@microsoft/sp-listview-extensibility';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp';
import '../GlobalVariables';

export class CommonHelper {
    public static EmptyString: string = "";

    public static IsNullOrEmpty(value: string): boolean {
        return value == null || value == "";
    }

    public static IsArray(v: any): v is Array<any> {
        return v.length != undefined;
    }

    public static IsDate(v: any): v is Date {
        return v != null && typeof v.getDate === "function";
    }

    public static getParameterByName(name: string, url:string = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&').toLocaleLowerCase();
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url.toLocaleLowerCase());
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    public static formatDate (date?: Date): string {
        return !date ? '' : ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + (date.getFullYear());
    }

    public static replaceAll(str: string, searchValue: string, replaceValue: string): string{
        var regex = new RegExp(searchValue, 'g');
        
        return str.replace(regex, replaceValue);
    }

    public static ensurePnPJs(context: WebPartContext | FieldCustomizerContext) {
        if(!_spInitialized) {
            console.log("PNP initialized...");
            sp.setup({
                spfxContext: context
            });
            _spInitialized = true;
        }
    }
}