import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ArrowDown from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-down';

export default class ButtonWrapper extends React.Component {
    constructor(props,context) {
        super(props,context);
        this.props = props;
        this.context = context;
        this.state = {
            rotate: null
        }
    }

    handleFabClick() {
        this.setState({
            rotate: !this.state.rotate
        });
        this.props.toggleCard();
    }

    render() {
        const styles = {
            wrapperStyle : {
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
                marginTop:-1,
                borderBottom:'solid 1px #bdbdbd',
                borderLeft:'solid 1px #bdbdbd',
                borderTop:'solid 1px #bdbdbd',
            },
            fabStyle : {
                position: "absolute",
                right:10,
                transform: this.state.rotate ? "rotate(180deg)" : "rotate(0deg)",
                transition:"transform 0.5s",
            }
        };

        return (
            <div style={styles.wrapperStyle}>
                <FlatButton label={this.props.label} labelStyle={this.props.labelStyle} onClick={this.props.onClick} icon={this.props.icon} style={this.props.style}/>
                {this.props.status &&
                    <FloatingActionButton
                        mini={true}
                        backgroundColor={styles.wrapperStyle.backgroundColor}
                        secondary={true}
                        style={styles.fabStyle}
                        onClick={this.handleFabClick.bind(this)}>
                        <ArrowDown color={this.context.muiTheme.rawTheme.palette.primary1Color}/>
                    </FloatingActionButton>
                }
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

ButtonWrapper.contextTypes = {muiTheme: React.PropTypes.object.isRequired}
