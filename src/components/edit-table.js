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
    constructor(props,context) {
        super(props);
        this.state = {
          selectedProgData:[]
        };
    }

    componentWillMount () {
        this.subscription = (
            this.context.programObservable
            .subscribe(
                selectedProg =>{ this.subscriptionHandler(selectedProg); },
                error => console.log('onError : ', error),
                () => console.log('Subscription Completed')
        ))
    }

    componentWillUnmount () {
        this.subscription.dispose();
    }

    shouldComponentUpdate (nextProps, nextState) {
        if(JSON.stringify(this.state.selectedProgData)!=JSON.stringify(nextState.selectedProgData))
            return true;
        return false;
    }

    subscriptionHandler (subscriptionObj) {
        let selectedProg = subscriptionObj.selectedProg;
        console.log(selectedProg);
        let attributeRow = [], index = 0;
        this.context.d2.models.program.get(selectedProg,{paging:false,fields:'trackedEntity,programTrackedEntityAttributes[id,mandatory,valueType,trackedEntityAttribute[id,name,optionSet[id,name,options[id,name]]]]'}).then(function(output){
        output.programTrackedEntityAttributes.forEach(
            programTrackedEntityAttributeSingle => {
            index++;
            let attributeColData = {};
            attributeColData.id=programTrackedEntityAttributeSingle.trackedEntityAttribute.id;
            console.log(attributeColData.id);
            attributeColData.name = programTrackedEntityAttributeSingle.trackedEntityAttribute.name;
            if(!!programTrackedEntityAttributeSingle.trackedEntityAttribute.optionSet)
            {
                attributeColData.type="optionSet";
                attributeColData.options=[];
                programTrackedEntityAttributeSingle.trackedEntityAttribute.optionSet.options.forEach(
                (optionValue,idx) => {
                    let optionJSON = {};
                    optionJSON.id=idx+1;
                    optionJSON.displayName=optionValue.name;
                    attributeColData.options.push(optionJSON);
                    }
                )
            }
            else
                attributeColData.type=programTrackedEntityAttributeSingle.valueType;

            attributeColData.required=programTrackedEntityAttributeSingle.mandatory;
            attributeRow.push(attributeColData);
            if(index==output.programTrackedEntityAttributes.size)
            {
                attributeRow.push({
                    name:"Register",
                    type:"button",
                    id:output.trackedEntity.id,
                    label:"Save",
                    required:true,
                    cellStyle:{
                        position:'absolute',
                        right:'0',
                        width:152,
                        backgroundColor:'white',
                        borderLeft:'solid 1px #bdbdbd',
                        zIndex:1,
                        paddingTop:0,
                        textAlign:'center',
                        paddingLeft:24,
                        paddingRight:24,
                    }
                });
                attributeRow.programId=selectedProg;
                attributeRow.trackedEntityId=output.trackedEntity.id;
                // attributeRow.id=output.trackedEntity.id;
                attributeRow.orgUnit = subscriptionObj.selectedOrg;
                this.setState({selectedProgData:attributeRow})
            }
        })
    }.bind(this));
}

    renderHeader() {
        const headerStyle = {
            width:'152',
            textAlign: 'left'
        }

        return ( this.state.selectedProgData.map((cell,id) => {
            let headerPosStyle = cell.label == 'Save' ? {paddingTop:20,display:'block'} : {};
            let cellStyle= !!cell.cellStyle ? cell.cellStyle :headerStyle;
            return (
                <TableHeaderColumn
                    style={cellStyle}
                    key={id}>
                    <span style={headerPosStyle}>{cell.name}</span>
                </TableHeaderColumn>
            )
        }))
}

    render() {
        const bodyStyles= {
            overflowX:'visible',
            width: this.state.selectedProgData.length*200
        }
        let index=1;
        return(
            this.state.selectedProgData.length>0 &&
            <div style={this.props.style}>
            <Table {...this.props.tableProps} bodyStyle={bodyStyles} style={{width:this.state.selectedProgData.length*200}}>
                <TableHeader {...this.props.tableHeaderProps} >
                    <TableRow>
                        {this.renderHeader()}
                    </TableRow>
                </TableHeader>
                <TableBody {...this.props.tableBodyProps}>
                    {times(this.props.rowCount,function () {
                    return (
                    <CompositeRow
                        key={index++}
                        obs ={this.context.programObservable}
                        rowData={this.state.selectedProgData}
                        {...this.props}/>
                    )
                    }.bind(this))}
                </TableBody>
            </Table>
            </div>
        )
    }
}

EditTable.propTypes = {
    style : React.PropTypes.object.isRequired,
    tableProps: React.PropTypes.object,
    tableHeaderProps: React.PropTypes.object,
    tableBodyProps: React.PropTypes.object,
    rowCount: React.PropTypes.number,
};
EditTable.defaultProps = {rowCount:1};
EditTable.contextTypes = { d2: React.PropTypes.object , programObservable: React.PropTypes.object };
