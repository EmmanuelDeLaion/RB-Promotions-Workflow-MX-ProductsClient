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
    DatePicker,
    Label
  } from 'office-ui-fabric-react';
import { Promo } from '../../model/Promo/Promo';
import styles from './PromoForm.module.scss';
import { Category, Client, Product, Type } from '../../model/Common';
import { ClientRepository } from '../../data';
import { PromoItem } from '../../model/Promo';
import { Constants } from '../../Constants';
import { LookupValue } from '../../infrastructure';
import { ProductSelector } from '../ProductSelector/ProductSelector';
import { CommonHelper } from '../../common/CommonHelper';
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
            loadingTypes: false,
            filteredProducts: []
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

            //#region Collections

            const clients: Array<{ key: number, text: string }> =
                this.state.viewModel.Clients != null ?
                    (this.state.viewModel.Clients as Array<Client>).map((item): { key: number, text: string } => {
                        return { key: item.ItemId, text: item.Name };
                    }) : [];

            const categories: Array<{ key: number, text: string }> =
                this.state.viewModel.Categories != null ?
                    (this.state.viewModel.Categories as Array<Category>).map((item): { key: number, text: string } => {
                        return { key: item.ItemId, text: item.Name };
                    }) : [];
                        
            const types: Array<{ key: number, text: string }> =
                this.state.viewModel.Types != null ?
                    (this.state.viewModel.Types as Array<Type>).map((item): { key: number, text: string } => {
                        return { key: item.ItemId, text: item.Name };
                    }) : [];

            const businessUnits: Array<{ key: number, text: string }> =
                this.state.viewModel.BusinessUnits != null ?
                    (this.state.viewModel.BusinessUnits as Array<LookupValue>).map((item): { key: number, text: string } => {
                        return { key: item.ItemId, text: item.Value };
                    }) : [];

            const brands: Array<{ key: number, text: string }> =
                this.state.viewModel.Brands != null ?
                    (this.state.viewModel.Brands as Array<LookupValue>).map((item): { key: number, text: string } => {
                        return { key: item.ItemId, text: item.Value };
                    }) : [];

            const productCategories: Array<{ key: number, text: string }> =
                this.state.viewModel.ProductCategories != null ?
                    (this.state.viewModel.ProductCategories as Array<LookupValue>).map((item): { key: number, text: string } => {
                        return { key: item.ItemId, text: item.Value };
                    }) : [];

            const products: Array<{ key: number, text: string }> =
                this.state.viewModel.Products != null ?
                    (this.state.viewModel.Products as Array<Product>).map((item): { key: number, text: string } => {
                        return { key: item.ItemId, text: item.SKUNumber + ' - ' + item.SKUDescription };
                    }) : [];

            //#endregion

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
                                        className={styles.readOnlyInput}
                                        readOnly={true}
                                        value={entity.PromoID}
                                    />
                                </td>
                                <td colSpan={3}>&nbsp;</td>
                                <td colSpan={2}>
                                    <TextField 
                                        label="Estado:"
                                        className={styles.readOnlyInput}
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
                                        onChange={this.onActivityObjectiveChange.bind(this)}
                                        value={entity.ActivityObjective} 
                                        autoComplete="Off"
                                        errorMessage={this.getValidationErrorMessage(entity.ActivityObjective)}
                                        onGetErrorMessage={this.getValidationErrorMessage.bind(this)}
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
                                        errorMessage={this.getValidationErrorMessage(entity.Client)}
                                    />
                                </td>
                                <td colSpan={3}></td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <TextField 
                                        label="Cabeza de canal:" 
                                        className={styles.readOnlyInput}
                                        value={headOfChannel ? headOfChannel.Value : null}
                                        readOnly={true}
                                    />
                                </td>
                                <td colSpan={3}>
                                    <TextField 
                                        label="Gerente/Kam (LP):" 
                                        className={styles.readOnlyInput}
                                        value={kam ? kam.Value : null}
                                        readOnly={true}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <TextField 
                                        label="Canal (LP):" 
                                        className={styles.readOnlyInput}
                                        value={channel ? channel.Name : null}
                                        readOnly={true}
                                    />
                                </td>
                                <td colSpan={3}>
                                    <TextField 
                                        label="SubCanal:"
                                        className={styles.readOnlyInput}
                                        value={subchannel ? subchannel.Value : null} 
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
                                        onChange={this.onShortDescriptionChange.bind(this)}
                                        value={selectedItem ? selectedItem.ShortDescription : null} 
                                        required={true}
                                        autoComplete="Off"
                                        errorMessage={this.getValidationErrorMessage(selectedItem.ShortDescription)}
                                        onGetErrorMessage={this.getValidationErrorMessage.bind(this)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3} style={{verticalAlign: "top"}}>
                                    <Dropdown
                                        placeholder="Seleccione una categoría"
                                        label="Categoria de la Promoción (LD):"
                                        options={categories}
                                        selectedKey={selectedItem.Category ? selectedItem.Category.ItemId : null}
                                        onChanged={this.onCategoryChanged.bind(this)}
                                        required={true}
                                        errorMessage={this.getValidationErrorMessage(selectedItem.Category)}
                                    />
                                </td>
                                <td colSpan={3} style={{verticalAlign: "top"}}>
                                    <TextField 
                                        label="Inversión ($):"
                                        onChange={this.onInvestmentChange.bind(this)}
                                        value={selectedItem ? selectedItem.InvestmentAsString() : null} 
                                        required={selectedItem.RequiresInvestment()}
                                        autoComplete="Off"
                                        disabled={!selectedItem.RequiresInvestment() }
                                        errorMessage={selectedItem.RequiresInvestment() ? this.getValidationErrorMessage(selectedItem.Investment) : null}
                                        onGetErrorMessage={selectedItem.RequiresInvestment() ? this.getValidationErrorMessage.bind(this) : () => { return CommonHelper.EmptyString; }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <Dropdown
                                        placeholder="Seleccione un tipo"
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
                                    <Dropdown
                                        placeholder="Seleccione un negocio"
                                        label="BU:"
                                        options={businessUnits}
                                        selectedKey={selectedItem.BusinessUnit ? selectedItem.BusinessUnit.ItemId : null}
                                        onChanged={this.onBusinessUnitChanged.bind(this)}
                                        required={true}
                                    />
                                </td>
                                <td colSpan={3}>
                                    <Dropdown
                                        placeholder="Seleccione una marca"
                                        label="Marca:"
                                        options={brands}
                                        selectedKey={selectedItem.Brand ? selectedItem.Brand.ItemId : null}
                                        onChanged={this.onBrandChanged.bind(this)}
                                        required={true}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <ProductSelector 
                                        products={this.GetFilteredProducts()}
                                        onChanged={this.onProductChanged.bind(this)}
                                        value={selectedItem.Product}
                                    />
                                </td>
                                <td colSpan={3}>
                                    <Dropdown
                                        placeholder="Seleccione una categoría"
                                        label="Categoría:"
                                        options={productCategories}
                                        selectedKey={selectedItem.ProductCategory ? selectedItem.ProductCategory.ItemId : null}
                                        onChanged={this.onProductCategoryChanged.bind(this)}
                                        required={true}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <DatePicker
                                        label="Fecha comienzo"
                                        firstDayOfWeek={DayOfWeek.Monday}
                                        strings={Constants.Miscellaneous.DayPickerStrings}
                                        placeholder="Seleccione una fecha..."
                                        ariaLabel="Seleccione una fecha"
                                        value={selectedItem.StartDate!}
                                        onSelectDate={this.onSelectStartDate.bind(this)}   
                                        formatDate={CommonHelper.formatDate}
                                    />
                                </td>
                                <td colSpan={3}>
                                    <DatePicker
                                        label="Fecha fin"
                                        firstDayOfWeek={DayOfWeek.Monday}
                                        strings={Constants.Miscellaneous.DayPickerStrings}
                                        placeholder="Seleccione una fecha..."
                                        ariaLabel="Seleccione una fecha"
                                        value={selectedItem.EndDate!}
                                        onSelectDate={this.onSelectEndDate.bind(this)}
                                        formatDate={CommonHelper.formatDate}
                                    />
                                </td>
                            </tr>
                        </table>   
                        <table style={{width:'100%', display: "none"}}>
                            <tr>
                                <td colSpan={2}>
                                    <TextField 
                                        label="Precio neo OFF:"
                                        className={styles.readOnlyInput}
                                        readOnly={true}
                                    />
                                </td>
                                <td colSpan={2}>
                                    <TextField 
                                        label="Descuento por pieza ($):"
                                    />
                                </td>
                                <td colSpan={2}>
                                    <TextField 
                                        label="% Descuento:"
                                        className={styles.readOnlyInput}
                                        readOnly={true}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <TextField 
                                        label="BEP NR:"
                                        className={styles.readOnlyInput}
                                        readOnly={true}
                                    />
                                </td>
                                <td colSpan={2}>
                                    <TextField 
                                        label="COGS:"
                                        className={styles.readOnlyInput}
                                        readOnly={true}
                                    />
                                </td>
                                <td colSpan={2}>
                                    <TextField 
                                        label="GM %NR:"
                                        className={styles.readOnlyInput}
                                        readOnly={true}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <TextField 
                                        label="GM %NR con promo:"
                                        className={styles.readOnlyInput}
                                        readOnly={true}
                                    />
                                </td>
                                <td colSpan={2}>
                                    <TextField 
                                        label="GM base unit:"
                                        className={styles.readOnlyInput}
                                        readOnly={true}
                                    />
                                </td>
                                <td colSpan={2}>
                                    <TextField 
                                        label="GM promo unit:"
                                        className={styles.readOnlyInput}
                                        readOnly={true}
                                    />
                                </td>                                
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <TextField 
                                        label="BEP GM:"
                                        className={styles.readOnlyInput}
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

    //#region Header events

    private onActivityObjectiveChange(event: any, text: any) {
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
                let newState = state as IPromoFormState;
                newState.viewModel.Entity.Client = client;
                return newState;
            });
        });
    }

    //#endregion

    //#region Tabs

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

    //#endregion

    //#region Promo item - General

    private onShortDescriptionChange(event: any, text: any) {
        this.setState((state) => {
            state.viewModel.Entity.Items[this.state.selectedIndex].ShortDescription = text;    
            return state;
        });
    }

    private onCategoryChanged(item: IDropdownOption) {
        const category = this.state.viewModel.Categories.filter(x => x.ItemId === item.key as number)[0];
        const investment = this.state.viewModel.Entity.Items[this.state.selectedIndex].Investment;

        this.setState((prevState) => { 
            let newState = prevState as IPromoFormState;

            newState.loadingTypes = true;
            newState.viewModel.Entity.Items[this.state.selectedIndex].Category = category;
            newState.viewModel.Entity.Items[this.state.selectedIndex].Type = null;
            newState.viewModel.Entity.Items[this.state.selectedIndex].Investment = category.RequiresInvestment ? investment : null;

            return newState;
        });

        PromoService.GetTypesByCategory(category.ItemId).then((types: Type[]) => {
            this.setState({loadingTypes: false});
            this.setState((state) => {
                state.viewModel.Types = types;
                return state;
            });            
        });        
    }

    private onInvestmentChange(event: any, text: any) {
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

    //#endregion

    //#region Promo item - Product

    private GetFilteredProducts(): Product[] {
        const selectedItem = this.state.viewModel.Entity.Items[this.state.selectedIndex];
        let filteredProducts = this.state.viewModel.Products;
        
        if(selectedItem.BusinessUnit)
            filteredProducts = filteredProducts.filter(x => x.BusinessUnit.ItemId === selectedItem.BusinessUnit.ItemId);

        if(selectedItem.Brand)
            filteredProducts = filteredProducts.filter(x => x.Brand.ItemId === selectedItem.Brand.ItemId);

        if(selectedItem.ProductCategory)
            filteredProducts = filteredProducts.filter(x => x.Category.ItemId === selectedItem.ProductCategory.ItemId);

        return filteredProducts;
    }

    private onBusinessUnitChanged(item: IDropdownOption) {        
        const businessUnit = this.state.viewModel.BusinessUnits.filter(x => x.ItemId === item.key as number)[0];

        this.setState((state) => {         
            state.viewModel.Entity.Items[this.state.selectedIndex].Product = null;
            state.viewModel.Entity.Items[this.state.selectedIndex].BusinessUnit = businessUnit;
            return state;
        });
    }

    private onBrandChanged(item: IDropdownOption) {        
        const brand = this.state.viewModel.Brands.filter(x => x.ItemId === item.key as number)[0];

        this.setState((state) => {  
            state.viewModel.Entity.Items[this.state.selectedIndex].Product = null;
            state.viewModel.Entity.Items[this.state.selectedIndex].Brand = brand;
            return state;
        });
    }

    private onProductCategoryChanged(item: IDropdownOption) {        
        const productCategory = this.state.viewModel.ProductCategories.filter(x => x.ItemId === item.key as number)[0];

        this.setState((state) => {      
            state.viewModel.Entity.Items[this.state.selectedIndex].Product = null;      
            state.viewModel.Entity.Items[this.state.selectedIndex].ProductCategory = productCategory;
            return state;
        });
    }

    private onProductChanged(productId: number) {         
        const product = this.state.viewModel.Products.filter(x => x.ItemId === productId)[0];

        this.setState((state) => {            
            state.viewModel.Entity.Items[this.state.selectedIndex].Product = product;
            state.viewModel.Entity.Items[this.state.selectedIndex].BusinessUnit = product.BusinessUnit;
            state.viewModel.Entity.Items[this.state.selectedIndex].Brand = product.Brand;
            state.viewModel.Entity.Items[this.state.selectedIndex].ProductCategory = product.Category;
            return state;
        });
    }

    private onSelectStartDate (date: Date | null | undefined): void {
        this.setState((state) => {            
            state.viewModel.Entity.Items[this.state.selectedIndex].StartDate = date;
            return state;
        });
    }

    private onSelectEndDate (date: Date | null | undefined): void {
        this.setState((state) => {            
            state.viewModel.Entity.Items[this.state.selectedIndex].EndDate = date;
            return state;
        });
    }

    //#endregion

    private submit(): void {
        console.log(this.state.viewModel.Entity);

        if(!this.validateFormControls()) return;

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
    
    private getValidationErrorMessage(value: any): string{
        if(value == undefined)
          return this.state.hasValidationError ? Constants.Messages.RequiredField : CommonHelper.EmptyString;
    
        if(typeof value === "string")
          return this.state.hasValidationError && CommonHelper.IsNullOrEmpty(value) ? Constants.Messages.RequiredField : CommonHelper.EmptyString;
    
        if(CommonHelper.IsArray(value)) 
          return this.state.hasValidationError && value.length == 0 ? Constants.Messages.RequiredField : CommonHelper.EmptyString;
    
        return CommonHelper.EmptyString;
    }

    private validateFormControls(): boolean{
        var invalidCount = 0;

        if(CommonHelper.IsNullOrEmpty(this.state.viewModel.Entity.ActivityObjective)) invalidCount++;
        if(this.state.viewModel.Entity.Client == null) invalidCount++;

        this.state.viewModel.Entity.Items.map((item) => {
            if(CommonHelper.IsNullOrEmpty(item.ShortDescription)) invalidCount++;
            if(item.Category == null) invalidCount++;
            if(item.Category != null && item.Category.RequiresInvestment && !(item.Investment > 0)) invalidCount++;
            if(item.Type == null) invalidCount++;
            if(item.BusinessUnit == null) invalidCount++;
            if(item.Brand == null) invalidCount++;
            if(item.Product == null) invalidCount++;
            if(item.ProductCategory == null) invalidCount++;
            if(!CommonHelper.IsDate(item.StartDate)) invalidCount++;
            if(!CommonHelper.IsDate(item.EndDate)) invalidCount++;
        });

        this.setState({ hasValidationError: invalidCount > 0});

        return invalidCount == 0;
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