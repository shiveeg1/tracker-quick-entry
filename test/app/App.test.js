import React from 'react';
import ReactDom from 'react-dom';
import { shallow, mount } from 'enzyme';
import log from 'loglevel';
import Rx from 'rx';
import jquery from 'jquery/dist/jquery';
//d2
import {config, init} from 'd2/lib/d2';
import Model from 'd2/lib/model/Model';
import ModelDefinition from 'd2/lib/model/ModelDefinition';
// d2-ui
import HeaderBar from 'd2-ui/lib/header-bar/HeaderBar.component';
import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
// src
import AppComponent from '../../src/components/app.component';
import HackyDropdown from '../../src/components/drop-down';
import ButtonWrapper from '../../src/components/button-wrapper';
import EditTable from '../../src/components/edit-table';
import CompositeRow from '../../src/components/super-row';
import AppTheme from '../../src/theme';
import StageTabs from '../../src/components/stage-tabs';
// material-ui
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Dialog from 'material-ui/lib/dialog';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import SelectField from 'material-ui/lib/select-field';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/lib/table';
import {Card, CardText} from 'material-ui/lib/card';

describe('<AppComponent>',() => {
    let appComponent;
    let rootModel;

    beforeEach(() => {
        rootModel = new Model(new ModelDefinition('organisationUnit', 'organisationUnits', {}, [], {}, [], []));
        rootModel.displayName = 'Norway';
        appComponent = shallow(<AppComponent root={rootModel}/>);
    });

    it('should render the HeaderBar component from d2-ui', () => {
        expect(appComponent.find(HeaderBar)).to.have.length(1);
    });

    it('should render an Org tree', () => {
        expect(appComponent.find(OrgUnitTree)).to.have.length(1);
    });

    it('should NOT render an Program DropDown if state "selectedOrg" is not set', () => {
        expect(appComponent.find(HackyDropdown)).to.have.length(0);
    });

    it('should render an Program DropDown if state "selectedOrg" is set', () => {
        appComponent.setState({selectedOrg: 'abcdxyz'});
        expect(appComponent.find(HackyDropdown)).to.have.length(1);
    });
});

describe('<ButtonWrapper>',() => {
    let buttonWrapper;

    const context = {muiTheme: AppTheme};

    beforeEach(() => {
        buttonWrapper = shallow(<ButtonWrapper status={false}/>, {context});
    });

    it('should render the FlatButton component from d2-ui', () => {
        expect(buttonWrapper.find(FlatButton)).to.have.length(1);
    });

    it('should NOT render the FloatingActionButton component from d2-ui when prop "status" is not defined', () => {
        expect(buttonWrapper.find(FloatingActionButton)).to.have.length(0);
    });

    it('should render the FloatingActionButton component from d2-ui when prop "status" is defined', () => {
        buttonWrapper.setProps({status : true});
        expect(buttonWrapper.find(FloatingActionButton)).to.have.length(1);
    });
});

describe('<HackyDropDown>',()=> {
    let hackyDropDown;
    const menus = [{id:"id1", displayName:"one"},{id:"id2", displayName:"two"}];
    beforeEach(() => {
        hackyDropDown = shallow(<HackyDropdown menuItems={menus} />);
    });

    it('should render the SelectField component', () => {
        expect(hackyDropDown.find(SelectField)).to.have.length(1);
    });
});

describe('<EditTable>', () => {
    let editTable;
    let rootModel;

    const selectedProgData = {
        headers:[
            {name: "h1",type: "TEXT", required: true},
            {name: "h2",type: "TEXT", required: true},
            {name: "h3",type: "TEXT", required: true}
        ]};

    const styles = {
        bodyStyles: {
            overflowX:'visible',
            width: selectedProgData.headers.length * 200
        },
        scrollWrapperStyle: {
            overflowX:"auto",
            overflowY:"hidden",
            height:"20px",
            marginBottom:"-20px",
            marginLeft:"10px",
        },
        scrollDivStyle: {
            width: selectedProgData.headers.length * 200,
            display:"block",
            height:"20px"
        },
        addRowButton: {
            margin: "2 auto",
            left: "50%"
        }
    }

    let programObservable = new Rx.Subject();
    programObservable.onNext({selectedProg:"IpHINAT79UW",selectedOrg:'DiszpKrYNg8'});

    const context = {
        programObservable : programObservable,
        d2: {
            i18n: {
                getTranslation(key) {
                    return `${key}_translated`;
                },
            },
        }
    }

    beforeEach(() => {
        editTable = shallow(<EditTable style={styles}/>,{context});
    });

    it('should render the Table component', () => {
        editTable.setState({
            selectedProgData:{
                headers:[
                    {name: "h1",type: "TEXT", required: true},
                    {name: "h2",type: "TEXT", required: true},
                    {name: "h3",type: "TEXT", required: true}
                ],
                programStages:[],
            },
            rowCount:2
        });

    expect(editTable.find(Table)).to.have.length(1);
    });

    it('Should render set number of CompositeRow',() => {
        let numberOfRows = 5;
        editTable.setState({
            selectedProgData:{
                headers:[
                    {name: "h1",type: "TEXT", required: true},
                    {name: "h2",type: "TEXT", required: true},
                    {name: "h3",type: "TEXT", required: true}
                ],
                programStages:[],
            },
            rowCount:numberOfRows
        });

        expect(editTable.find(CompositeRow)).to.have.length(numberOfRows);
    });

    it('should set props of CompositeRow', () => {
        editTable.setState({
            selectedProgData:{
                headers:[
                    {name: "h1",type: "TEXT", required: true},
                    {name: "h2",type: "TEXT", required: true},
                    {name: "h3",type: "TEXT", required: true}
                ],
                programStages:[],
            },
            rowCount:2
        });
        const compositeRow = editTable.find(CompositeRow).first();

        expect(editTable.find(CompositeRow).first().props().update).to.equal(false);
    });

    it('should render a new row on button click', () => {
        let numberOfRows = 5;
        editTable.setState({
            selectedProgData:{
                headers:[
                    {name: "h1",type: "TEXT", required: true},
                    {name: "h2",type: "TEXT", required: true},
                    {name: "h3",type: "TEXT", required: true}
                ],
                programStages:[],
            },
            rowCount:numberOfRows
        });

        expect(editTable.find(CompositeRow)).to.have.length(numberOfRows);
        editTable.find(FlatButton).simulate('click');
        expect(editTable.find(CompositeRow)).to.have.length(numberOfRows+1);
    });
});

describe('<CompositeRow>', () => {
    let compositeRow;
    const rowData = {
        headers:[
            {name: "h1",type: "TEXT", required: true},
            {name: "h2",type: "TEXT", required: true},
            {name: "h3",type: "TEXT", required: true}
        ],
        programStages:[{id: "1"}, {id: "2"}, {id:"3"}],
        programId: 'randomId',
        orgUnit: 'organisationUnit'
    };

    const context = {
        muiTheme: AppTheme,
        d2: {
            i18n: {
                getTranslation(key) {
                    return `${key}_translated`;
                },
            },
        }
    };

    beforeEach(() => {
        compositeRow = shallow(<CompositeRow rowData={rowData}/>, {context});
    });

    it('should render the TableRow and Card Component', () => {
        expect(compositeRow.find(TableRow)).to.have.length(1);
        expect(compositeRow.find(TableRowColumn)).to.have.length(1);
    });

    it('should render one card if the state "saved" is not saved', () => {
        expect(compositeRow.find(CardText)).to.have.length(1);
    });

    it('should render two cards if the state "saved" is set', () => {
        compositeRow.setState({
            saved: true
        });
        expect(compositeRow.find(CardText)).to.have.length(2);
    });

    it('should render the StageTabs as many stages', () => {
        compositeRow.setState({
            saved: true
        });
        expect(compositeRow.find(StageTabs)).to.have.length(rowData.programStages.length);
    });
});

describe('<StageTabs>', () => {
    const context = {
        muiTheme: AppTheme,
        d2: {
            i18n: {
                getTranslation(key) {
                    return `${key}_translated`;
                },
            },
            models : {
                programStages: {
                    get(id,obj) {
                        var promise = new Promise(function(resolve, reject) {
                          // do a thing, possibly async, then…

                          if (true) {
                            resolve(
                                 {
                                     programStageDataElements : {
                                         valuesContainerMap: []
                                     }
                                 }
                            );
                          }
                          else {
                            reject(Error("It broke"));
                          }
                        });
                        return promise;
                    }
                }
            }
        }
    };

    let stageTabs;

    beforeEach(() => {
        stageTabs = shallow(<StageTabs
            stage= {{id: 'qwerty', displayName: 'stageName', repeatable: false}}
            programId='progId'
            orgUnit='orgUnit'
            enrollId='enrollId'
            displayName='displayName'
            teiId='teiId' />, {context});
    });

    it('should render RaisedButton & Dialog for stageName', () => {
        expect(stageTabs.find(RaisedButton)).to.have.length(1);
        expect(stageTabs.find(Dialog)).to.have.length(1);
    });

    it('should NOT render the card if the state eventCreated is not set', () => {
        expect(stageTabs.find(Card)).to.have.length(0);
    });

    it('should render the card if the state eventCreated is set', () => {
        stageTabs.setState({
            eventCreated: true
        });
        expect(stageTabs.find(Card)).to.have.length(1);
    });
});
