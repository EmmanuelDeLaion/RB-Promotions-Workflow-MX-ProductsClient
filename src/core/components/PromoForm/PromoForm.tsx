import * as React from 'react';
import { IPromoFormProps, IPromoFormState } from '.';
import { PromoService } from '../../services/PromoService';
import {
    PrimaryButton,
    DefaultButton,
    TextField    
  } from 'office-ui-fabric-react';
import { Promo } from '../../model/Promo';

export class PromoForm extends React.Component<IPromoFormProps, IPromoFormState> {

    constructor(props: IPromoFormProps){
        super(props);
        this.state = {

        }
    }

    public render(): React.ReactElement<IPromoFormProps> {
        var output = 
            <div>
                <TextField 
                    label="Nombre: "
                />
            </div>

        PromoService.GetById(1).then((promo) => {
            console.log(promo);
        });        

        return output;
    }
}