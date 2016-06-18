import React from 'react';
import log from 'loglevel';

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
        };
    }

    componentDidMount() {
    console.log("did mount");
    }

    componentWillUnmount() {
        console.log("will mount");
    }

    _handleOrgTreeClick(event, orgUnit) {
        // fecthing all programs under that org-unit
        let dropdownProgList = [];
        this.props.d2.models.organisationUnits.get(orgUnit.id,{paging:false,fields:'id,name,programs[id,name,programStages[id,name,programStageDataElements[id,dataElement[id,name,optionSet[id,name,version]]]],organisationUnits,programTrackedEntityAttributes,trackedEntity]'})
        .then(orgUnitData => {
            orgUnitData.programs.forEach(oneProgram => {
                dropdownProgList.push({id:oneProgram.id,displayName:oneProgram.name});
            })
            this.setState({
                allOrgProgData: orgUnitData.programs,
                programList: dropdownProgList,
                selectedOrg: this.state.selectedOrg === orgUnit.id ? '' : orgUnit.id
            });
        })
        .catch(err => {
            log.error('Failed to load Org programs',err);
        })
    };

    _handleDropdownChange(obj) {
        // TODO Hnadle following bugs :-
        // Information Campaign / Conraceptive Voucher program and some others give error : Uncaught TypeError: Cannot read property 'id' of undefined
            this.setState({
                selectedProg: obj.target.value
            },function(){
                let selectedProgData = this.state.allOrgProgData.valuesContainerMap.get(this.state.selectedProg);
            });
    }

    render() {

        const styles = {
            header: {
                fontSize: 24,
                fontWeight: 100,
                color: AppTheme.rawTheme.palette.textColor,
                padding: '6px 16px',
            },
            card: {
                marginTop: 8,
                marginRight: '1rem',
            },
            cardTitle: {
                background: AppTheme.rawTheme.palette.primary2Color,
                height: 62,
            },
            cardTitleText: {
                fontSize: 28,
                fontWeight: 100,
                color: AppTheme.rawTheme.palette.alternateTextColor,
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

        const data ={
            headers: [
                {
                    name:"Date Of Birth",
                    type:"date",
                    required:true
                },
                {
                    name:"Date Of Admission",
                    type:"date",
                    required:true
                },
                {
                    name:"First Name",
                    type:"textbox",
                    required:true
                },
                {
                    name:"Last Name",
                    type:"textbox",
                    required:false
                },
                {
                    name:"Age",
                    type:"numeric",
                    required:false
                },
                {
                    name:"Gender",
                    type:"optionSet",
                    options: [
                        {
                            id: '1',
                            displayName: 'male'
                        },
                        {
                            id: '2',
                            displayName: 'female'
                        },
                        {
                            id: '3',
                            displayName: 'other'
                        }
                    ],
                    required:true,
                    onChange: function() {
                        console.log("in on change");
                    }
                },
                {
                    name:"AwesomePerson",
                    type:"boolean",
                    required:false
                },
                {
                    name:"Register",
                    type:"button",
                    label:"Save",
                    required:true,
                    cellStyle:{
                        position:'absolute',
                        right:'0',
                        width:100,
                        backgroundColor:'white',
                        borderLeft:'solid 1px #bdbdbd',
                        zIndex:1,
                        paddingTop:0,
                        textAlign:'center'
                    }
                }
            ],
            programStages: [
                {
                    name: 'stage 1',
                    events: [
                        {
                            name: 'First name',
                            type: 'textbox',
                            required:true
                        },
                        {
                            name:"AwesomePerson",
                            type:"boolean",
                            required:false
                        },
                        {
                            name:"Date Of Admission",
                            type:"date",
                            required:true
                        },
                        {
                            name: 'Last name',
                            type: 'textbox',
                            required:true
                        },
                        {
                            name:"AwesomePerson",
                            type:"boolean",
                            required:false
                        },
                        {
                            name:"Date Of Birth",
                            type:"date",
                            required:true
                        }
                    ]
                },
                {
                    name: 'stage 2',
                    events: [
                        {
                            name: 'nick name',
                            type: 'textbox',
                            required:true
                        },
                        {
                            name:"AwesomePerson",
                            type:"boolean",
                            required:false
                        },
                        {
                            name:"Date Of Birth",
                            type:"date",
                            required:true
                        }
                    ]
                }
            ]
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

                    { this.state.selectedProg &&
                        <div style={styles.table}>
                            <EditTable tableProps={tableProps} tableHeaderProps = {tableHeaderProps} tableBodyProps={tableBodyProps} data={data} rowCount={10} />
                        </div>
                    }

                </div>
            </div>
        );
    }
}

App.propTypes = { d2: React.PropTypes.object, root: React.PropTypes.any };
App.childContextTypes = { d2: React.PropTypes.object, root: React.PropTypes.any, muiTheme: React.PropTypes.object.isRequired };

export default App;
