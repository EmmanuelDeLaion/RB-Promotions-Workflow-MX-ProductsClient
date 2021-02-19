import * as React from 'react';
import Select from 'react-select';
import { Label } from "office-ui-fabric-react";
import { Product } from '../../model/Common';
import { CommonHelper } from '../../common/CommonHelper';

interface IProductSelectorProps {
    products: Product[];
    onChanged: (product: Product) => void;
    value: Product;
    errorMessage: string;
    required: boolean;
}

export class ProductSelector extends React.Component<IProductSelectorProps, {}> {

    constructor(props: IProductSelectorProps) {
        super(props);
    }

    public render(): React.ReactElement<IProductSelectorProps> {
        const options: Array<{ value: number, label: string }> =
            this.props.products != null ?
                (this.props.products as Array<Product>).map((item): { value: number, label: string } => {
                    return { value: item.ItemId, label: item.SKUNumber + " - " + item.SKUDescription };
                }) : [];

        const value = this.props.value ? options.filter(x => x.value === this.props.value.ItemId)[0] : null;

        const selectStyles = {
            control: (styles: any) => ({ 
                ...styles, 
                borderColor: (CommonHelper.IsNullOrEmpty(this.props.errorMessage) ? "rgb(96, 94, 92)" : "rgb(164, 38, 44)") + " !important",
                minHeight: "32px",
                boxShadow: "0"
            }),
            valueContainer: (styles: any) => ({ ...styles, padding: "0px 8px" }),
            indicatorSeparator: (styles: any) => ({ ...styles, display: "none" }),
            dropdownIndicator: (styles: any) => ({ ...styles, padding: "2px 8px", color: "hsl(0,0%,80%) !important" }),
            menu: (styles: any) => ({ ...styles, marginTop: "0" }),
            menuList: (styles: any) => ({ ...styles, paddingTop: "0" }),
            option: (styles: any) => ({ ...styles, color: "inherit" }),
        };

        const selectTheme = (theme: any) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "rgb(243, 242, 241)",
              primary: "rgb(225, 223, 221)",
              primary50: "rgb(243, 242, 241)"
            },
        });

        return (
            <div>
                <Label required={this.props.required}>SKU: </Label>
                <Select 
                    options={options} 
                    theme={selectTheme}
                    styles={selectStyles}
                    onChange={this.onChange.bind(this)} 
                    value={value}
                />
                <div hidden={CommonHelper.IsNullOrEmpty(this.props.errorMessage)} role="alert" className="errorMessage">{this.props.errorMessage}</div>
            </div>
        );
    }

    private onChange(item: any, action: any) {
        this.props.onChanged(item.value);
    }
}