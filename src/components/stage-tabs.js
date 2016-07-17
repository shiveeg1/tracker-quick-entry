import React from 'react';
import ReactDom from 'react-dom';
import times from 'lodash.times';
import log from 'loglevel';

// material-ui
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import DatePicker from 'material-ui/lib/date-picker/date-picker';

// d2-ui
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import { isRequired } from 'd2-ui/lib/forms/Validators';

// app
import ComponentCategories from './componentCategories';

export default class StageTabs extends React.Component {
    constructor(props,context) {
        super(props,constructor);
        this.elementsData = null;
        this.eventId = '';
        this.state = {
            open: false,
            eventCreated: false,
            eventDate: null,
            dataEntryObj: {},
        }
    }

    handleChange = (id,cell,info) => {
        let eventData = this.state.dataEntryObj;
        if(!eventData[this.eventId]) {
            eventData[this.eventId] = {};
        }
        let type = cell.type;
        switch (type) {
        	case 'DATE':
                    eventData[this.eventId][cell.id] = this.formatDate(info[1]);
        			this.setState({
        				dataEntryObj:eventData
        			});
        		break;
        	case 'TEXT':
                    eventData[this.eventId][cell.id] = info[0].target.value;
        			this.setState({
        				dataEntryObj: eventData
        			});
        	break;
        	case 'NUMBER':
                    eventData[this.eventId][cell.id] = info[0].target.value;
        			this.setState({
        				dataEntryObj: eventData
        			});
        	break;
        	case 'BOOLEAN':
                    eventData[this.eventId][cell.id] = info[1].toString();
        			this.setState({
        				dataEntryObj: eventData
        			});
        	break;
        	case 'optionSet':
                    eventData[this.eventId][cell.id] = cell.options[info[0].target.value].displayName;
        			this.setState({
        				dataEntryObj: eventData
        			});
        	break;
        	default:
                    eventData[this.eventId][cell.id] = info[0].target.value;
        			this.setState({
        				dataEntryObj: eventData
        			});
        }
    }

    componentWillReceiveProps() {
        this.state = {
            open: false,
            eventCreated: false,
            eventDate: null,
            dataEntryObj: {},
        }
    }

    getComponentFields(elementArr) {
        const styles = {
            componentStyles : {
                marginTop: '2px',
                width: '90%'
            }
        }
        let handleChangeRef = null;

        let fieldList = elementArr.map((cell,id) => {
            handleChangeRef = function() {this.handleChange(id,cell,arguments)}.bind(this);
            let component = ComponentCategories(cell,handleChangeRef);
            component.props.style = styles.componentStyles;
            if(component.component.displayName === 'TextField' || component.component.displayName === 'HackyDropDown') {
                component.props.floatingLabelText = cell.name;
            }
            else if (component.component.displayName === 'Toggle') {
                component.props.label = cell.name;
                component.props.style.marginBottom = '2px';
            }

            if(cell.type=="DATE" && this.state.dataEntryObj[this.eventId]!=undefined && this.state.dataEntryObj[this.eventId][cell.id]!=''){
                    component.value = new Date(this.state.dataEntryObj[this.eventId][cell.id]);
            } else
                    component.value = this.state.dataEntryObj[this.eventId] ?  this.state.dataEntryObj[this.eventId][cell.id] : undefined;

            return component;
        });
        return (
            <FormBuilder
                fields={fieldList}
                onUpdateField={this.handleUpdateFeild} />
        )

    }

    handleOpen = (stageId) => {
        let elementsData = [];
        this.context.d2.models.programStages.get(stageId,{paging:false,fields:'id,program,programStageDataElements[id,dataElement[id,displayName,description,publicAccess,valueType,optionSet[id,name,optionSetValue,options[id,name]]]]'})
        .then(stageData => {
            stageData.programStageDataElements.valuesContainerMap.forEach(stageElements => {
                let obj = {};
                obj.id = stageElements.dataElement.id;
                obj.name = stageElements.dataElement.displayName;
                if(!!stageElements.dataElement.optionSet) {
                    obj.options = [];
                    obj.type="optionSet";
                    stageElements.dataElement.optionSet.options.forEach((opt,index) => {
                        let optionObj = {};
                        optionObj.id = index+1;
                        optionObj.displayName = opt.name;
                        obj.options.push(optionObj);
                    })
                    obj.options.unshift({id:"placeholder",displayName:"Select Option",disabled:true});
                }
                else {
                    obj.type= stageElements.dataElement.valueType;
                }
                elementsData.push(obj);
            });
            this.elementsData = elementsData;
            this.setState({
                open: true,
            })
        })
        .catch(err => {
            log.error('Failed to load program stage data ',err);
        });
    };

    formatDate(date){
      return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
    }

    handleClose = () => {
        this.putData();
        this.setState({open: false});
    };

    handleUpdateFeild() {
        console.log("field updated");
    }

    putData() {
        let eventObj = {}, dataValues = [], deo = this.state.dataEntryObj[this.eventId];
        eventObj["event"] = this.eventId;
        eventObj["orgUnit"] = this.props.orgUnit;
        eventObj["program"] = this.props.programId;
        eventObj["programStage"] = this.props.stage.id;
        // eventObj["status"] = "COMPLETED";  // TODO ACTIVE,SCHEDULED, COMPLETED
        eventObj["trackedEntityInstance"] = this.props.teiId;

        for(let key in deo) {
            if(deo.hasOwnProperty(key))
                dataValues.push({"value": deo[key], "dataElement": key});
        }
        eventObj["dataValues"] = dataValues;
        $.ajax( {
    		url: [this.context.d2.Api.getApi().baseUrl,"events",this.eventId].join('/'),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
    		data: JSON.stringify(eventObj),
    		type: 'PUT',
    		success: function( data ) {
    			console.log("success PUT data");
    		},
    		error: function( jqXHR, textStatus, errorThrown ) {
    			console.log("failure PUT data");
                log.warn('Failed to create event:', jqXHR);
    		}
    	} );
    }

    createEvent() {
        // TODO how to choose status active / scheduled
        let eventList = [];
        let eventObj = {};
        eventObj["dataValues"] = [];
        eventObj["notes"] = [];
        eventObj["dueDate"] = this.formatDate(this.state.eventDate);
        eventObj["eventDate"] = this.formatDate(this.state.eventDate);
        eventObj["enrollment"] = this.props.enrollId;
        eventObj["orgUnit"] = this.props.orgUnit;
        eventObj["program"] = this.props.programId;
        eventObj["programStage"] = this.props.stage.id;
        eventObj["trackedEntityInstance"] = this.props.teiId;
        eventObj["status"] = "ACTIVE";
        eventList.push(eventObj);
        this.context.d2.Api.getApi().post("events",{events : eventList})
        .then(response => {
            let eventId= response.response.importSummaries[0].reference;
            console.log("event id : "+eventId);
            this.eventId = eventId;
            this.setState({
                eventCreated: true,
            })
        })
        .catch(err => {
            log.warn('Failed to create event:', err.message ? err.message : err);
            this.setState({
                eventCreated: false,
            })
        });
    }

    setEventDate(event,date) {
        this.setState({
            eventDate: date
        })
    }

    render() {

        const styles = {
            stageButtons : {
                margin: 12,
            },
            radioButton: {
                marginTop: 16,
            },
            eventCreateDiv : {
                display: 'flex'
            }
        };

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleClose}
            />,
        ];

        return (
            <div>
                <RaisedButton key={this.props.stage.id} label={this.props.stage.displayName} style={styles.stageButtons} onTouchTap={this.handleOpen.bind(this,this.props.stage.id)} />
                <Dialog
                  title="Data Entry"
                  actions={actions}
                  modal={false}
                  open={this.state.open}
                  onRequestClose={this.handleClose}
                  autoScrollBodyContent={true} >

                    <div style={styles.eventCreateDiv}>
                        <DatePicker
                            floatingLabelText="Report date"
                            value={this.state.eventDate}
                            autoOk={true}
                            onChange={this.setEventDate.bind(this)} />
                        <FlatButton label='Create Event' secondary={true} onClick={this.createEvent.bind(this)} />
                    </div>
                    <hr />
                    { this.state.eventCreated && this.getComponentFields(this.elementsData)}
                </Dialog>
            </div>
        )
    }
}

StageTabs.contextTypes = { d2: React.PropTypes.object, muiTheme: React.PropTypes.object.isRequired };
