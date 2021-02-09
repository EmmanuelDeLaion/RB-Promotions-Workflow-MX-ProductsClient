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
  Label,  
  Modal,
  IconButton,
  Dialog,
  Stack,
  Persona,
  Separator,
  PersonaSize,
  Link,
  Icon,
  mergeStyles,
  getTheme,
  IPersonaSharedProps,
  IStackStyles,
  FontWeights,
  mergeStyleSets,
  Spinner,
  PersonaPresence,
  DialogType,
  IIconProps
} from 'office-ui-fabric-react';
import styles from './PromoForm.module.scss';
import { Category, Client, ClientProduct, Product, Type } from '../../model/Common';
import { ClientRepository } from '../../data';
import { PromoItem, PromoWorkflowState } from '../../model/Promo';
import { Constants } from '../../Constants';
import { LookupValue } from '../../infrastructure';
import { ProductSelector } from '../ProductSelector/ProductSelector';
import { CommonHelper } from '../../common/CommonHelper';
import { ClientProductRepository } from '../../data/ClientProductRepository';
import { IPivotItemProps, Pivot, PivotItem } from '@fluentui/react-tabs';
require('../PromoForm/PromoForm.overrides.scss');
require('./PromoForm.css');
import { initializeTheme } from './Theme';
import { TestImages } from '@uifabric/example-data';
import { LastYearVolumesRepository } from '../../data/LastYearVolumesRepository';
import { LastYearVolumes } from '../../model/Common/LastYearVolumes';

initializeTheme();
const theme = getTheme();

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
      filteredProducts: [],            
      mainModalOpen: true,
      hideDeleteProductDialog: true,
      errorMessage: "",
      hideModalConfirmationDialog: true,
      effective: true,
      promotionTitle: "",
      client: "",
      hideSavingSpinnerConfirmationDialog: true
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

    let output = 
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
          <div>
            <Modal isOpen={this.state.mainModalOpen} className="mainModal">
              <Shimmer
                width="100%"
                styles={this._getShimmerStyles}
                customElementsGroup={this.getCustomShimmerElementsGroup()}
                isDataLoaded={!this.state.isLoading}
                onClick={() => this.setState({ isLoading: false })}>
              
                {/* Modal Header*/}
              
                <div className={this.contentStyles.header}>
                  <span>{this.state.viewModel.GetPromotionTitle()}</span>
                  <IconButton
                    styles={this.iconButtonStyles}
                    iconProps={this.cancelIcon}
                    ariaLabel="Close popup modal"
                    onClick={this.onCloseModal.bind(this)}
                    autoFocus={false}
                  />
                </div>
                <Dialog
                  hidden={this.state.hideModalConfirmationDialog}
                  dialogContentProps={this.closeModalDialogContentProps}
                  styles={this.confirmationDialogStyles}>
                  <DialogFooter>
                    <DefaultButton 
                      onClick={() => this.setState({ hideModalConfirmationDialog: true })} 
                      text="Cancelar" />
                    <PrimaryButton 
                      onClick={this.props.close} 
                      text="Salir sin guardar" />
                  </DialogFooter>
                </Dialog>

                {/* Fin Modal Header*/}

                {/* Modal Content*/}

                <Stack className="mainPadding">
                  <Pivot aria-label="Main Pivot" className="mainPivot" overflowBehavior="menu">
                    <PivotItem onRenderItemLink={this._customPromotionPivotItemRenderer.bind(this, entity.PromoID)}>
                      <Stack styles={this.repetitiveSectionStyle}>
                        <Stack className="statusContainer smallPadding padding-right" horizontal horizontalAlign="end">
                          <Stack style={{ color: theme.palette.themePrimary, paddingRight: "4px" }}><Icon iconName="MapLayers" /></Stack>
                          <Stack className="label">Estado:</Stack>
                          <Stack style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>{entity.GetStatusText()}</Stack>
                        </Stack>
                        {/* Promotion section */}
                        <Stack horizontal className="padding">
                          <Stack grow={8} verticalAlign="start">
                            <Stack grow={12} horizontal className="smallPadding">
                              <Stack grow={6} className="padding-right controlPadding">
                                <TextField
                                  label="Nombre de la promoción"
                                  value={entity.Name}
                                  placeholder="Ingrese el nombre de la promoción"
                                  required={true}
                                  errorMessage={this.getValidationErrorMessage(entity.Name)}
                                  autoFocus={true}
                                  onChange={this.onNameChange.bind(this)}
                                  autoComplete="Off"
                                  readOnly={this.state.viewModel.ReadOnlyForm}
                                />
                              </Stack>
                              <Stack grow={6} className="padding-right controlPadding">
                                <Dropdown
                                  placeholder="Seleccione un cliente"
                                  label="Cliente:"
                                  options={clients}
                                  selectedKey={entity.Client ? entity.Client.ItemId : null}
                                  onChanged={this.onClientChanged.bind(this)}
                                  required={true}
                                  errorMessage={this.getValidationErrorMessage(entity.Client)}
                                />
                              </Stack>
                            </Stack >
                            <Stack grow={12} className="padding-right multilineControlPadding">
                              <TextField 
                                label="Objetivo de la actividad:" 
                                required={true} 
                                multiline={true}
                                rows={3}
                                onChange={this.onActivityObjectiveChange.bind(this)}
                                value={entity.ActivityObjective} 
                                autoComplete="Off"
                                errorMessage={this.getValidationErrorMessage(entity.ActivityObjective)}
                                onGetErrorMessage={this.getValidationErrorMessage.bind(this)}
                              />
                            </Stack>
                          </Stack>
                          <Stack grow={4} horizontal>
                            <Stack verticalFill>
                              <Separator vertical={true} styles={this.verticalSeparatorStyle}></Separator>
                            </Stack>
                            <Stack grow={12}>
                              <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                                <Label className="peopleLabel">Cabeza de canal</Label>
                                <div style={{display: headOfChannel ? "block" : "none"}}>
                                  <Persona
                                    //TODO: Cargar imagen y account name
                                    //{...this.examplePersona}
                                    text= {headOfChannel ? headOfChannel.Value : null}
                                    size={PersonaSize.size24}
                                    //presence={PersonaPresence.online}
                                    hidePersonaDetails={false}
                                    imageAlt={headOfChannel ? headOfChannel.Value : null}                                    
                                  />
                                </div>
                              </Stack>
                              <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                                <Label className="peopleLabel">Gerente/Kam (LP)</Label>
                                <div style={{display: kam ? "block" : "none"}}>
                                  <Persona
                                    //TODO: Cargar imagen y account name
                                    text={kam ? kam.Value : null}
                                    size={PersonaSize.size24}
                                    //presence={PersonaPresence.online}
                                    hidePersonaDetails={false}
                                    imageAlt={kam ? kam.Value : null}
                                  />
                                </div>
                              </Stack>
                              <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                                <Label className="peopleLabel">Canal (LP)</Label>
                                <Label className="labelNotBold">{channel ? channel.Name : null}</Label>
                              </Stack>
                              <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                                <Label className="peopleLabel">Subcanal</Label>
                                <Label className="labelNotBold">{subchannel ? subchannel.Value : null}</Label>
                              </Stack>
                            </Stack>
                          </Stack>
                        </Stack>

                        {/* Repetitive section */}
                        <Stack>
                          <Pivot 
                            className="innerPivot" 
                            aria-label="Inner Pivot" 
                            overflowBehavior="menu" 
                            onLinkClick={this.onTabLinkClicked.bind(this)}
                            selectedKey={this.state.selectedIndex.toString()}>
                            {entity.Items.map((item, index) => { return (
                              <PivotItem 
                                headerText={item.AdditionalID} 
                                headerButtonProps={{'data-order': index + 1, 'data-title': item.AdditionalID}} 
                                itemKey={index.toString()}>
                              </PivotItem>
                            );})}
                            <PivotItem headerText="Nuevo" itemIcon="Add" onClick={this.AddPromoItem.bind(this)} itemKey="ADD" />                            
                          </Pivot>
                          <Stack className="deleteProductContainer" horizontal horizontalAlign="end">
                            <Stack className="label">
                              <div style={{display: entity.Items.length > 1 ? "block" : "none"}}>
                                <Link onClick={() => this.setState({ hideDeleteProductDialog: false })}><Icon iconName="MapLayers" /><span style={{ color: '#323130' }}>Borrar producto</span></Link>
                              </div>
                            </Stack>
                            <Dialog
                              hidden={this.state.hideDeleteProductDialog}
                              dialogContentProps={this.deleteProductDialogContentProps}
                              styles={this.confirmationDialogStyles}>
                              <DialogFooter>
                                <PrimaryButton onClick={this.RemovePromoItem.bind(this)} text="Eliminar" />
                                <DefaultButton onClick={() => this.setState({ hideDeleteProductDialog: true })} text="Cancelar" />
                              </DialogFooter>
                            </Dialog>
                          </Stack>
                          <Stack horizontal styles={this.repetitiveSectionStyle} className="padding">
                            <Stack grow={8}>
                              <Stack styles={{ root: { maxHeight: "30px" } }} className="smallPadding padding-right" grow={6}>
                                <Stack horizontal className="actividadTopadaContainer smallPadding-left">
                                  <Stack>
                                    <Label>Actividad Topada</Label>
                                  </Stack>
                                  <Stack className="toRight smallPadding actividadTopadaToggle">
                                    <Toggle                                        
                                        onText="Si" 
                                        offText="No" 
                                        onChange={this.onCappedActivityChanged.bind(this)} 
                                        checked={selectedItem.CappedActivity}
                                    />
                                  </Stack>
                                </Stack>
                              </Stack>
                              <Stack horizontal grow={12} styles={{ root: { paddingTop: "16px" } }}>
                                <Stack className="smallPadding" grow={6}>
                                  <Stack className="padding-right controlPadding">
                                    <Dropdown
                                      placeholder="Seleccione una categoría"
                                      label="Categoria de la Promoción (LD):"
                                      options={categories}
                                      selectedKey={selectedItem.Category ? selectedItem.Category.ItemId : null}
                                      onChanged={this.onCategoryChanged.bind(this)}
                                      required={true}
                                      errorMessage={this.getValidationErrorMessage(selectedItem.Category)}
                                    />
                                  </Stack>
                                  <Stack className="padding-right controlPadding">
                                    <TextField
                                      label="Descripción corta:"
                                      onChange={this.onShortDescriptionChange.bind(this)}
                                      value={selectedItem ? selectedItem.ShortDescription : null} 
                                      required={true}
                                      autoComplete="Off"
                                      errorMessage={this.getValidationErrorMessage(selectedItem.ShortDescription)}
                                      onGetErrorMessage={this.getValidationErrorMessage.bind(this)}
                                    />
                                  </Stack>
                                  <Stack className="padding-right controlPadding">
                                    <ProductSelector 
                                      products={this.GetFilteredProducts()}
                                      onChanged={this.onProductChanged.bind(this)}
                                      value={selectedItem.Product}
                                    />
                                  </Stack>
                                  <Stack className="padding-right controlPadding">
                                    <Dropdown
                                      placeholder="Seleccione un negocio"
                                      label="BU:"
                                      options={businessUnits}
                                      selectedKey={selectedItem.BusinessUnit ? selectedItem.BusinessUnit.ItemId : null}
                                      onChanged={this.onBusinessUnitChanged.bind(this)}
                                      required={true}
                                      errorMessage={this.getValidationErrorMessage(selectedItem.BusinessUnit)}
                                    />
                                  </Stack>
                                  <Stack className="padding-right controlPadding">
                                    <DatePicker
                                      label="Fecha de comienzo"
                                      firstDayOfWeek={DayOfWeek.Monday}
                                      strings={Constants.Miscellaneous.DayPickerStrings}
                                      placeholder="Seleccione una fecha..."
                                      ariaLabel="Seleccione una fecha"
                                      value={selectedItem.StartDate!}
                                      onSelectDate={this.onSelectStartDate.bind(this)}   
                                      formatDate={CommonHelper.formatDate}
                                      isRequired={true}
                                    />
                                  </Stack>
                                  <Stack className="padding-right controlPadding">
                                    <TextField 
                                      label="Descuento por pieza ($):"
                                      onChange={this.onDiscountPerPieceChange.bind(this)}
                                      value={selectedItem.GetDiscountPerPieceAsString()}
                                      required={selectedItem.RequiresDiscountPerPiece()}
                                      autoComplete="Off"
                                      disabled={!selectedItem.RequiresDiscountPerPiece() }
                                      errorMessage={selectedItem.RequiresDiscountPerPiece() ? this.getValidationErrorMessage(selectedItem.DiscountPerPiece) : null}
                                      onGetErrorMessage={selectedItem.RequiresDiscountPerPiece() ? this.getValidationErrorMessage.bind(this) : () => { return CommonHelper.EmptyString; }}
                                    />
                                  </Stack>
                                </Stack>
                                <Stack className="smallPadding" grow={6}>
                                  <Stack className="padding-right controlPadding">
                                    <Dropdown
                                      placeholder="Seleccione un tipo"
                                      label="Tipo de Promocion (LD):"
                                      options={types}
                                      disabled={this.state.loadingTypes || types.length === 0}
                                      selectedKey={selectedItem.Type ? selectedItem.Type.ItemId : null}
                                      onChanged={this.onTypeChanged.bind(this)}
                                      required={true}
                                      errorMessage={this.getValidationErrorMessage(selectedItem.Type)}
                                    />
                                  </Stack>
                                  <Stack className="padding-right controlPadding">
                                    <TextField 
                                      label="Inversión ($):"
                                      onChange={this.onInvestmentChange.bind(this)}
                                      value={selectedItem ? selectedItem.GetInvestmentAsString() : null} 
                                      required={selectedItem.RequiresInvestment()}
                                      autoComplete="Off"
                                      disabled={!selectedItem.RequiresInvestment() }
                                      errorMessage={selectedItem.RequiresInvestment() ? this.getValidationErrorMessage(selectedItem.Investment) : null}
                                      onGetErrorMessage={selectedItem.RequiresInvestment() ? this.getValidationErrorMessage.bind(this) : () => { return CommonHelper.EmptyString; }}
                                    />
                                  </Stack>
                                  <Stack className="padding-right controlPadding">
                                    <Dropdown
                                      placeholder="Seleccione una marca"
                                      label="Marca:"
                                      options={brands}
                                      selectedKey={selectedItem.Brand ? selectedItem.Brand.ItemId : null}
                                      onChanged={this.onBrandChanged.bind(this)}
                                      required={true}
                                      errorMessage={this.getValidationErrorMessage(selectedItem.Brand)}
                                    />
                                  </Stack>
                                  <Stack className="padding-right controlPadding">
                                    <Dropdown
                                      placeholder="Seleccione una categoría"
                                      label="Categoría:"
                                      options={productCategories}
                                      selectedKey={selectedItem.ProductCategory ? selectedItem.ProductCategory.ItemId : null}
                                      onChanged={this.onProductCategoryChanged.bind(this)}
                                      required={true}
                                      errorMessage={this.getValidationErrorMessage(selectedItem.ProductCategory)}
                                    />
                                  </Stack>
                                  <Stack className="padding-right controlPadding">
                                    <DatePicker
                                      label="Fecha fin"
                                      firstDayOfWeek={DayOfWeek.Monday}
                                      strings={Constants.Miscellaneous.DayPickerStrings}
                                      placeholder="Seleccione una fecha..."
                                      ariaLabel="Seleccione una fecha"
                                      value={selectedItem.EndDate!}
                                      onSelectDate={this.onSelectEndDate.bind(this)}
                                      formatDate={CommonHelper.formatDate}
                                      isRequired={true}
                                    />
                                  </Stack>                                  
                                  <Stack className="padding-right controlPadding">
                                    <TextField
                                      label="% Redención"
                                      onChange={this.onRedemptionChange.bind(this)}
                                      value={selectedItem.GetRedemptionAsString()}                                      
                                      required={selectedItem.RequiresRedemption()}
                                      autoComplete="Off"
                                      disabled={!selectedItem.RequiresRedemption()}
                                      errorMessage={selectedItem.RequiresRedemption() ? this.getValidationErrorMessage(selectedItem.Redemption) : null}
                                      onGetErrorMessage={selectedItem.RequiresRedemption() ? this.getValidationErrorMessage.bind(this) : () => { return CommonHelper.EmptyString; }} 
                                    />
                                  </Stack>
                                </Stack>
                              </Stack>
                            </Stack>
                            <Stack grow={4}>
                              <Stack className="smallPadding" grow={4} horizontal>
                                <Separator vertical={true} styles={this.verticalSeparatorStyle}></Separator>
                                <Stack grow={12}>
                                  <Stack horizontal className="grayHeader padding padding-left padding-right">
                                    <Icon iconName="DietPlanNotebook" />
                                    <Label>Detalles de la promoción</Label>
                                  </Stack>
                                  <Stack className="grayContent smallPadding padding-left padding-right" verticalFill>
                                    <Stack horizontal className="verticalPadding detailsControlPadding" verticalAlign="center">
                                      <Label>Precio neto OFF</Label>
                                      <Label className="toRight">{selectedItem.RequiresNetPrice() ? ("$" + selectedItem.GetNetPriceAsString()) : "N/A"}</Label>
                                    </Stack>
                                    <Separator className="graySeparator separatorToTop" />
                                    <Stack horizontal className="verticalPadding detailsControlPadding" verticalAlign="center">
                                      <Label>% Descuento</Label>
                                      <Label className="toRight">{selectedItem.RequiresDiscountPerPiece() ? (selectedItem.GetDiscountPercentageAsString() + "%") : "N/A"}</Label>
                                    </Stack>
                                    <Separator className="graySeparator separatorToTop" />
                                    <Stack horizontal className="verticalPadding detailsControlPadding" verticalAlign="center">
                                      <Label>BEP NR</Label>
                                      <Label className="toRight">Valor</Label>
                                    </Stack>
                                    <Separator className="graySeparator separatorToTop" />
                                    <Stack horizontal className="verticalPadding detailsControlPadding" verticalAlign="center">
                                      <Label>COGS</Label>
                                      <Label className="toRight">{selectedItem.GetCOGSAsString()}</Label>
                                    </Stack>
                                    <Separator className="graySeparator separatorToTop" />
                                    <Stack horizontal className="verticalPadding detailsControlPadding" verticalAlign="center">
                                      <Label>GM %NR</Label>
                                      <Label className="toRight">{selectedItem.GetGMPercentageNRAsString() + "%"}</Label>
                                    </Stack>
                                    <Separator className="graySeparator separatorToTop" />
                                    <Stack horizontal className="verticalPadding detailsControlPadding " verticalAlign="center">
                                      <Label>GM %NR con promo</Label>
                                      <Label className="toRight">{selectedItem.RequiresDiscountPerPiece() ? selectedItem.GetGMPercentageNRWithPromoAsString() + "%" : "N/A"}</Label>
                                    </Stack>
                                    <Separator className="graySeparator separatorToTop" />
                                    <Stack horizontal className="verticalPadding detailsControlPadding " verticalAlign="center">
                                      <Label>GM Base Unit</Label>
                                      <Label className="toRight">{"$" + selectedItem.GetGMBaseUnitAsString()}</Label>
                                    </Stack>
                                    <Separator className="graySeparator separatorToTop" />
                                    <Stack horizontal className="verticalPadding detailsControlPadding " verticalAlign="center">
                                      <Label>GM Promo Unit</Label>
                                      <Label className="toRight">{"$" + selectedItem.GetGMPromoUnitAsString()}</Label>
                                    </Stack>
                                    <Separator className="graySeparator separatorToTop" />
                                    <Stack horizontal className="verticalPadding detailsControlPadding" verticalAlign="center">
                                      <Label>BEP GM</Label>
                                      <Label className="toRight">Valor</Label>
                                    </Stack>
                                    <Separator className="graySeparator separatorToTop" />
                                    <Stack verticalFill></Stack>
                                  </Stack>
                                </Stack>
                              </Stack>
                            </Stack>
                          </Stack>
                          <Stack className="padding-bottom">
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
                                <Label onClick={() => this.setState({ effective: !this.state.effective })}>Efectividad</Label>
                                <div hidden={!this.state.effective} className="effectiveLabelContainer">
                                  <span className="effectiveLabel">EFECTIVA</span>
                                </div>
                                <div hidden={this.state.effective} className="effectiveLabelContainer">
                                  <span className="effectiveLabel notEffectiveLabel">NO EFECTIVA</span>
                                </div>
                              </Stack>
                            </Stack>
                            <Stack className="grayContent padding padding-left padding-right">
                              <Stack horizontal>
                                <Stack grow={4} className="smallPadding padding-right controlPadding">                                  
                                  <TextField
                                      label="Volumen base"
                                      onChange={this.onBaseVolumeChange.bind(this)}
                                      value={selectedItem.GetBaseVolumeAsString()} 
                                      required={true}
                                      autoComplete="Off"
                                      errorMessage={this.getValidationErrorMessage(selectedItem.BaseVolume)}
                                      onGetErrorMessage={this.getValidationErrorMessage.bind(this)} />
                                </Stack>
                                <Stack grow={4} className="smallPadding padding-right controlPadding">
                                  <TextField
                                      label="Volumen incremental estimado"
                                      onChange={this.onEstimatedIncrementalVolumeChange.bind(this)}
                                      value={selectedItem.GetEstimatedIncrementalVolumeAsString()} 
                                      required={true}
                                      autoComplete="Off"
                                      errorMessage={this.getValidationErrorMessage(selectedItem.EstimatedIncrementalVolume)}
                                      onGetErrorMessage={this.getValidationErrorMessage.bind(this)} />
                                </Stack>
                                <Stack grow={4} className="smallPadding padding-right controlPadding">                                  
                                  <TextField
                                      label="Inversión adicional (MKT)"
                                      onChange={this.onAdditionalInvestmentChange.bind(this)}
                                      value={selectedItem.GetAdditionalInvestmentAsString()} 
                                      autoComplete="Off" />
                                </Stack>
                              </Stack>                              
                              <Stack horizontal>
                                <Stack className="smallPadding padding-right controlPadding" grow={4}>
                                  <Stack horizontal className="verticalPadding">
                                    <Label>Volume LY</Label>
                                    <Label className="toRight">{selectedItem.GetLastYearVolumeAsString()}</Label>
                                  </Stack>
                                  <Separator className="graySeparator separatorToTop" />
                                  <Stack horizontal className="verticalPadding">
                                    <Label>% Volume Incremental</Label>
                                    <Label className="toRight">{selectedItem.RequiresIncrementalVolumePercentage() ? (selectedItem.GetIncrementalVolumePercentageAsString() + "%") : "N/A"}</Label>
                                  </Stack>
                                  <Separator className="graySeparator separatorToTop" />
                                  <Stack horizontal className="verticalPadding">
                                    <Label>NR incremental estimado</Label>
                                    <Label className="toRight">Valor</Label>
                                  </Stack>
                                  <Separator className="graySeparator separatorToTop" />
                                  <Stack horizontal className="verticalPadding">
                                    <Label>GM incremental</Label>
                                    <Label className="toRight">Valor</Label>
                                  </Stack>
                                  <Separator className="graySeparator separatorToTop" />
                                </Stack>
                                <Stack className="smallPadding padding-right" grow={4}>
                                  <Stack horizontal className="verticalPadding">
                                    <Label>Volume Average L 3 Months</Label>
                                    <Label className="toRight">{selectedItem.GetAverageVolumeL3MonthsAsString()}</Label>
                                  </Stack>
                                  <Separator className="graySeparator separatorToTop" />
                                  <Stack horizontal className="verticalPadding">
                                    <Label>NR base</Label>
                                    <Label className="toRight">{selectedItem.RequiresBaseNR() ? ("$" + selectedItem.GetBaseNRAsString()) : "N/A"}</Label>
                                  </Stack>
                                  <Separator className="graySeparator separatorToTop" />
                                  <Stack horizontal className="verticalPadding">
                                    <Label>GM base</Label>
                                    <Label className="toRight">{selectedItem.RequiresBaseGM() ? ("$" + selectedItem.GetBaseGMAsString()) : "N/A"}</Label>
                                  </Stack>
                                  <Separator className="graySeparator separatorToTop" />
                                  <Stack horizontal className="verticalPadding">
                                    <Label>Inversión estimada</Label>
                                    <Label className="toRight">{"$" + selectedItem.GetEstimatedInvestmentAsString()}</Label>
                                  </Stack>
                                  <Separator className="graySeparator separatorToTop" />
                                </Stack>
                                <Stack className="smallPadding" grow={4}>
                                  <Stack horizontal className="verticalPadding">
                                    <Label>Total volumen estimado</Label>
                                    <Label className="toRight">{selectedItem.RequiresTotalEstimatedVolume() ? selectedItem.GetTotalEstimatedVolumeAsString() : "N/A"}</Label>
                                  </Stack>
                                  <Separator className="graySeparator separatorToTop" />
                                  <Stack horizontal className="verticalPadding">
                                    <Label>NR Estimado</Label>
                                    <Label className="toRight">Valor</Label>
                                  </Stack>
                                  <Separator className="graySeparator separatorToTop" />
                                  <Stack horizontal className="verticalPadding">
                                    <Label>GM promo estimado</Label>
                                    <Label className="toRight">Valor</Label>
                                  </Stack>
                                  <Separator className="graySeparator separatorToTop" />
                                </Stack>
                              </Stack>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Stack>
                    </PivotItem>
                    <PivotItem onRenderItemLink={this._customPromotionSummaryPivotItemRenderer}>
                      <Stack className="summarySectionContainer">
                        <Stack styles={this.repetitiveSectionStyle}>
                          <Stack className="statusContainer smallPadding padding-right" horizontal horizontalAlign="end">
                            <Stack style={{ color: theme.palette.themePrimary, paddingRight: "4px" }}><Icon iconName="MapLayers" /></Stack>
                            <Stack className="label">Estado:</Stack>
                            <Stack style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>Pendiente de aprobación</Stack>
                          </Stack>
                          <Stack horizontal className="padding">
                            <Stack grow={8} verticalAlign="start">
                              <Stack grow={12} className="grayContent padding padding-left padding-right">
                                <Stack horizontal className="verticalPadding">
                                  <Label>Cliente</Label>
                                  <Label className="toRight">Cliente 1</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack className="verticalPadding">
                                  <Label>Objetivo de la promoción</Label>
                                  <span className="twoColumnsContentMaxWidth">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</span>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                              </Stack>
                            </Stack>
                            <Stack grow={4} horizontal>
                              <Stack verticalFill>
                                <Separator vertical={true} styles={this.verticalSeparatorStyle}></Separator>
                              </Stack>
                              <Stack grow={12}>
                                <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                                  <Label className="peopleLabel">Cabeza de canal</Label>
                                  <Persona
                                    {...this.examplePersona}
                                    size={PersonaSize.size24}
                                    presence={PersonaPresence.online}
                                    hidePersonaDetails={false}
                                    imageAlt="Annie Lindqvist, status is online"
                                  />
                                </Stack>
                                <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                                  <Label className="peopleLabel">Gerente KAM</Label>
                                  <Persona
                                    {...this.examplePersona2}
                                    size={PersonaSize.size24}
                                    presence={PersonaPresence.online}
                                    hidePersonaDetails={false}
                                    imageAlt="Annie Lindqvist, status is online"
                                  />
                                </Stack>
                                <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                                  <Label className="peopleLabel">Canal</Label>
                                  <Label className="labelNotBold">Canal 1</Label>
                                </Stack>
                                <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                                  <Label className="peopleLabel">Subcanal</Label>
                                  <Label className="labelNotBold">Subcanal 1.1</Label>
                                </Stack>
                              </Stack>
                            </Stack>
                          </Stack>
                          <Stack className="padding-bottom">
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
                                <Label onClick={() => this.setState({ effective: !this.state.effective })}>Efectividad</Label>
                                <div hidden={!this.state.effective} className="effectiveLabelContainer">
                                  <span className="effectiveLabel">EFECTIVA</span>
                                </div>
                                <div hidden={this.state.effective} className="effectiveLabelContainer">
                                  <span className="effectiveLabel notEffectiveLabel">NO EFECTIVA</span>
                                </div>
                              </Stack>
                            </Stack>
                            <Stack horizontal className="grayContent padding padding-left padding-right">
                              <Stack className="smallPadding padding-right controlPadding" grow={4}>
                                <Stack horizontal className="verticalPadding">
                                  <Label>Volumen base</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>NR base</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>GM base</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>Inversión estimada</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                              </Stack>
                              <Stack className="smallPadding padding-right" grow={4}>
                                <Stack horizontal className="verticalPadding">
                                  <Label>Volumen estimado</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>NR estimado</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>GM estimado</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>Inversión adicional (MKT)</Label>
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
                                  <Label>% NR incremental</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>% GM incremental</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                              </Stack>
                            </Stack>
                          </Stack>
                          <Stack className="padding-bottom">
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
                                <Label onClick={() => this.setState({ effective: !this.state.effective })}>Efectividad</Label>
                                <div hidden={!this.state.effective} className="effectiveLabelContainer">
                                  <span className="effectiveLabel">EFECTIVA</span>
                                </div>
                                <div hidden={this.state.effective} className="effectiveLabelContainer">
                                  <span className="effectiveLabel notEffectiveLabel">NO EFECTIVA</span>
                                </div>
                              </Stack>
                            </Stack>
                            <Stack horizontal className="grayContent padding padding-left padding-right">
                              <Stack className="smallPadding padding-right controlPadding" grow={4}>
                                <Stack horizontal className="verticalPadding">
                                  <Label>Volumen base</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>NR base</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>GM base</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>Inversión estimada</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                              </Stack>
                              <Stack className="smallPadding padding-right" grow={4}>
                                <Stack horizontal className="verticalPadding">
                                  <Label>Volumen estimado</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>NR estimado</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>GM estimado</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>Inversión adicional (MKT)</Label>
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
                                  <Label>% NR incremental</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>% GM incremental</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                              </Stack>
                            </Stack>
                          </Stack>
                          <Stack className="padding-bottom">
                            <Stack horizontal className={this.state.effective
                              ? "grayHeader smallPadding padding-left padding-right grayHeaderToGreen"
                              : "grayHeader smallPadding padding-left padding-right grayHeaderToRed"}>
                              <Stack grow={6} horizontal className="verticalPadding preAnalisisPadding">
                                <Icon iconName="DietPlanNotebook" />
                                <Label>Análisis general</Label>
                              </Stack>
                              <Stack grow={3} horizontalAlign="end">
                                <Label>ROI Estimado Total</Label>
                                <Label>0.92</Label>
                              </Stack>
                              <Stack grow={3} horizontalAlign="end">
                                <Label onClick={() => this.setState({ effective: !this.state.effective })}>Efectividad</Label>
                                <div hidden={!this.state.effective} className="effectiveLabelContainer">
                                  <span className="effectiveLabel">EFECTIVA</span>
                                </div>
                                <div hidden={this.state.effective} className="effectiveLabelContainer">
                                  <span className="effectiveLabel notEffectiveLabel">NO EFECTIVA</span>
                                </div>
                              </Stack>
                            </Stack>
                            <Stack horizontal className="grayContent padding padding-left padding-right">
                              <Stack className="smallPadding padding-right controlPadding" grow={4}>
                                <Stack horizontal className="verticalPadding">
                                  <Label>Volumen base</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>NR base</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />

                                <Stack horizontal className="verticalPadding">
                                  <Label>GM base</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>Inversión estimada</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                              </Stack>
                              <Stack className="smallPadding padding-right" grow={4}>
                                <Stack horizontal className="verticalPadding">
                                  <Label>Volumen estimado</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>NR estimado</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>GM estimado</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>Inversión adicional (MKT)</Label>
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
                                  <Label>% NR incremental</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                                <Stack horizontal className="verticalPadding">
                                  <Label>% GM incremental</Label>
                                  <Label className="toRight">Valor</Label>
                                </Stack>
                                <Separator className="graySeparator separatorToTop" />
                              </Stack>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Stack>
                    </PivotItem>
                  </Pivot>
                </Stack >

                {/* Fin Modal Content*/}

                {/* Modal Bottom*/}

                <div className="modalBottom">
                  <Label>Estado general de la promoción</Label>
                  <Separator className="graySeparator separatorToTop" />
                  <Stack className="modalBottomContent" horizontal grow={12}>
                    <Stack grow={6}>
                      <Label className="modalBottomContentHeader" onClick={() => this.setState({ effective: !this.state.effective })}>Efectividad</Label>
                      <div hidden={!this.state.effective} className="effectiveLabelContainer">
                        <span className="effectiveLabel">EFECTIVA</span>
                      </div>
                      <div hidden={this.state.effective} className="effectiveLabelContainer">
                        <span className="effectiveLabel notEffectiveLabel">NO EFECTIVA</span>
                      </div>
                    </Stack>
                    <Stack grow={3}>
                      <Label className="modalBottomContentHeader">ROI Estimado total</Label>
                      <Label className="modalBottomContentValue">0.92</Label>
                    </Stack>
                    <Stack grow={3} className="modalBottomButtonsContainer" horizontal horizontalAlign="end">
                      <Stack>
                        <DefaultButton 
                          style={{display: this.state.viewModel.ShowSaveButton ? "block" : "none"}}
                          text="Guardar borrador" 
                          allowDisabledFocus 
                          onClick={this.save.bind(this)}
                          disabled={!this.state.enableSubmit} />
                        <PrimaryButton
                          style={{display: this.state.viewModel.ShowApproveButton ? "block" : "none"}}
                          text="Aprobar" 
                          allowDisabledFocus 
                          onClick={this.approve.bind(this)} 
                          disabled={!this.state.enableSubmit} />
                        <Dialog
                          hidden={this.state.hideSavingSpinnerConfirmationDialog}
                          dialogContentProps={this.savingSpinnerModalDialogContentProps}
                          styles={this.confirmationDialogStyles} >
                          <div>
                            <Spinner label="Estamos guardando los datos..." />
                          </div>
                        </Dialog>
                      </Stack>
                      <Stack>
                        <PrimaryButton
                          style={{display: this.state.viewModel.ShowSubmitButton ? "block" : "none"}}
                          text="Enviar a aprobación" 
                          allowDisabledFocus 
                          onClick={this.submit.bind(this)} 
                          disabled={!this.state.enableSubmit} />
                        <DefaultButton 
                          style={{display: this.state.viewModel.ShowRejectButton ? "block" : "none"}}
                          text="Rechazar" 
                          allowDisabledFocus 
                          onClick={this.reject.bind(this)}
                          disabled={!this.state.enableSubmit} />
                      </Stack>
                    </Stack>
                  </Stack>
                </div>

                {/* Fin Modal Bottom*/}
              </Shimmer>
            </Modal>
          </div>;
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

    private onCloseModal() {
      if(!this.state.viewModel.ReadOnlyForm) 
        this.setState({ hideModalConfirmationDialog: false });
      else 
        this.props.close();
    }

    private onNameChange (event: any, text?: string) {
      const client = this.state.viewModel.Entity.Client;

      this.setState((state) => {
        let newState = state as IPromoFormState;

        newState.promotionTitle = client && text ? client.Name + " - " + text : "Nueva promoción";
        newState.viewModel.Entity.Name = text;    

        return newState;
      });
    }

    private onActivityObjectiveChange(event: any, text: any) {
      this.setState((state) => {
        state.viewModel.Entity.ActivityObjective = text;    
        return state;
      });
    }

    private onClientChanged(item: IDropdownOption) {
        const clientId = item.key as number;

        this.setState((state) => {
            state.viewModel.Entity.Client = new Client({ ItemId: clientId, Name: item.text });
            return state;
        }, () => {
            this.state.viewModel.Entity.Items.map((promoItem: PromoItem, index: number) => {
                this.updateClientProductFields(index);
            });
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
        
        items.push(new PromoItem({
          AdditionalID: this.state.viewModel.Entity.PromoID + "." + index, 
          GetBaseGMSum: this.state.viewModel.Entity.GetBaseGMSum.bind(this.state.viewModel.Entity)
        }));        

        this.setState((state) => {
            let newState = state as IPromoFormState;
            newState.viewModel.Entity.Items = items;
            newState.selectedIndex = items.length - 1;
            return newState;
        });
    }

    private RemovePromoItem() {
        let items = this.state.viewModel.Entity.Items;

        items.splice(this.state.selectedIndex,1);

        items.map((item, index) => {
          item.AdditionalID = this.state.viewModel.Entity.PromoID + "." + (index + 1);
        });

        this.setState((state) => {
            let newState = state as IPromoFormState;
            newState.viewModel.Entity.Items = items;
            newState.selectedIndex = 0;
            newState.hideDeleteProductDialog = true;
            return newState;
        });        
    }

    private onTabLinkClicked(item?: PivotItem) {      
      if(item.props.itemKey == "ADD") {
        this.AddPromoItem();
      } else {
        this.changeSelectedItem(parseInt(item.props.itemKey));
      }
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
        const promoItem = this.state.viewModel.Entity.Items[this.state.selectedIndex];

        promoItem.Category = this.state.viewModel.Categories.filter(x => x.ItemId === item.key as number)[0];
        promoItem.Type = null;
        promoItem.Redemption = null;

        if(!promoItem.RequiresInvestment())
          promoItem.Investment = null;

        if(!promoItem.RequiresDiscountPerPiece())
          promoItem.DiscountPerPiece = null;

        this.setState((prevState) => { 
            let newState = prevState as IPromoFormState;

            newState.loadingTypes = true;
            newState.viewModel.Entity.Items[this.state.selectedIndex] = promoItem;

            return newState;
        }, () => {
            this.updateClientProductFields(this.state.selectedIndex);
        });        

        PromoService.GetTypesByCategory(promoItem.Category.ItemId).then((types: Type[]) => {
            this.setState((state) => {
                let newState = state as IPromoFormState;

                newState.loadingTypes = false;
                newState.viewModel.Types = types;

                return newState;
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
        const promoItem = this.state.viewModel.Entity.Items[this.state.selectedIndex];

        promoItem.Type = this.state.viewModel.Types.filter(x => x.ItemId === item.key as number)[0];
        promoItem.Redemption = null;        

        this.setState((state) => {            
            state.viewModel.Entity.Items[this.state.selectedIndex] = promoItem;
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
            state.viewModel.Entity.Items[this.state.selectedIndex].BusinessUnit = businessUnit.ItemId ? businessUnit : null;
            return state;
        });
    }

    private onBrandChanged(item: IDropdownOption) {        
        const brand = this.state.viewModel.Brands.filter(x => x.ItemId === item.key as number)[0];

        this.setState((state) => {  
            state.viewModel.Entity.Items[this.state.selectedIndex].Product = null;
            state.viewModel.Entity.Items[this.state.selectedIndex].Brand = brand.ItemId ? brand : null;
            return state;
        });
    }

    private onProductCategoryChanged(item: IDropdownOption) {        
        const productCategory = this.state.viewModel.ProductCategories.filter(x => x.ItemId === item.key as number)[0];

        this.setState((state) => {      
            state.viewModel.Entity.Items[this.state.selectedIndex].Product = null;      
            state.viewModel.Entity.Items[this.state.selectedIndex].ProductCategory = productCategory.ItemId ? productCategory : null;
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
        }, () => {
            this.updateClientProductFields(this.state.selectedIndex);
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

    private updateClientProductFields(itemIndex: number) {
      let promoItem = this.state.viewModel.Entity.Items[itemIndex];
      const client = this.state.viewModel.Entity.Client;        
      const product = promoItem.Product;        

      if(client && product) {
        ClientProductRepository.GetByClientAndProduct(client.ItemId, product.ItemId).then((item: ClientProduct) => {
          promoItem.NetPrice = promoItem.RequiresNetPrice() && item ? item.Price : null;
          promoItem.COGS = item ? item.COGS : null;

          this.setState((state) => {
            state.viewModel.Entity.Items[itemIndex] = promoItem;
            return state;
          });
        });

        LastYearVolumesRepository.GetByClientAndProduct(client.ItemId, product.ItemId).then((item: LastYearVolumes) => {
          this.setState((state) => {
            state.viewModel.Entity.Items[itemIndex].LastYearVolumes = item;
            return state;
          });
        });
      }
      else {
        promoItem.NetPrice = null;
        promoItem.COGS = null;

        this.setState((state) => {
          state.viewModel.Entity.Items[itemIndex] = promoItem;
          return state;
        });
      }
    }

    //#endregion

    //#region Input - Pre analisis

    private onDiscountPerPieceChange(event: any, text: any) {
        this.setState((state) => {
            state.viewModel.Entity.Items[this.state.selectedIndex].DiscountPerPiece = !isNaN(parseInt(text)) ? parseInt(text) : null;
            return state;
        });
    }

    private onRedemptionChange(event: any, text: any) {
      this.setState((state) => {
          state.viewModel.Entity.Items[this.state.selectedIndex].Redemption = !isNaN(parseInt(text)) ? parseInt(text) : null;    
          return state;
      });
    }

    private onBaseVolumeChange(event: any, text: any) {
      this.setState((state) => {
          state.viewModel.Entity.Items[this.state.selectedIndex].BaseVolume = !isNaN(parseInt(text)) ? parseInt(text) : null;    
          return state;
      });
    }

    private onAdditionalInvestmentChange(event: any, text: any) {
      this.setState((state) => {
          state.viewModel.Entity.Items[this.state.selectedIndex].AdditionalInvestment = !isNaN(parseInt(text)) ? parseInt(text) : null;    
          return state;
      });
    }

    private onEstimatedIncrementalVolumeChange(event: any, text: any) {
      this.setState((state) => {
          state.viewModel.Entity.Items[this.state.selectedIndex].EstimatedIncrementalVolume = !isNaN(parseInt(text)) ? parseInt(text) : null;    
          return state;
      });
    }

    //#endregion

    private save(): void {
      console.log(this.state.viewModel.Entity);

      this.setState({
          enableSubmit:false,
          hideSavingSpinnerConfirmationDialog:false
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

    private submit(): void {
      console.log(this.state.viewModel.Entity);

      if(!this.validateFormControls()) return;

      this.setState({
          enableSubmit:false,
          hideSavingSpinnerConfirmationDialog:false
      });

      PromoService.Submit(this.state.viewModel.Entity).then(() => {
          this.setState({
              formSubmitted: true,
              resultIsOK: true
          });
      }).catch((err) => {
          console.error(err);
          this.setState({ formSubmitted: true, errorMessage: err});
      });
    }

    private approve(): void {
      this.setState({
        enableSubmit:false,
      });

      PromoService.Approve(this.state.viewModel.Entity).then(() => {
        this.setState({
          formSubmitted: true,
          resultIsOK: true
        });
      }).catch((err) => {
        console.error(err);
        this.setState({ formSubmitted: true, errorMessage: err});
      });
    }

    private reject(): void {
      this.setState({
        enableSubmit:false,
      });

      PromoService.Reject(this.state.viewModel.Entity).then(() => {
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
            if(item.RequiresInvestment() && !(item.Investment > 0)) invalidCount++;
            if(item.Type == null) invalidCount++;
            if(item.BusinessUnit == null) invalidCount++;
            if(item.Brand == null) invalidCount++;
            if(item.Product == null) invalidCount++;
            if(item.ProductCategory == null) invalidCount++;
            if(!CommonHelper.IsDate(item.StartDate)) invalidCount++;
            if(!CommonHelper.IsDate(item.EndDate)) invalidCount++;
            if(item.RequiresDiscountPerPiece() && !(item.DiscountPerPiece > 0)) invalidCount++;
            if(item.RequiresRedemption() && !(item.Redemption > 0)) invalidCount++;
            if(!(item.BaseVolume > 0)) invalidCount++;
            if(!(item.EstimatedIncrementalVolume > 0)) invalidCount++;
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

  // New part

  private contentStyles = mergeStyleSets({
  header: [
    // eslint-disable-next-line deprecation/deprecation
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ]
  });
    
  private cancelIcon: IIconProps = { iconName: 'Cancel' };
  
  private iconButtonStyles = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: 'auto',
      marginTop: '4px',
      marginRight: '2px',
    },
    rootHovered: {
      color: theme.palette.neutralDark,
    },
  };
  
  private repetitiveSectionStyle: IStackStyles = {
    root: {
      minHeight: 320,
    },
  };
  
  private examplePersona: IPersonaSharedProps = {
    imageUrl: TestImages.personaMale,
    imageInitials: 'JS',
    text: 'John Smith',
    secondaryText: 'Cabeza de Canal',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
  };
  
  private examplePersona2: IPersonaSharedProps = {
    imageUrl: TestImages.personaFemale,
    imageInitials: 'AL',
    text: 'Annie Lindqvist',
    secondaryText: 'Gerente KAM',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
  };
  
  private verticalSeparatorStyle = {
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
  
  private confirmationDialogStyles = { main: { maxWidth: '450px' } };
    
  private _customPromotionPivotItemRenderer(promoID: string, link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element): JSX.Element {
    return (
      <Stack horizontal>
        {defaultRenderer(link)}
        <Label style={{ color: theme.palette.themePrimary }}><Icon iconName="DietPlanNotebook" /></Label>
        <Label>ID Promoción&nbsp;:&nbsp;</Label>
        <Label style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>{promoID}</Label>
      </Stack>
    );
  }
    
  private _customPromotionSummaryPivotItemRenderer(link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element): JSX.Element {
    return (
      <Stack horizontal>
        {defaultRenderer(link)}
        <Label style={{ color: theme.palette.themePrimary }}><Icon iconName="DietPlanNotebook" /></Label>
        <Label>Resumen General</Label>
      </Stack>
    );
  }
    
  private wrapperClass = mergeStyles({
    padding: 2,
    selectors: {
      '& > .ms-Shimmer-container': {
        margin: '10px 0',
      },
    },
  });

  private getCustomShimmerElementsGroup = (): JSX.Element => {
    return (
      <div style={{ display: 'flex' }} className={this.wrapperClass}>
        {/* <ShimmerElementsGroup
          shimmerElements={[
            { type: ShimmerElementType.gap, width: 10, height: 80 },
            { type: ShimmerElementType.circle, height: 80 },
            { type: ShimmerElementType.gap, width: 10, height: 80 },
          ]}
        /> */}
        {/* <ShimmerElementType
          flexWrap
          className="padding"
          shimmerElements={[
            { type: ShimmerElementType.line, width: 360, height: 30 },
              { type: ShimmerElementType.gap, width: 30, height: 30 },
              { type: ShimmerElementType.line, width: 360, height: 30 },
              { type: ShimmerElementType.gap, width: 30, height: 30 },
              { type: ShimmerElementType.line, width: 360, height: 30 },
            // { type: ShimmerElementType.line, width: 500, height: 20 },
          ]}
        /> */}
      </div>
    );
  }

  private deleteProductDialogContentProps = {
    type: DialogType.normal,
    title: 'Eliminar producto',
    closeButtonAriaLabel: 'Cerrar',
    subText: 'Esta seguro que desea eliminar este producto de la promoción?',
  };

  private closeModalDialogContentProps = {
    type: DialogType.normal,
    title: 'Salir sin guardar',
    closeButtonAriaLabel: 'Cerrar',
    subText: 'Esta seguro que desea cerrar el formulario sin guardar?',
  };

  private savingSpinnerModalDialogContentProps = {
    type: DialogType.largeHeader,
  };
}