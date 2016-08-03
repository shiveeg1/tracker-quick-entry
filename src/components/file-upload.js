import React from 'react';
import ReactDom from 'react-dom';
import log from 'loglevel';

import LinearProgress from 'material-ui/lib/linear-progress';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import Checkbox from 'material-ui/lib/checkbox';
import FontIcon from 'material-ui/lib/font-icon';

import AppTheme from '../theme';

export default class FileUpload extends React.Component {

    constructor(props,context) {
        super(props,context);
        this.state = {
            uploading: false,
            progress: undefined,
            saved: null
        }
    }

    renderUploading() {
        const progressStyle = {
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex: 1,
        };

        return (
            <div>
                <FlatButton label='cancel Upload' onClick={this._fileClick.bind(this)} />
                <div style={progressStyle}>
                    <LinearProgress mode={this.state.progress ? 'determinate' : 'indeterminate'} value={this.state.progress}/>
                </div>
            </div>
        );
    }

    getIcon = () => {
        console.log("get icon called");
        if(this.state.saved && !this.state.uploading) {
            return <FontIcon className="material-icons">done</FontIcon>
        }
        else if(this.state.saved === false && !this.state.uploading) {
            return <FontIcon className="material-icons">warning</FontIcon>
        }
        else {
            return (
                <FontIcon
                    className="material-icons"
                    style={{color:this.context.muiTheme.rawTheme.palette.primary1Color}}>file_upload
                </FontIcon>
            )

        }
    }

    getIconStyle = () => {
        if(this.state.saved && !this.state.uploading) {
            console.log("successColor");
            return {color :this.context.muiTheme.rawTheme.palette.successColor}
        }
        else if(this.state.saved === false && !this.state.uploading) {
            return {color :this.context.muiTheme.rawTheme.palette.warningColor}
        }
        else {
            return {color :this.context.muiTheme.rawTheme.palette.primary1Color}
        }
    }

    renderUpload() {
        const bodyStyle = {
            backgroundColor: AppTheme.rawTheme.palette.primary1Color,
            textAlign: 'center',
            overflow: 'auto',
            padding: 48,
        };
        const dialogImgStyle = {
          maxWidth: '100%',
          maxHeight: '70vh',
        };

        return (
            <FlatButton label={this.props.label} icon={this.getIcon.call()} style={this.getIconStyle.call()} onClick={this._fileClick.bind(this)} />
        );
    }

    render() {
        const {onFocus, onBlur, onChange, ...other} = this.props;

        const containerStyle = {
            position: 'relative',
            display: 'block',
            whiteSpace: 'nowrap',
        };

        const checkStyle = {
            display: 'inline-block',
            whiteSpace: 'nowrap',
            paddingRight: 8,
            paddingTop: 8,
            paddingBottom: 8,
        };

        const btnStyle = {
            display: 'inline-block',
            position: 'relative',
            top: 2,
        };

        return (
            <div style={containerStyle}>
                <div style={btnStyle}>
                    { this.state.uploading ? this.renderUploading() : this.renderUpload() }
                    <input type="file"
                           style={{visibility: 'hidden', display: 'none'}}
                           ref={(ref) => this.fileInput = ref}
                           onChange={this._upload.bind(this)} />
                </div>
            </div>
        );
    }

    _fileClick(e) {
        if (this.fileInput && !this.state.uploading) {
            ReactDom.findDOMNode(this.fileInput).click(e);
        } else if (this.state.uploading) {
            this.xhr.abort();
            this.setState({uploading: false, progress: undefined});
            log.info('File upload cancelled');
        }
    }

    _upload(e) {
        if (e.target.files.length === 0) {
            return;
        }

        this.setState({
            uploading: true,
            progress: undefined,
        });

        const api = this.context.d2.Api.getApi();
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (progress) => {
            if (progress.lengthComputable) {
                this.setState({progress: (progress.loaded / progress.total) * 100});
            } else {
                this.setState({progress: undefined});
            }
        };
        this.xhr = xhr;

        const data = new FormData();
        data.append('file', e.target.files[0]);

        api.post('fileResources', data, {
            contentType: false,
            processData: false,
            xhr: () => { return xhr; },
        }).then((response) => {
            log.info('File uploaded successfully');
            this.props.onChange({target: {value: true,response: response}});
            this.setState({
                uploading: false,
                progress: undefined,
                saved: true,
            });
        }).catch(() => {
            log.warn('File upload failed:', arguments);
            this.props.onChange({target: {value: false,response: arguments}});
            this.setState({
                uploading: false,
                progress: undefined,
                saved: false,
            });
        });
    }
}

FileUpload.propTypes = {
    label: React.PropTypes.string.isRequired,
    onFocus: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func,
};

FileUpload.contextTypes = {muiTheme: React.PropTypes.object.isRequired, d2: React.PropTypes.object};
