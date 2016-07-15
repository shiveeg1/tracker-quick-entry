import React from 'react';
import times from 'lodash.times';
import log from 'loglevel';
// material-ui
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/lib/table';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/lib/card';
import Snackbar from 'material-ui/lib/snackbar';
import FontIcon from 'material-ui/lib/font-icon';
//App
import ProgramStageDropDown from './drop-down';
import ComponentCategories from './componentCategories';
import StageTabs from './stage-tabs';
//d2-ui
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import dhis2 from 'd2-ui/lib/header-bar/dhis2';
import { isRequired } from 'd2-ui/lib/forms/Validators';
/*
TODO collapse option icon
TODO change stageData state structure accordingly. Maybe array of objects
*/
export default class CompositeRow extends React.Component {
    constructor(props,context){
    	super(props,context);

    	this.state = {
    		rowValues: [],
            saved: null,
            fabClicked: false
    	};
        this.d2 = context.d2;
    	this.props = props;
        this.context=context;
    }

    componentWillReceiveProps() {
        this.setState({
		    rowValues:[],
            saved: null,
            fabClicked: false
	    })
      }

    getTodayDate() {
        let today = new Date();
        let year = (today.getFullYear()).toString();
        let month = (today.getMonth() + 1) < 10 ? "0"+(today.getMonth()+1) : (today.getMonth()+1).toString();
        let date = today.getDate() < 10 ? "0"+today.getDate() : (today.getDate()).toString();
        let todayDate = year+"-"+month+"-"+date;
        return todayDate;
    }

    handleEnroll(instanceId) {
        let enrollObj = {};
        enrollObj["trackedEntityInstance"] = instanceId;
        enrollObj["program"] = this.props.rowData.programId;
        enrollObj["status"] = "ACTIVE";
        enrollObj["orgUnit"] = this.props.rowData.orgUnit;

        enrollObj["enrollmentDate"] = this.getTodayDate();
        enrollObj["incidentDate"] = this.getTodayDate();

        let ifenroll = true;
        if(ifenroll) {
            this.context.d2.Api.getApi().post("enrollments",enrollObj)
            .then(response => {
                let enrollId= response.response.importSummaries[0].reference;
                console.log("enrol id : "+enrollId);
                this.setState({
                    saved: true,
                })
            })
            .catch(err => {
                log.warn('Failed to enroll TEI instance:', err.message ? err.message : err);
                this.setState({
                    saved: false,
                })
            });
        }
     }

    registerTEI(attributeList) {
        let registerPayload = {};
        registerPayload["attributes"] = attributeList;
        registerPayload["trackedEntity"] = this.props.rowData.trackedEntityId;
        registerPayload["orgUnit"] = this.props.rowData.orgUnit;
        let regFlag = true;
        if(regFlag) {
            this.d2.Api.getApi().post("trackedEntityInstances",registerPayload)
            .then(response => {
                let instanceId = response.response.reference;
                this.handleEnroll(instanceId);
            })
            .catch(err => {
                log.warn('Failed to register TEI instance:', err.message ? err.message : err);
                this.setState({
                    saved: false,
                })
            });
            this.setState({
                saved: true,
            })
        }
    }

    _handleButtonClick() {
        let storedVals = this.state.rowValues;
        let currentStateValues = this.state.rowValues;
        let attributeList = [];
        let headerCells = this.props.rowData.headers;
        let completeForm = true;
        let size = this.props.rowData.headers.length-1;
        let i = 0;
        for(i=0; i < size; i++) {
            let index = headerCells[i].id;
            if(storedVals[index] != undefined && !!storedVals[index]) {
                attributeList.push({attribute: index, value: storedVals[index]})
            }
            else {
                if(headerCells[i].required) {
                    currentStateValues[index] = "";
                    completeForm = false;
                }
            }
        }

        if(i === (size) && completeForm) {
            this.registerTEI(attributeList);
        }
        else {
            this.setState({
                rowValues: currentStateValues
            })
        }
    }

    _handleUpdateFeild() {
        console.log("feild updated");
    }

    formatDate(date){
      return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
    }

    _handleChange = (id,cell,info) => {
        let row = this.state.rowValues;
        let type = cell.type;
        switch (type) {
        	case 'DATE':
                    row[cell.id] = this.formatDate(info[1]);
        			this.setState({
        				rowValues:row
        			});
        		break;
        	case 'TEXT':
                    row[cell.id] = info[0].target.value;
        			this.setState({
        				rowValues: row
        			});
        	break;
        	case 'NUMBER':
                    row[cell.id] = info[0].target.value;
        			this.setState({
        				rowValues: row
        			});
        	break;
        	case 'BOOLEAN':
                    row[cell.id] = info[1].toString();
        			this.setState({
        				rowValues: row
        			});
        	break;
        	case 'optionSet':
                    row[cell.id] = cell.options[info[0].target.value-1].displayName;
        			this.setState({
        				rowValues: row
        			});
        	break;
        	default:
                    row[cell.id] = info[0].target.value;
        			this.setState({
        				rowValues: row
        			});
        }
    }

    getIconStyle = () => {
        if(this.state.saved) {
            return {color :this.context.muiTheme.rawTheme.palette.successColor}
        }
        else if(this.state.saved === false) {
            return {color :this.context.muiTheme.rawTheme.palette.warningColor}
        }
        else {
            return {color :this.context.muiTheme.rawTheme.palette.primary1Color}
        }
    }

    getIcon = ()=> {
        if(this.state.saved) {
            return <FontIcon className="material-icons">done</FontIcon>
        }
        else if(this.state.saved === false) {
            return <FontIcon className="material-icons">warning</FontIcon>
        }
        else {
            return (
                <FontIcon
                    className="material-icons"
                    color={this.context.muiTheme.rawTheme.palette.primary1Color}>mode_edit
                </FontIcon>
            )

        }
    }

    toggleCard() {
        this.setState({
            fabClicked: !this.state.fabClicked
        })
    }

    renderRow() {
        const style = {
            rowStyle: {
                position:"static",
                display:"inline-block",
                padding:0,
                backgroundColor:'aliceBlue',
                maxHeight:55,
                width:'100%'
            },
            wrapperStyle: {
                position:"static",
                display:"inline-block",
                paddingLeft:"styles.field.paddingLeft",
                paddingRight:"styles.field.paddingRight",
                width:"styles.field.width",
                minHeight:36,
            }
        }

        let handleChangeRef = null;
        let fieldList = this.props.rowData.headers.map((cell,id) => {
        handleChangeRef = function() {this._handleChange(id,cell,arguments)}.bind(this);
        let component = ComponentCategories(cell,handleChangeRef);
        if(cell.required) {
            component.validators= [{
                    validator: isRequired,
                    message: this.context.d2.i18n.getTranslation(isRequired.message),
                }];
        }
        let cellStyle= {};

        if(cell.type=="DATE" && this.state.rowValues[cell.id]!=undefined && this.state.rowValues[cell.id]!=''){
                component.value = new Date(this.state.rowValues[cell.id]);
        } else
                component.value = this.state.rowValues[cell.id];

        if(component.displayName === 'button') {
        	cell.label = cell.label === 'null' ? this.props.label : cell.label
        	component.props.labelStyle = {color:this.context.muiTheme.rawTheme.palette.primary1Color};
        	component.props.onClick=this._handleButtonClick.bind(this);
        	component.props.label=cell.label;
        	component.props.style = this.getIconStyle.call();
            component.props.icon = this.getIcon.call();
            component.props.status = this.state.saved;
            component.props.toggleCard = function() {this.toggleCard()}.bind(this);
        	cellStyle= cell.cellStyle;
        }
        else if (component.displayName ==='icon') {
        	component.props.children = this.state.status;
        }
        return component;
        })

        return (
          <FormBuilder
              key={this.props.rowData.programId+"row"}
              fields={fieldList} onUpdateField={this._handleUpdateFeild}
              style={style.rowStyle}
              fieldWrapStyle={style.wrapperStyle} />
        )
    }

  render() {
	const styles = {
        noPad : {
    		padding:'0px',
            borderTop:this.state.saved ? 'solid 1px #bdbdbd' : 'solid 0px #bdbdbd',
    		maxHeight:this.state.saved ? '500px' : '0px',
    		transition:'all 1s ease'
        },
	    cardStyle : {
            paddingTop:"0px",
            paddingBottom:"0px",
            borderTop:this.state.fabClicked ? 'solid 1px #bdbdbd' : 'solid 0px #bdbdbd',
    		maxHeight:this.state.fabClicked ? '500px' : '0px',
            visibility: this.state.fabClicked ? 'visible' : 'hidden',
    		transition:'all 1s ease'
        }
	}

	return (
//Single outer-row start
    	<TableRow >
        	<TableRowColumn colSpan={this.props.rowData.headers.length} style={styles.noPad}>
        		<Card>
            		<div>
            			<CardText style={{padding:0}}>
            			{this.renderRow()}
            			</CardText>
                        <CardText style={styles.cardStyle}>
                            <StageTabs stages={this.props.rowData.programStages} />
            			</CardText>
            		</div>
        		</Card>
        	</TableRowColumn>
    	</TableRow>
//Single outer-row close.

	)
  }
}
// TODO add rowData propTypes
CompositeRow.propTypes = {
    rowData : React.PropTypes.shape({
        headers: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            type: React.PropTypes.string.isRequired,
            required: React.PropTypes.bool
        })).isRequired,
        programStages: React.PropTypes.array
    }).isRequired,
	tableProps: React.PropTypes.object,
	tableHeaderProps: React.PropTypes.object,
	tableBodyProps: React.PropTypes.object,
}

CompositeRow.contextTypes = {muiTheme: React.PropTypes.object.isRequired, programObservable : React.PropTypes.object, d2: React.PropTypes.object};
