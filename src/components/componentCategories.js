import React from 'react';

// material-ui
import TextField from 'material-ui/lib/TextField';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Toggle from 'material-ui/lib/toggle';
import ActionDone from 'material-ui/lib/svg-icons/action/done';
import Create from 'material-ui/lib/svg-icons/content/create';
import Error from 'material-ui/lib/svg-icons/alert/error';
import IconButton from 'material-ui/lib/icon-button';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import FontIcon from 'material-ui/lib/font-icon';

//App
import HackyDropdown from './drop-down';



export default function getComponent(cell,id,hc,bc) {
    let component= {};

    const fieldBase = {
                    name: "customComponent",
                    component: TextField,
                    props: {
                        style: { width: '100%' },
                    },
                };
    switch (cell.type) {
        case 'date':
            component = Object.assign({}, fieldBase, {
                        component: DatePicker,
                        props: Object.assign({}, fieldBase.props, {
                            onChange: hc,
                            autoOk : true
                        }),
                    });
            break;
        case 'numeric':
            component = Object.assign({}, fieldBase, {
                        component: TextField,
                        changeEvent: 'onBlur',
                        props: Object.assign({}, fieldBase.props, {
                            onBlur: hc
                        }),
                    });
            break;
        case 'textbox':
            component = Object.assign({}, fieldBase, {
                        component: TextField,
                        value: "shivee",
                        changeEvent: 'onBlur',
                        props: Object.assign({}, fieldBase.props, {
                            onBlur: hc
                        }),
                    });
            break;
        case 'optionSet':
            component = Object.assign({}, fieldBase, {
                        component: HackyDropdown,
                        changeEvent: 'onChange',
                        props: Object.assign({}, fieldBase.props, {
                            value:'dropValue',
                            onChange: hc,
                            menuItems: cell.options,
                            includeEmpty: true,
                            emptyLabel: 'Select Program'
                        }),
                    });
            break;
        case 'boolean':
            component = Object.assign({}, fieldBase, {
                        component: Toggle,
                    });
            break;
        case 'icon':
            component = Object.assign({}, fieldBase, {
                        component: IconButton,
                        name:'icon'
                    });
            break;
        case 'button':
            component = Object.assign({}, fieldBase, {
                        name: 'button',
                        component: FlatButton,
                        props : {
                            label: "Save",
                            primary: true,
                        }
                    });
            break;
        default:
            component = Object.assign({}, fieldBase, {
                        component: TextField,
                        changeEvent: 'onBlur',
                        props: Object.assign({}, fieldBase.props, {
                            onBlur: hc
                        }),
                    });
    }
    return component;

}
