import * as React from 'react';
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
  Label,
  Modal,
  IconButton,
  Dialog,
  Stack,
  Persona,
  PersonaSize,
  Link,
  Icon,
  mergeStyles,
  getTheme,
  IStackStyles,
  FontWeights,
  mergeStyleSets,
  Spinner,
  DialogType,
  IIconProps
} from 'office-ui-fabric-react';


import styles from './ListTaskToDo.module.scss';
import { _Item } from '@pnp/sp/items/types';
import { IListTaskToDoProps } from './IListTaskToDoProps';
import { IListTaskToDoState } from './IListTaskToDoState';
import { initializeTheme } from '../PromoForm/Theme';
import { PromoRepository } from '../../data/PromoRepository';
import { ClientRepository } from '../../data/ClientRepository';
import { Promos } from '../../model/Promo/Promos';
import { SecurityHelper } from '../../common/SecurityHelper';
initializeTheme();
const theme = getTheme();

export class ListTaskToDo extends React.Component<IListTaskToDoProps, IListTaskToDoState> {

  constructor(props: IListTaskToDoProps) {
    super(props);
    this.state = {
      currentUser: null,
      flowApproval: false,
      formSubmitted: false,
      hasValidationError: false,
      isLoading: true,
      mainModalOpen: true,
      promoProven: false,
      promotionTitle: null,
      resultIsOK: false,
      hideLoading: false,
      promos: []
    };
  }


  async GetUser() {
    const user = await SecurityHelper.GetCurrentUser();
    if (user) {
      this.setState({
        currentUser: user.Value
      });
    }
    else {
      this.setState({
        currentUser: ""
      });
    }
  }

  public async componentDidMount() {
    this.GetUser();
    PromoRepository.GetAllPromos().then((promos: any) => {
      this.setState({
        promos: promos
      });

      this.setState({
        isLoading: false
      });
    });

  }

  public render(): React.ReactElement<IListTaskToDoProps> {

    let output =
      <DialogContent
        title={this.props.title}
        subText="Cargando pendientes..."
        onDismiss={this.onCloseModal.bind(this)}
        showCloseButton={true}>
        <div className={styles.promoList}>
          <Shimmer
            width="100%"
            styles={this._getShimmerStyles}
          />
        </div>
      </DialogContent>;

    if (!this.state.isLoading) {
      output =
        <div className={styles.promoList} >
          <Modal isOpen={this.state.mainModalOpen}>
            <div
              className={this.contentStyles.header}>
              <span>Mis pendientes</span>
              <IconButton
                styles={this.iconButtonStyles}
                iconProps={this.cancelIcon}
                ariaLabel="Close popup modal"
                onClick={this.onCloseModal.bind(this)}
                autoFocus={false}
              />
            </div>
            <div style={{ padding: '15px', lineHeight: '1px' }}>
              <h5>Hola,</h5>
              <h3>{this.state.currentUser}</h3>
              <p>Estas son algunas promociones por atender</p>
            </div>
            <div className={styles.wrapper}>
              <table className={styles.table}>
                <tr className={styles.row + styles.header}>
                  <th className={styles.cell}>Link</th>
                  <th className={styles.cell}>Nombre de la promoción</th>
                  <th className={styles.cell}>Cliente</th>
                  <th className={styles.cell}>Fecha de comienzo</th>
                  <th className={styles.cell}>Fecha fin</th>
                  <th className={styles.cell}>Estado</th>
                </tr>
                {
                  this.state.promos.map((value: Promos, index: any) => {
                    let dt = new Date(value.StartDate);
                    let dateFormat = new Date(dt.toISOString());
                    let dateStartDate = `${dateFormat.getDay()}/${dateFormat.getUTCMonth()}/${dateFormat.getUTCFullYear()}`;
                    let dt2 = new Date(value.EndDate);
                    let dateFormat2 = new Date(dt2.toISOString());
                    let dateEndDate = `${dateFormat2.getDay()}/${dateFormat2.getUTCMonth()}/${dateFormat2.getUTCFullYear()}`;
                    return (
                      <tr key={index} className={styles.row}>
                        <td className={styles.cell}>{value.Title}</td>
                        <td className={styles.cell}>{value.Name}</td>
                        <td className={styles.cell}>{value.Client.Name}</td>
                        <td className={styles.cell}>{dateStartDate}</td>
                        <td className={styles.cell}>{dateEndDate}</td>
                        <td className={styles.cell}>
                          <span style={value.Status === "Aprobada" ? this.badgeApproved : this.badge}>
                            {value.Status}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                }
              </table>
            </div>
          </Modal >
        </div >;
    }

    return output;
  }


  private onCloseModal() {
    this.props.close();
    window.location.reload();
  }


  public getDatea(date: string): string {
    let dt = new Date(date);
    let dateFormat = new Date(dt.toISOString());
    let dateFormatResult = `${dateFormat.getDay()}/${dateFormat.getUTCMonth()}/${dateFormat.getUTCFullYear()}`;
    return dateFormatResult;
  }


  // STYLES
  private _getShimmerStyles = (_props: IShimmerStyleProps): IShimmerStyles => {
    return {
      shimmerWrapper: [
        {
          backgroundColor: '#deecf9',
          backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, #c7e0f4 50%, rgba(255, 255, 255, 0) 100%)'
        }
      ]
    };
  }

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
        padding: '12px 12px 12px 24px',
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

  private badgeApproved = {
    borderRadius: '5px',
    padding: '5px',
    backgroundColor: '#f31078',
    color: '#ffffff'
  }

  private badge = {
    borderRadius: '5px',
    padding: '5px',
    backgroundColor: 'rgb(90, 90, 90)',
    color: '#ffffff'
  }



}
