import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';

const wrapperStyle = {
    backgroundColor:'white',
    zIndex:'10',
    textAlign:'center',
    position:'absolute',
    right:0,
    paddingRight:24,
    paddingLeft:24,
    paddingTop:8,
    paddingBottom:8,
    width:152,
    marginTop:-34,
    borderLeft:'solid 1px #bdbdbd',
    borderTop:'solid 1px #bdbdbd'
};

const ButtonWrapper = (props) => (
    <div style={wrapperStyle}>
        <FlatButton label={props.label} labelStyle={props.labelStyle} onClick={props.onClick} icon={props.icon} style={props.style}/>
    </div>
);

ButtonWrapper.defaultProps = {label:"PLACEHOLDER"};

ButtonWrapper.propTypes = {
    label : React.PropTypes.string,
    labelStyle : React.PropTypes.object,
    onClick : React.PropTypes.func,
    style : React.PropTypes.object

}

export default ButtonWrapper;
