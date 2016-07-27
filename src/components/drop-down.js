import React from 'react';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Colors from 'material-ui/lib/styles/colors';

var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

const styles = {
    customize: {
      fontFamily:'Roboto, Arial, sans-serif',
      fontSize:'16px',
      width:'auto',
    }
};

export default class HackyDropDown extends React.Component {

    constructor(props) {
        super(props);
        if(this.props.menuItems.length>0){
          this.state = {
            value : this.props.menuItems[0].id
          }
        }
        else {
            this.state = {value: "null"}
        }
    }

    shouldComponentUpdate = (nextProps,nextState) => {
      if(JSON.stringify(nextProps)==JSON.stringify(this.props) && JSON.stringify(nextState)==JSON.stringify(this.state))
        return false;
      else
        return true;
    }

    componentWillReceiveProps = (nextProps) => {
        if(JSON.stringify(this.props.menuItems)!=JSON.stringify(nextProps.menuItems)) {
            if(nextProps.menuItems.length>0){
                this.setState({
                    value: nextProps.menuItems[0].id
                })
            } else {
                this.setState({
                    value: "null"
                })
            }
        }

    }

    handleChange = (event, index, value) => {
        this.setState({value});
        this.props.onChange({target: {value: value}});
    }

    renderMenuItems(menuItems) {
        if (menuItems.length >0) {
            return menuItems.map(item => {
                return (
                    <MenuItem key={item.id} value={item.id} primaryText={item.displayName} disabled={!!item.disabled}/>
                );

            });
        }
        else {
            return <MenuItem value="null" primaryText={this.props.emptyLabel}/>;
        }
    }

    render() {
        const defaultStyle = {
            underline: {
              borderTop: !!this.props.errorText?'solid 1px'+Colors.red500:'solid 1px #bdbdbd',
              bottom: 1,
              left: 0,
              margin: '0px ' + 'spacing.desktopGutter' + 'px',
              right: 0,
              position: 'absolute'
          },
          icon: {
            fill: !!this.props.errorText?'red':'#bdbdbd',
          },
        }
        const {onChange, menuItems, ...other} = this.props;
        return (
            <div>
                {this.state.value=="null"?
                <progress></progress>:
                <SelectField value={this.state.value}
                    onChange={this.handleChange.bind(this)}
                    style={Object.assign({},styles.customize,this.props.style)}
                    underlineStyle={defaultStyle.underline}
                    iconStyle={defaultStyle.icon}
                    autoWidth={true}
                    disabled={this.props.menuItems.length>1?false:true}
                    floatingLabelText={this.props.floatingLabelText}>
                    {this.renderMenuItems(Array.isArray(this.props.menuItems) ? this.props.menuItems : this.props.menuItems.toArray())}
                </SelectField>}
            </div>
        );
    }
}

HackyDropDown.propTypes = {
    defaultValue: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
        React.PropTypes.bool,
    ]),
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    menuItems: React.PropTypes.oneOfType([
        React.PropTypes.array,
        React.PropTypes.object,
    ]),
    includeEmpty: React.PropTypes.bool,
    emptyLabel: React.PropTypes.string,
};

HackyDropDown.defaultProps = {
    includeEmpty: false,
    emptyLabel: '',
};
