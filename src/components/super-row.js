import React from 'react';
import times from 'lodash.times';
// material-ui
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/lib/table';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/lib/card';
import FontIcon from 'material-ui/lib/font-icon';
//App
import ProgramStageDropDown from './drop-down';
import ComponentCategories from './componentCategories';
//d2-ui
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import dhis2 from 'd2-ui/lib/header-bar/dhis2';
/*
TODO collapse option icon
TODO change stageData state structure accordingly. Maybe array of objects
*/
export default class CompositeRow extends React.Component {
    constructor(props,context){
    	super(props,context);
    	this.context=context;
    	let basicState = {
    	    animHeight:'0px',
    	    selectedStageIndex: 0,
    	    stageData : []
    	}
    	this.state = Object.assign({},{
    		rowValues: [],
    		status: <FontIcon
                className="material-icons"
                color={this.context.muiTheme.rawTheme.palette.primary1Color}>mode_edit
                </FontIcon>,
    		statusColor: this.context.muiTheme.rawTheme.palette.primary1Color,
    	},basicState);

        this.d2 = context.d2;
    	this.props = props;
    	this.stageDat = [];
    }

    componentWillReceiveProps() {
	    this.setState({
		    rowValues:[]
	    })
      }

    _handleStageSelect(obj) {
        this.setState({
        	selectedStageIndex: obj.target.value
        });
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
                	animHeight: this.state.animHeight=='0px'?'500px':'0px',
                	status: <FontIcon className="material-icons">done</FontIcon>,
                	statusColor: this.context.muiTheme.rawTheme.palette.successColor
                })
            })
            .catch(err => {
                console.log('failed to enroll TEI instance '+err);
                this.setState({
                	animHeight: this.state.animHeight=='0px'?'500px':'0px',
                	status: <FontIcon className="material-icons">warning</FontIcon>,
                	statusColor: this.context.muiTheme.rawTheme.palette.warningColor
                })
            });
        }
        console.log("came to the end");
     }

    registerTEI() {
        let attributeList = [], registerPayload = {};
        let size = this.props.rowData.headers.size;
        this.props.rowData.headers.forEach((cell,index) => {
            // TODO redo for a "mandatory" check
            if(this.state.rowValues[index] === undefined && (index != (size-1))) {
                return 500;
            }
            else {
                attributeList.push({attribute: cell.id, value: this.state.rowValues[index]})
            }
        })
        registerPayload["attributes"] = attributeList;
        registerPayload["trackedEntity"] = this.props.rowData.trackedEntityId;
        registerPayload["orgUnit"] = this.props.rowData.orgUnit;
        console.log(registerPayload);
        let regFlag = true;
        if(regFlag) {
            this.d2.Api.getApi().post("trackedEntityInstances",registerPayload)
            .then(response => {
                console.log(response);
                let instanceId = response.response.reference;
                console.log("reg id : "+instanceId);
                this.handleEnroll(instanceId);
            })
            .catch(err => {
                console.log('failed to register TEI instance '+err);
                this.setState({
                	animHeight: this.state.animHeight=='0px'?'500px':'0px',
                	status: <FontIcon className="material-icons">warning</FontIcon>,
                	statusColor: this.context.muiTheme.rawTheme.palette.warningColor
                })
            });
        }
        console.log("came to the end");
    }

    _handleButtonClick() {
        console.log(this.props.rowData);
        this.registerTEI();
    }

    _handleUpdateFeild() {
        // TODO validate required feilds and save on server
        console.log("feild updated");
    }

    toggleHeight() {
        if(this.state.animHeight === '0px') {
        	this.setState({
        		animHeight: '500px'
        	})
        }
        else {
        	this.setState({
        		animHeight: '0px'
        	})
        }
    }

    _handleChange = (id,cell,info) => {
        let row = this.state.rowValues;
        let type = cell.type;
        switch (type) {
        	case 'DATE':
        			row[id] = info[1];
        			this.stageDat=row;
        			this.setState({
        				rowValues:row
        			});
        		break;
        	case 'TEXT':
        			row[id] = info[0].target.value;
        			this.stageDat=row;
        			this.setState({
        				rowValues: row
        			});
        	break;
        	case 'NUMBER':
        			row[id] = info[0].target.value;
        			this.stageDat=row;
        			this.setState({
        				rowValues: row
        			});
        	break;
        	case 'BOOLEAN':
        			row[id] = info[1].toString();
        			this.stageDat=row;
        			this.setState({
        				stageData: row
        			});
        	break;
        	case 'optionSet':
        			row[id] = cell.options[info[0].target.value-1].displayName;
        			this.stageDat=row;
        			this.setState({
        				rowValues: row
        			});
        	break;
        	default:
        			row[id] = info[0].target.value;
        			this.stageDat=row;
        			this.setState({
        				rowValues: row
        			});
        }
    }

    renderRow() {
        const style = {
            rowStyle: {
                position:"static",
                display:"inline-block",
                padding:0,
                backgroundColor:'aliceBlue'
            },
            wrapperStyle: {
                position:"static",
                display:"inline-block",
                paddingLeft:24,
                paddingRight:24,
                width:152,
                minHeight:36,
            }
        }
        let handleChangeRef = null;
        const buttonColor = this.context.muiTheme.rawTheme.palette.primary1Color;
        let fieldList = this.props.rowData.headers.map((cell,id) => {
        handleChangeRef = function() {this._handleChange(id,cell,arguments)}.bind(this);
        let component = ComponentCategories(cell,id,handleChangeRef);
        let cellStyle= {};
        component.value = this.state.rowValues[id];
        if(component.displayName === 'button') {
        	cell.label = cell.label === 'null' ? this.props.label : cell.label
        	component.props.labelStyle = {color:this.context.muiTheme.rawTheme.palette.primary1Color};
        	component.props.onClick=this._handleButtonClick.bind(this);
        	component.props.label=cell.label;
        	component.props.style = {color:this.state.statusColor}
        	component.props.icon = this.state.status;
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
    		borderTop:this.state.animHeight=='0px'?'solid 0px #bdbdbd':'solid 1px #bdbdbd',
    		maxHeight:this.state.animHeight,
    		transition:'all 1s ease'
        },
	    cardStyle : {
            paddingTop:"0px",
            paddingBottom:"0px",
            borderTop:this.state.animHeight=='0px'?'solid 0px #bdbdbd':'solid 1px #bdbdbd',
    		maxHeight:this.state.animHeight,
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
                            <ProgramStageDropDown value="dropValue"
                                onChange={this._handleStageSelect.bind(this)}
                                menuItems={this.props.rowData.programStages}
                                includeEmpty={true}
                                emptyLabel="Select Stage"   />
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
