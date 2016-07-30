import React from 'react';
import { shallow } from 'enzyme';
import log from 'loglevel';
//d2
import { config, init } from 'd2/lib/d2';
import Model from 'd2/lib/model/Model';
import ModelDefinition from 'd2/lib/model/ModelDefinition';

// d2-ui
import HeaderBar from 'd2-ui/lib/header-bar/HeaderBar.component';
import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';
// src
import AppComponent from '../../src/components/app.component';
import HackyDropdown from '../../src/components/drop-down';
import ButtonWrapper from '../../src/components/button-wrapper';
import AppTheme from '../../src/theme';
// material-ui
import FlatButton from 'material-ui/lib/flat-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import SelectField from 'material-ui/lib/select-field';

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
