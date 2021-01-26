import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import * as React from 'react';
import { CommonHelper } from '../../../core/common/CommonHelper';
import { PromoFormDialog } from '../../../core/components/PromoForm';
import { Link } from 'office-ui-fabric-react';
import { IPromoFormListViewProps } from './IPromoFormListViewProps';

const LOG_SOURCE: string = 'PromoFormListView';

export default class PromoFormListView extends React.Component<IPromoFormListViewProps, {}> {
  @override
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: PromoFormListView mounted');
  }

  @override
  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: PromoFormListView unmounted');
  }

  private linkStyle = {
    fontSize: "14px",
    color: "#323130"
  };

  @override
  public render(): React.ReactElement<{}> {
    return (
      <div>
        <Link 
          style={this.linkStyle}
          onClick={() => this.openPromoFormDialog()}>Abrir promoción</Link>
      </div>
    );
  }

  private openPromoFormDialog(): void{
    var dialog: PromoFormDialog = new PromoFormDialog(parseFloat(this.props.itemId));
    //dialog.title = "Nueva promoción";
    dialog.context = this.props.context;
    dialog.show();
  }
}
