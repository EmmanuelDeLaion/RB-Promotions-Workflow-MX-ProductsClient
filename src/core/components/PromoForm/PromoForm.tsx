import * as React from 'react';
import { IPromoFormProps, IPromoFormState, PromoFormResult } from '.';
import { PromoService } from '../../services/PromoService';
import {
    PrimaryButton,
    DefaultButton,
    TextField,    
    DialogContent,
    Shimmer,
    IShimmerStyleProps,
    IShimmerStyles,
    DialogFooter,
    Dropdown,
    IDropdownOption
  } from 'office-ui-fabric-react';
import { Promo } from '../../model/Promo/Promo';
import styles from './PromoForm.module.scss';
import { Client } from '../../model/Common';
import { ClientRepository } from '../../data';

export class PromoForm extends React.Component<IPromoFormProps, IPromoFormState> {    

    constructor(props: IPromoFormProps) {
        super(props);
        this.state = {
            isLoading: true,
            hasValidationError: false,
            enableSubmit: false,
            formSubmitted: false,
            resultIsOK: false
        };
    }

    public componentDidMount() {
        PromoService.GetViewModel(this.props.itemId).then((viewModel) => {
            this.setState({
                isLoading: false,
                enableSubmit: true,
                viewModel: viewModel
            });
        }).catch((err) => {
            console.error(err);
            this.setState({ formSubmitted: true, isLoading: false, errorMessage: err});
        });
    }

    public render(): React.ReactElement<IPromoFormProps> {
        const entity = this.state.viewModel ? this.state.viewModel.Entity : null;
        const client = entity ? entity.Client : null;
        const channel = client ? client.Channel : null;
        const headOfChannel = channel ? channel.HeadOfChannel : null;
        const kam = client ? client.KeyAccountManager : null;
        const subchannel = client ? client.Subchannel : null;

        var output = 
            <DialogContent
                title={this.props.title}
                subText="Cargando formulario..."
                onDismiss={this.props.close}
                showCloseButton={true}>
                <div className={styles.promoForm}>
                    <Shimmer
                        width="100%"
                        styles={this._getShimmerStyles}
                    />
                </div>
            </DialogContent>;

        if (!this.state.isLoading && !this.state.formSubmitted) {
            const clients: Array<{ key: number, text: string }> =
                this.state.viewModel.Clients != null ?
                    (this.state.viewModel.Clients as Array<Client>).map((item): { key: number, text: string } => {
                        return { key: item.ItemId, text: item.Name };
                    }) : [];

            output =
                <DialogContent
                title={this.props.title}
                onDismiss={this.props.close}
                showCloseButton={true}>
                    <div className={styles.promoForm}>
                        <table style={{width:'100%'}}>
                            <tr>
                                <td style={{width:'100px'}}></td>
                                <td style={{width:'100px'}}></td>
                                <td style={{width:'100px'}}></td>
                                <td style={{width:'100px'}}></td>
                                <td style={{width:'100px'}}></td>
                                <td style={{width:'100px'}}></td>                                
                            </tr>
                            <tr>
                                <td colSpan={1}>
                                    <TextField 
                                        label="Promo ID:"
                                        readOnly={true}
                                        defaultValue={entity.PromoID || "--"}
                                    />
                                </td>
                                <td colSpan={3}>&nbsp;</td>
                                <td colSpan={2}>
                                    <TextField 
                                        label="Estado:"
                                        readOnly={true}
                                        defaultValue={entity.GetStatusText()}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={6}>
                                    <TextField 
                                        label="Nombre:" 
                                        required={true} 
                                        autoComplete='off'
                                        onChanged={this.onNameChanged.bind(this)}
                                        defaultValue={entity.Name}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={6}>
                                    <TextField 
                                        label="Objetivo de la actividad:" 
                                        required={true} 
                                        multiline={true}
                                        onChanged={this.onActivityObjectiveChanged.bind(this)}
                                        defaultValue={entity.ActivityObjective}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <Dropdown
                                        placeholder="Seleccione un cliente"
                                        label="Cliente:"
                                        options={clients}
                                        selectedKey={entity.Client ? entity.Client.ItemId : null}
                                        onChanged={this.onClientChanged.bind(this)}
                                        required={true}
                                    />
                                </td>
                                <td colSpan={3}></td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <TextField 
                                        label="Cabeza de canal:" 
                                        defaultValue={headOfChannel ? headOfChannel.Value : null}
                                        readOnly={true}
                                    />
                                </td>
                                <td colSpan={3}>
                                    <TextField 
                                        label="Gerente/Kam (LP):" 
                                        defaultValue={kam ? kam.Value : null}
                                        readOnly={true}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <TextField 
                                        label="Canal (LP):" 
                                        defaultValue={channel ? channel.Name : null}
                                        readOnly={true}
                                    />
                                </td>
                                <td colSpan={3}>
                                    <TextField 
                                        label="SubCanal:"
                                        defaultValue={subchannel ? subchannel.Value : null} 
                                        readOnly={true}
                                    />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <DialogFooter>
                        <PrimaryButton 
                            text="Guardar"
                            title="Guardar cambios"
                            onClick={this.submit.bind(this)} 
                            disabled={!this.state.enableSubmit}  />
                        <DefaultButton 
                            text="Cancelar"
                            title="Cancelar"
                            onClick={this.props.close} />
                    </DialogFooter>
                </DialogContent>;
        }

        if (this.state.formSubmitted) {
            output = 
            <PromoFormResult 
                title={this.props.title}
                close={this.props.close} 
                message={this.state.resultIsOK ? 'La operación se completó correctamente.' : 'Error al ejecutar la operación: ' + this.state.errorMessage}
                isSuccess={this.state.resultIsOK} />;
        }

        return output;  
    }

    private onNameChanged(text: any) {
        this.setState((prevState) => {
          prevState.viewModel.Entity.Name = text;    
          return prevState;
        });
    }

    private onActivityObjectiveChanged(text: any) {
        this.setState((state) => {
          state.viewModel.Entity.ActivityObjective = text;    
          return state;
        });
    }

    private onClientChanged(item: IDropdownOption) {
        const clientId = item.key as number;

        this.setState((state) => {
            state.viewModel.Entity.Client = new Client({ ItemId: clientId });
            return state;
        });

        ClientRepository.GetById(clientId).then((client) => {
            this.setState((state) => {
                state.viewModel.Entity.Client = client;
                return state;
            });
        });
    }

    private submit() {
        PromoService.Save(this.state.viewModel.Entity).then(() => {
            this.setState({
                formSubmitted: true,
                resultIsOK: true
            });
        }).catch((err) => {
            console.error(err);
            this.setState({ formSubmitted: true, errorMessage: err});
        });
    }

    private _getShimmerStyles = (props: IShimmerStyleProps): IShimmerStyles => {
        return {
          shimmerWrapper: [
            {
              backgroundColor: '#deecf9',
              backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, #c7e0f4 50%, rgba(255, 255, 255, 0) 100%)'
            }
          ]
        };
      }
}