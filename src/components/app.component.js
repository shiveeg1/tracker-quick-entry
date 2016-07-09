import React from 'react';
import log from 'loglevel';
import Rx from 'rx';
//d2
import HeaderBar from 'd2-ui/lib/header-bar/HeaderBar.component';
import OrgUnitTree from 'd2-ui/lib/org-unit-tree';

//App
import HackyDropdown from './drop-down';
import AppTheme from '../theme';
import EditTable from './edit-table';

class App extends React.Component {
    constructor(props,context){
        super(props);
        this.state = Object.assign({},{
            programList: [],
            selectedOrg: '',
            selectedProg: null,
            allOrgProgData: []
        });
        this.props = props;
    }

    getChildContext() {
        return {
            d2: this.props.d2,
            root: this.props.root,
            muiTheme: AppTheme,
            programObservable: this.programObservable,
        }
    }

    componentWillMount() {
        this.programObservable = new Rx.Subject();
    }


    componentDidMount() {
        console.log("did mount");
    }

    componentWillUnmount() {
        console.log("will mount");
    }

    _handleOrgTreeClick(event, orgUnit) {
        // fecthing all programs under that org-unit
        this.programObservable.onNext({selectedProg:"null",selectedOrg:this.state.selectedOrg});
        this.setState({
            selectedOrg: this.state.selectedOrg === orgUnit.id ? '' : orgUnit.id,
            programList: [],
        });

        let dropdownProgList = [];
        console.log(orgUnit.id);
        this.props.d2.models.organisationUnits.get(orgUnit.id,{paging:false,fields:'id,name,programs[*,id,name,programIndicators[*],dataEntryForm,attributeValues,enrollmentDateLabel,registration,useFirstStageDuringRegistration,programStages[id,name,programStageDataElements[id,dataElement[id,name,optionSet[id,name,version]]]],organisationUnits,programTrackedEntityAttributes,trackedEntity]'})
        .then(orgUnitData => {
            orgUnitData.programs.forEach(oneProgram => {
                if(oneProgram.programTrackedEntityAttributes.valuesContainerMap.size > 0)
                    dropdownProgList.push({id:oneProgram.id,displayName:oneProgram.name});
            })
            dropdownProgList.unshift({id:"placeholder",displayName:"Select Program",disabled:true});
            this.setState({
                allOrgProgData: orgUnitData.programs,
                programList: dropdownProgList,
            });
        })
        .catch(err => {
            log.error('Failed to load Org programs',err);
        })
    }

    _handleDropdownChange(obj) {
        this.programObservable.onNext({selectedProg:obj.target.value,selectedOrg:this.state.selectedOrg});
    }

    render() {

        const styles = {
            header: {
                fontSize: 24,
                fontWeight: 100,
                color: AppTheme.rawTheme.palette.textColor,
                padding: '6px 16px',
            },
            forms: {
                minWidth: AppTheme.forms.minWidth,
                maxWidth: AppTheme.forms.maxWidth,
            },
            box: {
                position:'fixed',
                left:'0px',
                border: '1px solid #eaeaea',
                width: '300px',
                height: '100%',
                overflowY: 'hidden',
                backgroundColor: AppTheme.rawTheme.palette.accent2Color,
            },
            treeBox: {
                backgroundColor:'white',
                border: '1px solid #eaeaea',
                height: '400px',
                width:'100%',
                marginTop: '40px',
                overflowY:'auto',
                fontSize: 13,
           },
           parent: {
              position:'absolute',
              height: 'auto',
              width: '100%',
              display:'flex',
              left: '0px',
              backgroundColor: AppTheme.rawTheme.palette.canvasColor,
           },
           dropdown: {
                marginLeft: '10px',
                marginTop: '20px',
                width: 350
            },
            table: {
                marginLeft: '10px',
                marginTop: '20px',
                border: '1px solid',
                borderColor: AppTheme.rawTheme.palette.borderColor,
                overflow:'visible',
                position:'relative'
             },
             tableBody: {
                 overflowX: 'scroll'
             },
             paraStyle: {
                 color : AppTheme.rawTheme.palette.textColor,
                 marginRight: '10px'
             }
        };

        const tableProps = {
            height:'auto',
            fixedHeader:true,
            fixedFooter:true,
            selectable:false,
            multiSelectable:true,
        }
        const tableHeaderProps = {
            displaySelectAll: false,
            adjustForCheckbox: false
        }

        const tableBodyProps = {
            displayRowCheckbox: false,
        }

        return (
            <div className="app-wrapper" style={styles.parent}>
                <HeaderBar />
                <div style={styles.box}>
                    <div style={styles.treeBox}>
                        <OrgUnitTree
                              root={this.props.root}
                              onClick={this._handleOrgTreeClick.bind(this)}
                              selected={this.state.selectedOrg}
                          />
                    </div>
                </div>

                <div className="content-area" style={styles.forms}>
                    <div style={styles.header}>
                         <p>Tracker Capture Entry App</p>
                    </div>

                    {this.state.selectedOrg &&
                        <div style={{display:'flex'}}>
                            <p style={styles.paraStyle}>Select Program : </p>
                            <HackyDropdown key={0} value='dropValue' onChange={this._handleDropdownChange.bind(this)} menuItems={this.state.programList} includeEmpty={true} emptyLabel='Select Program' />
                        </div>
                     }

                     <EditTable style={styles.table} tableProps={tableProps} tableHeaderProps = {tableHeaderProps} tableBodyProps={tableBodyProps} rowCount={10} />
                </div>
            </div>
        );
    }
}

App.propTypes = { d2: React.PropTypes.object, root: React.PropTypes.any };
App.childContextTypes = { d2: React.PropTypes.object, root: React.PropTypes.any, muiTheme: React.PropTypes.object.isRequired, programObservable : React.PropTypes.object };

export default App;
