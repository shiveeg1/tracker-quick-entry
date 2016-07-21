import React from 'react';
import times from 'lodash.times';
import log from 'loglevel';

// material-ui
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/lib/card';
import Snackbar from 'material-ui/lib/snackbar';

// d2-ui
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import { isRequired } from 'd2-ui/lib/forms/Validators';

// app
import ComponentCategories from './componentCategories';

export default class StageTabs extends React.Component {
    constructor(props,context) {
        super(props,context);

        this.state = {
            open: false,
            eventCreated: false,
            eventDate: null,
            dataEntryObj: {},
            eventIdList: [],
            openSnackbar: false,
        };
        this.elementsData = null;
        this.eventId = '';
        this.snackbarMessage = '';
    }

    handleChange = (id,cell,info) => {
        let eventData = this.state.dataEntryObj;
        let eventId = cell.eventId;
        if(!eventData[eventId]) {
            eventData[eventId] = {};
        }
        let type = cell.type;
        switch (type) {
        	case 'DATE':
                    eventData[eventId][cell.id] = this.formatDate(info[1]);
        			this.setState({
        				dataEntryObj:eventData
        			});
        		break;
        	case 'TEXT':
                    eventData[eventId][cell.id] = info[0].target.value;
        			this.setState({
        				dataEntryObj: eventData
        			});
        	break;
        	case 'NUMBER':
                    eventData[eventId][cell.id] = Number(info[0].target.value);
        			this.setState({
        				dataEntryObj: eventData
        			});
        	break;
        	case 'BOOLEAN':
                    eventData[eventId][cell.id] = info[1].toString();
        			this.setState({
        				dataEntryObj: eventData
        			});
        	break;
        	case 'optionSet':
                    eventData[eventId][cell.id] = cell.options[info[0].target.value].displayName;
        			this.setState({
        				dataEntryObj: eventData
        			});
        	break;
            case 'FILE_RESOURCE':
                    if(info[0].target.response.httpStatusCode === 202) {
                        eventData[eventId][cell.id] = info[0].target.response.response.fileResource.id;
                        this.snackbarMessage = this.context.d2.i18n.getTranslation('file_upload_success');
                        this.setState({
            				dataEntryObj: eventData,
                            openSnackbar: true
            			});
                    }
                    else {
                        this.snackbarMessage = this.context.d2.i18n.getTranslation('file_upload_error');
                        this.setState({
                            openSnackbar: true
                        });
                    }
                    break;
        	default:
                    eventData[eventId][cell.id] = info[0].target.value;
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
            eventIdList: [],
            openSnackbar: false,
        }
    }

    getComponentFields(eventId) {
        const styles = {
            componentStyles : {
                marginTop: '2px',
                width: '90%'
            }
        }
        let handleChangeRef = null;

        let fieldList = this.elementsData.map((cell,id) => {
            cell.eventId = eventId;
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

            if(cell.type=="DATE" && this.state.dataEntryObj[eventId]!=undefined && this.state.dataEntryObj[eventId][cell.id]!=''){
                    component.value = new Date(this.state.dataEntryObj[eventId][cell.id]);
            } else
                    component.value = this.state.dataEntryObj[eventId] ?  this.state.dataEntryObj[eventId][cell.id] : undefined;

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
                    obj.options.unshift({id:"placeholder",displayName:this.context.d2.i18n.getTranslation("select_option"),disabled:true});
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
        // this.putData();
        this.setState({open: false});
    };

    handleUpdateFeild() {
        console.log("field updated");
    }

    putData(eventId,status) {
        let eventObj = {}, dataValues = [], deo = this.state.dataEntryObj[eventId];
        eventObj["event"] = eventId;
        eventObj["orgUnit"] = this.props.orgUnit;
        eventObj["program"] = this.props.programId;
        eventObj["programStage"] = this.props.stage.id;
        eventObj["status"] = status;  // TODO ACTIVE,SCHEDULED, COMPLETED
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
                this.snackbarMessage = this.context.d2.i18n.getTranslation('data_store_success');
                this.setState({
                    openSnackbar: true
                });
    		}.bind(this),
    		error: function( jqXHR, textStatus, errorThrown ) {
                log.warn('Failed to create event:', jqXHR);
                this.snackbarMessage = this.context.d2.i18n.getTranslation('data_store_error');
                this.setState({
                    openSnackbar: true
                })
    		}.bind(this)
    	} );
    }

    createEvent() {
        // TODO how to choose status active / scheduled
        if(this.state.eventDate) {
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
            let eil = this.state.eventIdList;
            this.context.d2.Api.getApi().post("events",{events : eventList})
            .then(response => {
                let eventId= response.response.importSummaries[0].reference;
                this.eventId = eventId;
                eil.push(eventId);
                this.snackbarMessage = this.context.d2.i18n.getTranslation('event_created_success');
                this.setState({
                    eventCreated: true,
                    eventIdList: eil,
                    eventDate: null,
                    openSnackbar: true
                })
            })
            .catch(err => {
                log.warn('event_created_error', err.message ? err.message : err);
                this.snackbarMessage = this.context.d2.i18n.getTranslation('event_created_error');
                this.setState({
                    openSnackbar: true
                })
            });
        }
        else {
            this.snackbarMessage = this.context.d2.i18n.getTranslation('empty_date_error.');
            this.setState({
                openSnackbar: true
            })
        }

    }

    setEventDate(event,date) {
        this.setState({
            eventDate: date
        })
    }

    handleSackbarRequestClose() {
        this.setState({
            openSnackbar: false,
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
                display:'inline-block',
                marginRight:24,
            }
        };

        const actions = [
            <FlatButton
                label="Close"
                primary={true}
                onTouchTap={this.handleClose}
            />,
        ];

        return (
            <div>
                <RaisedButton key={this.props.stage.id} label={this.props.stage.displayName} style={styles.stageButtons} onTouchTap={this.handleOpen.bind(this,this.props.stage.id)} />
                <Dialog
                  title={this.context.d2.i18n.getTranslation("data_entry")}
                  actions={actions}
                  modal={true}
                  open={this.state.open}
                  onRequestClose={this.handleClose}
                  autoScrollBodyContent={true} >

                    <div>
                        <DatePicker
                            floatingLabelText={this.context.d2.i18n.getTranslation("report_date")}
                            value={this.state.eventDate}
                            autoOk={true}
                            disabled={!this.props.stage.repeatable && this.state.eventCreated}
                            onChange={this.setEventDate.bind(this)}
                            style={styles.eventCreateDiv}/>
                        <FlatButton
                            label={this.context.d2.i18n.getTranslation("create_event")}
                            secondary={true}
                            disabled={!this.props.stage.repeatable && this.state.eventCreated}
                            onClick={this.createEvent.bind(this)}
                            style={styles.eventCreateDiv} />
                    </div>
                    { this.state.eventCreated &&
                        <Card>
                            {this.state.eventIdList.map(function (eventId,idx) {
                                return (
                                <div key={idx}>
                                    <CardHeader
                                        title={this.context.d2.i18n.getTranslation("event")+": "+idx}
                                        actAsExpander={true}
                                        showExpandableButton={true}
                                    />
                                    <CardText expandable={true}>
                                        {this.getComponentFields(eventId)}
                                        <div style={{style:'flex'}}>
                                            <FlatButton
                                                label='Submit'
                                                secondary={true}
                                                onClick={this.putData.bind(this,eventId,'ACTIVE')} />
                                            <FlatButton
                                                label='Complete'
                                                secondary={true}
                                                onClick={this.putData.bind(this,eventId,'COMPLETED')} />
                                        </div>
                                    </CardText>
                                </div>)
                        }.bind(this))}
                        </Card>
                    }
                </Dialog>

                <Snackbar
                  open={this.state.openSnackbar}
                  message={this.snackbarMessage}
                  autoHideDuration={4000}
                  onRequestClose={this.handleSackbarRequestClose.bind(this)}
                />
            </div>
        )
    }
}

StageTabs.contextTypes = { d2: React.PropTypes.object, muiTheme: React.PropTypes.object.isRequired };
