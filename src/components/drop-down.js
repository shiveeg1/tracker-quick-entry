import React from 'react';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

const styles = {
    customWidth: {
        width: 150,
    },
};

export default class HackyDropDown extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: "null"};
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

    renderEmptyItem() {
        if (this.props.includeEmpty) {
            return <MenuItem value="null" primaryText={this.props.emptyLabel}/>;
        }
    }

    render() {
        const {onChange, menuItems, ...other} = this.props;
        return (
            <div>
                <SelectField value={this.state.value} onChange={this.handleChange.bind(this)}>
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
