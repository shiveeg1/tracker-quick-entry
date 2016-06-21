import React from 'react';

// material-ui
import {TableRow, TableRowColumn} from 'material-ui/lib/table';
import FontIcon from 'material-ui/lib/font-icon';

//d2-ui
import { wordToValidatorMap } from 'd2-ui/lib/forms/Validators';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';

//App
import ComponentCategories from './componentCategories';

/*
TODO fix multiple handleChange calls
*/
export default class RowComponent extends React.Component {
    constructor(props,context) {
        super(props);
        this.context = context;
        this.state = Object.assign({},{
            rowValues: [],
            status: <FontIcon className="material-icons" color={this.context.muiTheme.rawTheme.palette.primary1Color}>mode_edit</FontIcon>,
            statusColor: this.context.muiTheme.rawTheme.palette.primary1Color
        });
        this.props = props;
    }

    _handleChange = (id,cell,info) => {
        let row = this.state.rowValues;
        let type = cell.type;
        switch (type) {
            case 'date':
                    row[id] = info[1];
                    this.setState({
                        rowValues:row
                    });
                break;
            case 'textbox':
                    row[id] = info[0].target.value;
                    this.setState({
                        rowValues: row
                    });

            break;
            case 'numeric':
                    row[id] = info[0].target.value;
                    this.setState({
                        rowValues: row
                    });

            break;
            case 'optionSet':
                    row[id] = cell.options[info[0].target.value-1].displayName;
                    this.setState({
                        rowValues: row
                    });
            break;
            default:
                    row[id] = info[0].target.value;
                    this.setState({
                        rowValues: row
                    });
        }
    }

    _handleButtonClick() {
        this.props.expandToggle();
        this.setState({
            status: <FontIcon className="material-icons">done</FontIcon>,
            statusColor: this.context.muiTheme.rawTheme.palette.successColor
        })
    }

    _handleUpdateFeild() {
        // TODO validate required feilds and save on server
        console.log("feild updated");
    }

    renderRow() {
        let hc = null;
        const buttonColor = this.context.muiTheme.rawTheme.palette.primary1Color;
        return (
            this.props.data.map((cell,id) => {
                hc = function(){this._handleChange(id,cell,arguments)}.bind(this);
                let component = ComponentCategories(cell,id,hc);
                let cellStyle= {};
                component.value = this.state.rowValues[id];
                if(component.name === 'button') {
                    cell.label = cell.label === 'null' ? this.props.label : cell.label
                    component.props.labelStyle = {color:this.context.muiTheme.rawTheme.palette.primary1Color};
                    component.props.onClick=this._handleButtonClick.bind(this);
                    component.props.label=cell.label;
                    component.props.style = {color:this.state.statusColor,marginTop:5}
                    component.props.icon = this.state.status;
                    cellStyle= cell.cellStyle;
                }
                else if (component.name ==='icon') {
                    component.props.children = this.state.status;
                }
                let fields = [component];
                return (
                    <TableRowColumn key={id} style={cellStyle}>
                        <FormBuilder key={id} fields={fields} onUpdateField={this._handleUpdateFeild} />
                    </TableRowColumn>
                )
            }
        ))
    }

    render() {
        return(
            <TableRow key={this.props.key} style={{backgroundColor:'aliceBlue'}}>
              {this.renderRow()}
            </TableRow>
        )
    }
};

RowComponent.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        required: React.PropTypes.bool,
        cellStyle: React.PropTypes.object,
        label: React.PropTypes.string
    })).isRequired,
    index: React.PropTypes.number,
};
RowComponent.defaultProps = {label:"Save"};
RowComponent.contextTypes = {muiTheme: React.PropTypes.object.isRequired};
