import React from 'react';
import times from 'lodash.times';
import log from 'loglevel';

// material-ui
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';

// d2-ui
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import { isRequired } from 'd2-ui/lib/forms/Validators';

// app
import ComponentCategories from './componentCategories';

export default class StageTabs extends React.Component {
    constructor(props,context) {
        super(props,constructor);
        this.fields = [];
        this.state = {
            open: false,
        }
    }

    handleChange = (id,cell,info) => {
        console.log(cell);
    }

    getComponentFields(elementArr) {
        const styles = {
            componentStyles : {
                marginTop: '2px',
                width: '90%'
            }
        }
        let handleChangeRef = null;
        let fieldList = elementArr.map(cell => {
            handleChangeRef = function() {this.handleChange(cell,arguments)}.bind(this);
            let component = ComponentCategories(cell,handleChangeRef);
            component.props.style = styles.componentStyles;
            if(component.component.displayName === 'TextField' || component.component.displayName === 'HackyDropDown') {
                component.props.floatingLabelText = cell.name;
            }
            else if (component.component.displayName === 'Toggle') {
                component.props.label = cell.name;
                component.props.style.marginBottom = '2px';
            }
            return component;
        });
        console.log(fieldList);
        this.fields = fieldList;
        this.setState({
            open: true
        })
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
                    stageElements.dataElement.optionSet.options.forEach(opt => {
                        let optionObj = {};
                        optionObj.id = opt.id;
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
            this.getComponentFields(elementsData);
        })
        .catch(err => {
            log.error('Failed to load program stage data ',err);
        });
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleUpdateFeild() {
        console.log("field updated");
    }

    render() {

        const styles = {
            stageButtons : {
                margin: 12,
            },
            radioButton: {
                marginTop: 16,
            },
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

        const radios = [];
        for (let i = 0; i < 30; i++) {
            radios.push(
            <RadioButton
              key={i}
              value={`value${i + 1}`}
              label={`Option ${i + 1}`}
              style={styles.radioButton}
            />
            );
        }

        let index=0;
        return (
            <div>
                {times(this.props.stages.length-1,function () {
                    index++;
                    return (
                        <RaisedButton key={this.props.stages[index].id} label={this.props.stages[index].displayName} style={styles.stageButtons} onTouchTap={this.handleOpen.bind(this,this.props.stages[index].id)} />
                    )
                }.bind(this))}

                <Dialog
                  title="Scrollable Dialog"
                  actions={actions}
                  modal={false}
                  open={this.state.open}
                  onRequestClose={this.handleClose}
                  autoScrollBodyContent={true}
                >
                    <FormBuilder
                        fields={this.fields}
                        onUpdateField={this.handleUpdateFeild} />
                </Dialog>
            </div>
        )
    }
}

StageTabs.contextTypes = { d2: React.PropTypes.object, muiTheme: React.PropTypes.object.isRequired };
