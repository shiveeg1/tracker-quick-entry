import React from 'react';
import log from 'loglevel';

import HeaderBar from 'd2-ui/lib/header-bar/HeaderBar.component';
import OrgUnitTree from 'd2-ui/lib/org-unit-tree';

import AppTheme from '../theme';

class App extends React.Component {
    constructor(props,context){
        super(props);
        this.state = Object.assign({},{
            programList:[],
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
        };
    }

    componentDidMount() {
    console.log("did mount");
    }

    componentWillUnmount() {
        console.log("will mount");
    }

    _sidebarItemClicked(sideBarItemKey) {
        log.info('Clicked on ', sideBarItemKey);
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
              minHeight:'100%',
              height: 'auto',
              width: '100%',
              overflowX: 'hidden',
              display:'flex',
              left: '0px',
              backgroundColor: AppTheme.rawTheme.palette.canvasColor,
           },
        };

        console.log(AppTheme);
        return (
            <div className="app-wrapper" style={styles.parent}>
                <HeaderBar />
                <div style={styles.box}>
                    <div style={styles.treeBox}>
                        <OrgUnitTree
                              root={this.props.root}
                              onClick={this._handleOrgTreeClick}
                              selected={this.state.selectedOrg}
                          />
                    </div>
                </div>

                <div className="content-area" style={styles.forms}>
                    <div style={styles.header}>
                         <p>Your component is loaded </p>
                    </div>
                </div>


            </div>
        );
    }
}

App.propTypes = { d2: React.PropTypes.object, root: React.PropTypes.any };
App.childContextTypes = { d2: React.PropTypes.object, root: React.PropTypes.any };

export default App;
