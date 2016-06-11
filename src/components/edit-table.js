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

export default class EditTable extends React.Component {

    constructor(props) {
        super(props);
    }

    renderHeader() {
        return ( this.props.data.map((cell,id) => {
            return (
                <TableHeaderColumn style={{width:100}} key={id}>{cell.name}</TableHeaderColumn>
            )

        }))
    }

    renderRow =() => (
 this.props.data.map((cell,id) =>
             (
                <TableRowColumn style={{width:100}} key={id}>{cell.name}</TableRowColumn>
            )

        )
    )
    render() {
        const bodyStyles= {
            overflowX:'visible',
            width: this.props.data.length*150
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
                      <RowComponent key={index} data={this.props.data} />
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
    data: React.PropTypes.array.isRequired,
    rowCount: React.PropTypes.number,
};
EditTable.defaultProps = {rowCount:1};
EditTable.contextTypes = {};
