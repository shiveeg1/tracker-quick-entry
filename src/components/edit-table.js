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
            selectedProgData:{
                headers:[],
                programStages:[],
            }
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
        if(this.state.selectedProgData.programId!=nextState.selectedProgData.programId)
            return true;
        return false;
    }

    subscriptionHandler (subscriptionObj) {
        let selectedProg = subscriptionObj.selectedProg;
        let programData = {};
        let attributeRow = [];
        let programStages = [];
        let index = 0;
        if(selectedProg!="null"){
        this.context.d2.models.program.get(selectedProg,{paging:false,fields:'trackedEntity,programTrackedEntityAttributes[id,mandatory,valueType,trackedEntityAttribute[id,name,optionSet[id,name,options[id,name]]]],programStages[id,name]'}).then(function(output){
        output.programStages.forEach(
            singleStage => {
                let stageJSON = {};
                stageJSON.id=singleStage.id;
                stageJSON.displayName=singleStage.name;
                programStages.push(stageJSON);
            }
        )
        output.programTrackedEntityAttributes.forEach(
            programTrackedEntityAttributeSingle => {
            index++;
            let attributeColData = {};
            attributeColData.id=programTrackedEntityAttributeSingle.trackedEntityAttribute.id;
            attributeColData.name = programTrackedEntityAttributeSingle.trackedEntityAttribute.name;
            if(!!programTrackedEntityAttributeSingle.trackedEntityAttribute.optionSet)
            {
                attributeColData.type="optionSet";
                attributeColData.options=[];
                programTrackedEntityAttributeSingle.trackedEntityAttribute.optionSet.options.forEach(
                (optionValue,idx) => {
                    let optionJSON = {};
                    optionJSON.id=idx+2;
                    optionJSON.displayName=optionValue.name;
                    attributeColData.options.push(optionJSON);
                    }
                )
                attributeColData.options.unshift({id:"placeholder",displayName:"Select Option",disabled:true});
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
                        right:0,
                        width:152,
                        backgroundColor:'white',
                        borderTop:'solid 1px #bdbdbd',
                        borderLeft:'solid 1px #bdbdbd',
                        zIndex:1,
                        paddingTop:0,
                        marginTop:-1,
                        textAlign:'center',
                        paddingLeft:24,
                        paddingRight:24,
                    }
                });
                programData.programId=selectedProg;
                programData.trackedEntityId=output.trackedEntity.id;
                programData.orgUnit = subscriptionObj.selectedOrg;
                programData.headers = attributeRow;
                programStages.unshift({id:'placeholder',displayName:'Select Program Stage',disabled:true})
                programData.programStages = programStages;
                this.setState({selectedProgData:programData})
            }
        })}.bind(this))
        .catch(err => {
            log.error('Failed to load selected Program data ',err);
        });
        } else {
            this.setState({
                selectedProgData : {
                    headers:[],
                    programStages:[],
                }
            });
        }
    }

    renderHeader() {
        const headerStyle = {
            width:'152',
            textAlign: 'left'
        }

        return ( this.state.selectedProgData.headers.map((cell,id) => {
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

    _topScroll() {
        if (this.flag) {
            this.flag = !this.flag;
            document.getElementsByClassName('scroll-wrapper')[0].scrollLeft =
                document.getElementsByClassName('scroll-basic')[0].firstChild.scrollLeft
        } else {
            this.flag = !this.flag;
        }

    }
    _bottomScroll() {
        if (this.flag) {
            this.flag = !this.flag;
            document.getElementsByClassName('scroll-basic')[0].firstChild.scrollLeft =
                document.getElementsByClassName('scroll-wrapper')[0].scrollLeft;
        } else {
            this.flag = !this.flag;
        }
    }

    render() {
        const styles = {
            bodyStyles: {
                overflowX:'visible',
                width: this.state.selectedProgData.headers.length*200
            },
            scrollWrapperStyle: {
                overflowX:"auto",
                overflowY:"hidden",
                height:"20px",
                marginBottom:"-20px",
                marginLeft:"10px",
            },
            scrollDivStyle: {
                width: this.state.selectedProgData.headers.length*200,
                display:"block",
                height:"20px"
            }
        }

        let index=1;
        return(
            this.state.selectedProgData.headers.length>0 &&
            <div>
                <div className="scroll-wrapper" style={styles.scrollWrapperStyle} onScroll={this._bottomScroll.bind(this)}>
                    <div style={styles.scrollDivStyle}></div>
                </div>
                <div style={this.props.style}>
                <div className="scroll-basic" onScroll={this._topScroll.bind(this)}>
                    <Table {...this.props.tableProps} bodyStyle={styles.bodyStyles} style={{width:this.state.selectedProgData.headers.length*200}}>
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
                </div>
            </div>
        )
    }
}
// TODO add selectedProgData propTypes
EditTable.propTypes = {
    style : React.PropTypes.object.isRequired,
    tableProps: React.PropTypes.object,
    tableHeaderProps: React.PropTypes.object,
    tableBodyProps: React.PropTypes.object,
    rowCount: React.PropTypes.number,
};
EditTable.defaultProps = {rowCount:1};
EditTable.contextTypes = { d2: React.PropTypes.object , programObservable: React.PropTypes.object };
