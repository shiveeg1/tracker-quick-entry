import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';

export default class ButtonWrapper extends React.Component {
    constructor(props,context) {
        super(props,context);
        this.props = props;
        this.context = context;
    }

    render() {
        const wrapperStyle = {
            backgroundColor:'white',
            zIndex:'10',
            textAlign:'center',
            position:'absolute',
            right:0,
            paddingRight:24,
            paddingLeft:24,
            paddingTop:9,
            paddingBottom:10,
            height:36,
            width:152,
            right:-201,
            marginTop:-1,
            border:'solid 1px #bdbdbd',
        };

        return (
            <div style={wrapperStyle}>
                <FlatButton label={this.props.label} labelStyle={this.props.labelStyle} onClick={this.props.onClick} icon={this.props.icon} style={this.props.style}/>
            </div>
        )
    }
}



ButtonWrapper.defaultProps = {label:"PLACEHOLDER"};

ButtonWrapper.propTypes = {
    label : React.PropTypes.string,
    labelStyle : React.PropTypes.object,
    onClick : React.PropTypes.func,
    style : React.PropTypes.object

}
