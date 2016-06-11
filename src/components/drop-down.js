import React from 'react';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

const styles = {
    customize: {
      fontFamily:'Roboto, Arial, sans-serif',
      fontSize:'14px',
      width:'auto',
      minWidth:'200px'
    }
};

export default class HackyDropDown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: "null"};
    }

    shouldComponentUpdate = (nextProps,nextState) => {
      if(JSON.stringify(nextProps)==JSON.stringify(this.props) && JSON.stringify(nextState)==JSON.stringify(this.state))
        return false;
      else
        return true;
    }

    componentWillReceiveProps = (nextProps) => {
      if(nextProps.menuItems.length>0){
        this.state = {
          value : nextProps.menuItems[0].id
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
                    <MenuItem key={item.id} value={item.id} primaryText={item.displayName} />
                );

            });
        }
        else {
            return <MenuItem value="null" primaryText={this.props.emptyLabel}/>;
        }
    }

    render() {
        const {onChange, menuItems, ...other} = this.props;
        return (
            <div>
                <SelectField value={this.state.value}
                    onChange={this.handleChange.bind(this)}
                    style={styles.customize}
                    autoWidth={true}>
                    {this.renderMenuItems(Array.isArray(this.props.menuItems) ? this.props.menuItems : this.props.menuItems.toArray())}
                </SelectField>
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
