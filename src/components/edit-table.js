import React from 'react';
//material-ui
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/lib/table';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
//d2-ui
import CheckBox from 'd2-ui/lib/form-fields/check-box';
//loadash
import times from 'lodash.times';
//App
import RowComponent from './table-row';
import CompositeRow from './super-row';

/*  TODO handle "required- true/false" fields
    TODO programStages
    TODO validations for fields */
export default class EditTable extends React.Component {

    constructor(props) {
        super(props);
    }

    renderHeader() {
        const headerStyle = {
            width:100,
            textAlign: 'center'
        }

        return ( this.props.data.headers.map((cell,id) => {
            return (
                <TableHeaderColumn style={headerStyle} key={id}>{cell.name}</TableHeaderColumn>
            )

        }))
    }

    render() {
        const bodyStyles= {
            overflowX:'visible',
        width: this.props.data.headers.length*150
        }
        return(
            <Table {...this.props.tableProps} bodyStyle={bodyStyles}>
                <TableHeader {...this.props.tableHeaderProps} >
                  <TableRow>
                     {this.renderHeader()}
                  </TableRow>
                </TableHeader>
                <TableBody {...this.props.tableBodyProps} >
                  {times(this.props.rowCount,(index) => (
                      <CompositeRow key={index} {...this.props}/>
                  ))}
                </TableBody>
            </Table>
        )
    }
}

EditTable.propTypes = {
    tableProps: React.PropTypes.object,
    tableHeaderProps: React.PropTypes.object,
    tableBodyProps: React.PropTypes.object,
    data: React.PropTypes.object.isRequired,
    rowCount: React.PropTypes.number,
};
EditTable.defaultProps = {rowCount:1};
EditTable.contextTypes = {};
