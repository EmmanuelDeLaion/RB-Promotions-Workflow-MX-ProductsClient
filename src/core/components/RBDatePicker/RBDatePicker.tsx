import * as React from 'react';
import { DatePicker, DayOfWeek, Label } from "office-ui-fabric-react";
import { Constants } from '../../Constants';
import { CommonHelper } from '../../common/CommonHelper';

interface IRBDatePickerProps {
    label: string;
    required: boolean;
    onSelectDate: (date: Date) => void;
    value: Date;
    errorMessage?: string; 
    minDate?: Date;
    maxDate?: Date;
}

export class RBDatePicker extends React.Component<IRBDatePickerProps, {}> {

    constructor(props: IRBDatePickerProps) {
        super(props);
    }

    public render(): React.ReactElement<IRBDatePickerProps> {
        return (
            <div className={CommonHelper.IsNullOrEmpty(this.props.errorMessage) ? "" : "datePickerError"}>
                <Label required={this.props.required}>{this.props.label}</Label>
                <DatePicker
                    firstDayOfWeek={DayOfWeek.Monday}
                    strings={Constants.Miscellaneous.DayPickerStrings}
                    placeholder="Seleccione una fecha..."
                    ariaLabel="Seleccione una fecha"
                    value={this.props.value}
                    onSelectDate={this.onSelectDate.bind(this)}   
                    formatDate={CommonHelper.formatDate}
                    minDate={this.props.minDate}
                    maxDate={this.props.maxDate}
                />
                <div hidden={CommonHelper.IsNullOrEmpty(this.props.errorMessage)} role="alert" className="errorMessage">{this.props.errorMessage}</div>
            </div>
        );
    }

    private onSelectDate(date: Date | null | undefined) {
        this.props.onSelectDate(date);
    }
}