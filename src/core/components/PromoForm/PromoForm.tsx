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
    IDropdownOption,
    Toggle,
    DayOfWeek,
    DatePicker
  } from 'office-ui-fabric-react';
import { Promo } from '../../model/Promo/Promo';
import styles from './PromoForm.module.scss';
import { Category, Client, Product, Type } from '../../model/Common';
import { ClientRepository } from '../../data';
import { PromoItem } from '../../model/Promo';
import { Constants } from '../../Constants';
require('../PromoForm/PromoForm.overrides.scss');

export class PromoForm extends React.Component<IPromoFormProps, IPromoFormState> {    

    constructor(props: IPromoFormProps) {
        super(props);
        this.state = {
            isLoading: true,
            hasValidationError: false,
            enableSubmit: false,
            formSubmitted: false,
            resultIsOK: false,
            selectedIndex: 0,
            loadingTypes: false
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
        const selectedItem = entity ? entity.Items[this.state.selectedIndex] : null;

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

            const categories: Array<{ key: number, text: string }> =
                this.state.viewModel.Categories != null ?
                    (this.state.viewModel.Categories as Array<Client>).map((item): { key: number, text: string } => {
                        return { key: item.ItemId, text: item.Name };
                    }) : [];
                        
            const types: Array<{ key: number, text: string }> =
                this.state.viewModel.Types != null ?
                    (this.state.viewModel.Types as Array<Client>).map((item): { key: number, text: string } => {
                        return { key: item.ItemId, text: item.Name };
                    }) : [];

            const products: Array<{ key: number, text: string }> =
                this.state.viewModel.Products != null ?
                    (this.state.viewModel.Products as Array<Product>).map((item): { key: number, text: string } => {
                        return { key: item.ItemId, text: item.SKUNumber + ' - ' + item.SKUDescription };
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
                                        value={entity.PromoID}
                                    />
                                </td>
                                <td colSpan={3}>&nbsp;</td>
                                <td colSpan={2}>
                                    <TextField 
                                        label="Estado:"
                                        readOnly={true}
                                        value={entity.GetStatusText()}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={6}>
                                    <TextField 
                                        label="Objetivo de la actividad:" 
                                        required={true} 
                                        multiline={false}
                                        onChanged={this.onActivityObjectiveChanged.bind(this)}
                                        value={entity.ActivityObjective} 
                                        autoComplete="Off"
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
                                        value={headOfChannel ? headOfChannel.Value : null}
                                        readOnly={true}
                                    />
                                </td>
                                <td colSpan={3}>
                                    <TextField 
                                        label="Gerente/Kam (LP):" 
                                        value={kam ? kam.Value : null}
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
                        <ul style={{paddingLeft:'5px', marginBottom: '0px'}}>
                            {entity.Items.map((item, index) => { return (
                                <li style={{display:'inline', minWidth: '50px', fontWeight: index == this.state.selectedIndex ? 'bold' : 'inherit'}}>
                                    <a onClick={this.changeSelectedItem.bind(this, index)} style={{cursor: 'pointer'}}>{item.AdditionalID} | </a>
                                </li>
                            );})}
                            <li style={{display:'inline', minWidth: '50px'}}>
                                <a onClick={this.AddPromoItem.bind(this)} style={{cursor: 'pointer'}}> + | </a>
                            </li>
                            <li style={{display: entity.Items.length > 1 ? 'inline' : 'none', minWidth: '50px'}}>
                                <a onClick={this.RemovePromoItem.bind(this)} style={{cursor: 'pointer'}}> - | </a>
                            </li>
                        </ul>
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
                                <td colSpan={6}>
                                    <TextField 
                                        label="Descripción corta:"
                                        onChanged={this.onShortDescriptionChanged.bind(this)}
                                        value={selectedItem ? selectedItem.ShortDescription : null} 
                                        required={true}
                                        autoComplete="Off"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <Dropdown
                                        placeholder="Seleccione una categoría"
                                        label="Categoria de la Promoción (LD):"
                                        options={categories}
                                        selectedKey={selectedItem.Category ? selectedItem.Category.ItemId : null}
                                        onChanged={this.onCategoryChanged.bind(this)}
                                        required={true}
                                    />
                                </td>
                                <td colSpan={3}>
                                    <TextField 
                                        label="Inversión ($):"
                                        onChanged={this.onInvestmentChanged.bind(this)}
                                        value={selectedItem ? selectedItem.InvestmentAsString() : null} 
                                        required={true}
                                        autoComplete="Off"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <Dropdown
                                        placeholder="Seleccione una tipo"
                                        label="Tipo de Promocion (LD):"
                                        options={types}
                                        disabled={this.state.loadingTypes || types.length === 0}
                                        selectedKey={selectedItem.Type ? selectedItem.Type.ItemId : null}
                                        onChanged={this.onTypeChanged.bind(this)}
                                        required={true}
                                    />
                                </td>
                                <td colSpan={2}>&nbsp;</td>
                                <td colSpan={1}>
                                    <Toggle 
                                        label="Actividad topada" 
                                        onText="Si" 
                                        offText="No" 
                                        onChange={this.onCappedActivityChanged.bind(this)} 
                                        checked={selectedItem.CappedActivity}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <TextField 
                                        label="BU:"
                                        value={selectedItem.Product ? selectedItem.Product.BusinessUnit : null}
                                        readOnly={true}
                                    />
                                </td>
                                <td colSpan={3}>
                                    <TextField 
                                        label="Marca:"
                                        value={selectedItem.Product ? selectedItem.Product.Brand : null}
                                        readOnly={true}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <Dropdown
                                        placeholder="Seleccione un producto"
                                        label="SKU:"
                                        options={products}
                                        selectedKey={selectedItem.Product ? selectedItem.Product.ItemId : null}
                                        onChanged={this.onProductChanged.bind(this)}
                                        required={true}
                                    />
                                </td>
                                <td colSpan={3}>
                                    <TextField 
                                        label="Categoria:"
                                        value={selectedItem.Product ? selectedItem.Product.Category : null}
                                        readOnly={true}
                                    />
                                </td>
                            </tr>
                            <tr style={{display:"none"}}>
                                <td colSpan={3}>
                                    <DatePicker
                                        label="Fecha comienzo"
                                        firstDayOfWeek={DayOfWeek.Sunday}
                                        strings={Constants.Miscellaneous.DayPickerStrings}
                                        placeholder="Seleccione una fecha..."
                                        ariaLabel="Seleccione una fecha"
                                        value={selectedItem.StartDate!}
                                        onSelectDate={this.onSelectStartDate.bind(this)}                                      
                                    />
                                </td>
                                <td colSpan={3}>
                                    <DatePicker
                                        label="Fecha fin"
                                        firstDayOfWeek={DayOfWeek.Sunday}
                                        strings={Constants.Miscellaneous.DayPickerStrings}
                                        placeholder="Seleccione una fecha..."
                                        ariaLabel="Seleccione una fecha"
                                        value={selectedItem.EndDate!}
                                        onSelectDate={this.onSelectEndDate.bind(this)}
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

    //#region Header events

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

    //#endregion

    private AddPromoItem() {
        let items = this.state.viewModel.Entity.Items;
        const index = items.length + 1;
        
        items.push(new PromoItem({AdditionalID: this.state.viewModel.Entity.PromoID + "." + index}));

        this.setState((state) => {
            let newState = state as IPromoFormState;
            newState.viewModel.Entity.Items = items;
            newState.selectedIndex = items.length - 1;
            return newState;
        });        
    }

    private RemovePromoItem() {
        let items = this.state.viewModel.Entity.Items;

        items.splice(-1,1);

        this.setState((state) => {
            let newState = state as IPromoFormState;
            newState.viewModel.Entity.Items = items;
            newState.selectedIndex = 0;
            return newState;
        });        
    }

    private changeSelectedItem(index: number) {
        this.setState({
            selectedIndex: index,
            loadingTypes: true
        });

        const category = this.state.viewModel.Entity.Items[index].Category;
        if(category != null)    {
            PromoService.GetTypesByCategory(category.ItemId).then((types: Type[]) => {
                this.setState({loadingTypes: false});
                this.setState((state) => {
                    state.viewModel.Types = types;
                    return state;
                });            
            });
        }
    }

    private onShortDescriptionChanged(text: any) {
        this.setState((state) => {
            state.viewModel.Entity.Items[this.state.selectedIndex].ShortDescription = text;    
            return state;
        });
    }

    private onCategoryChanged(item: IDropdownOption) {
        const category = this.state.viewModel.Categories.filter(x => x.ItemId === item.key as number)[0];

        this.setState({loadingTypes: true});
        this.setState((state) => {            
            state.viewModel.Entity.Items[this.state.selectedIndex].Category = category;
            state.viewModel.Entity.Items[this.state.selectedIndex].Type = null;
            return state;
        });

        PromoService.GetTypesByCategory(category.ItemId).then((types: Type[]) => {
            this.setState({loadingTypes: false});
            this.setState((state) => {
                state.viewModel.Types = types;
                return state;
            });            
        });        
    }

    private onInvestmentChanged(text: any) {
        this.setState((state) => {
            state.viewModel.Entity.Items[this.state.selectedIndex].Investment = !isNaN(parseInt(text)) ? parseInt(text) : null;    
            return state;
        });
    }

    private onTypeChanged(item: IDropdownOption) {        
        const type = this.state.viewModel.Types.filter(x => x.ItemId === item.key as number)[0];

        this.setState((state) => {            
            state.viewModel.Entity.Items[this.state.selectedIndex].Type = type;
            return state;
        });
    }

    private onCappedActivityChanged(ev: React.MouseEvent<HTMLElement>, checked: boolean) {
        this.setState((state) => {            
            state.viewModel.Entity.Items[this.state.selectedIndex].CappedActivity = checked;
            return state;
        });
    }

    private onProductChanged(item: IDropdownOption) {        
        const product = this.state.viewModel.Products.filter(x => x.ItemId === item.key as number)[0];

        this.setState((state) => {            
            state.viewModel.Entity.Items[this.state.selectedIndex].Product = product;
            return state;
        });
    }

    private onSelectStartDate (date: Date | null | undefined): void {
        console.log(date);
        this.setState((state) => {            
            state.viewModel.Entity.Items[this.state.selectedIndex].StartDate = date;
            return state;
        });
    };

    private onSelectEndDate (date: Date | null | undefined): void {
        console.log(date);
        this.setState((state) => {            
            state.viewModel.Entity.Items[this.state.selectedIndex].EndDate = date;
            return state;
        });
    };

    private submit() {
        console.log(this.state.viewModel.Entity);

        this.setState({
        enableSubmit:false
        });

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