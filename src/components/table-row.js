import React from 'react';

// material-ui
import {TableRow, TableRowColumn} from 'material-ui/lib/table';
import TextField from 'material-ui/lib/TextField';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Toggle from 'material-ui/lib/toggle';
import ActionDone from 'material-ui/lib/svg-icons/action/done';
import Create from 'material-ui/lib/svg-icons/content/create';
import Error from 'material-ui/lib/svg-icons/alert/error';
import IconButton from 'material-ui/lib/icon-button';
import RaisedButton from 'material-ui/lib/raised-button';

//App
import HackyDropdown from './drop-down';

export default class RowComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({},{
            rowValues: [],
            status: <Create />
        });
        this.props = props;
    }

    _handleChange = (id,cell) => {
        let row = this.state.rowValues;
        let type = cell.type;
        switch (type) {
            case 'date': return (
                function(event,date) {
                    row[id] = date;
                    this.setState({
                        rowValues:row
                    });
                }
            )
                break;
            case 'textbox': return (
                function(event) {
                    row[id] = event.target.value;
                    this.setState({
                        rowValues: row
                    });
                }
            )
            break;
            case 'numeric': return (
                function(event) {
                    row[id] = event.target.value;
                    this.setState({
                        rowValues: row
                    });
                }
            )
            break;
            case 'optionSet': return (
                function(obj) {
                    row[id] = cell.options[obj.target.value-1].displayName;
                    this.setState({
                        rowValues: row
                    });
                }
            )
            break;
            default: return (
                function(event) {
                    row[id] = event.target.value;
                    this.setState({
                        rowValues: row
                    });
                }
            )
        }
    }

    _validateRow() {
        // TODO validate required feilds and save on server
        console.log("validated and saved");
        this.setState({
            status: <ActionDone iconStyle={{color: '#00bcd4'}}/>
        })
    }

    renderRow() {
        return (
            this.props.data.map((cell,id) => {
                let component= {};
                switch (cell.type) {
                    case 'date':
                        component = <DatePicker autoOk={true} onChange={this._handleChange(id,cell).bind(this)}/>;
                        break;
                    case 'numeric':
                        component = <TextField onBlur={this._handleChange(id,cell).bind(this)}/>;
                        break;
                    case 'textbox':
                        component = <TextField onBlur={this._handleChange(id,cell).bind(this)}/>;
                        break;
                    case 'optionSet':
                        component =
                                    <HackyDropdown value='dropValue'
                                        onChange={this._handleChange(id,cell).bind(this)}
                                        menuItems={cell.options}
                                        includeEmpty={true}
                                        emptyLabel='Select Program' />
                        break;
                    case 'boolean':
                        component = <Toggle />
                        break;
                    case 'icon':
                        component = <IconButton>
                                        {this.state.status}
                                    </IconButton>
                        break;
                    case 'button':
                        component = <RaisedButton label="Save" primary={true} backgroundColor="#00bcd4" onMouseDown={this._validateRow.bind(this)}/>
                        break;
                    default:
                        component = <TextField />;

                }
                return (
                    <TableRowColumn key={id}>
                        {component}
                    </TableRowColumn>
                )
            }
        ))
    }

    render() {
        return(
            <TableRow key={this.props.key}>
              {this.renderRow()}
            </TableRow>
        )
    }
};

RowComponent.propTypes = {
    data: React.PropTypes.array.isRequired,
    index: React.PropTypes.number,
};
RowComponent.defaultProps = { key: 'null'};
RowComponent.childContextTypes = {};
