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
            width:'auto',
            textAlign: 'left'
        }

        return ( this.props.data.headers.map((cell,id) => {
            let headerPosStyle = cell.label == 'Save' ? {paddingTop:20,display:'block'} : {};
            let cellStyle= !!cell.cellStyle ? cell.cellStyle :headerStyle;
            return (
                <TableHeaderColumn style={cellStyle} key={id}><span style={headerPosStyle}>{cell.name}</span></TableHeaderColumn>
            )

        }))
    }

    render() {
        const bodyStyles= {
            overflowX:'visible',
        width: this.props.data.headers.length*150
        }
        let index=1;
        return(
            <Table {...this.props.tableProps} bodyStyle={bodyStyles} style={{width:this.props.data.headers.length*150}}>
                <TableHeader {...this.props.tableHeaderProps} >
                  <TableRow>
                     {this.renderHeader()}
                  </TableRow>
                </TableHeader>
                <TableBody {...this.props.tableBodyProps} >
                  {times(this.props.rowCount,function () {
                      return (
                        <CompositeRow key={index++} {...this.props}/>
                      )

                  }.bind(this))}
                </TableBody>
            </Table>
        )
    }
}

EditTable.propTypes = {
    tableProps: React.PropTypes.object,
    tableHeaderProps: React.PropTypes.object,
    tableBodyProps: React.PropTypes.object,
    data: React.PropTypes.shape({
        headers: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            type: React.PropTypes.string.isRequired,
            required: React.PropTypes.bool
        })).isRequired,
        programStages: React.PropTypes.array
    }).isRequired,
    rowCount: React.PropTypes.number,
};
EditTable.defaultProps = {rowCount:1};
EditTable.contextTypes = {};
