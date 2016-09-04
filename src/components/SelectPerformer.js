import React from "react";
import AutoComplete from "material-ui/AutoComplete";
import * as $ from "jquery";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import LinearProgress from "material-ui/LinearProgress";
import Snackbar from "material-ui/Snackbar";
import api from "../global/api";

export default class SelectPerformer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            performerName: this.props.performer,
            performerSubmitting: false,
            snackbarOpen: false
        }
    }

    handlePerformerInputChange = (input) => {
        this.setState({
            performerName: input,
        });
    };

    isPerformerExists = () => {
        return this.props.performers
            .some(e => this.state.performerName.toLowerCase() === e.toLowerCase());
    };

    isPerformerSubmittingInProgress = () => {
        return this.state.performerSubmitting;
    };

    handlePerformerSubmit = (e) => {
        e.preventDefault();

        const data = {
            name: this.state.performerName
        };

        this.setState({
            performerSubmitting: true
        });

        $.ajax({
            url: api.performers,
            type: 'POST',
            data: JSON.stringify(data),
            success: function (data) {
                console.log("Submit success", data);
                this.onPerformerSubmitted(data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                this.onPerformerSubmitted();
            }.bind(this)
        });
    };

    onPerformerSubmitted(data) {
        if (data) {
            this.props.performers.push(data.name);

            this.setState({
                performerName: data.name,
                performerSubmitting: false,
                snackbarOpen: true
            });
        } else {
            this.setState({
                performerSubmitting: false,
                snackbarOpen: false
            });
        }
    };

    handleNextButton = () => {
        const {performerName} = this.state;
        this.props.performerDoneCallback(performerName)
    };

    handleSnackbarRequestClose = () => {
        this.setState({
            snackbarOpen: false
        });
    };

    renderNextButton() {
        return (
            <div style={{margin: '12px 0'}}>
                <RaisedButton
                    label={'Next'}
                    disableTouchRipple={true}
                    disableFocusRipple={true}
                    primary={true}
                    onTouchTap={this.handleNextButton}
                    style={{marginRight: 12}}
                />
            </div>
        );
    }

    renderCreatePerformerButton = () => {
        return (
            <div style={{margin: '12px 0'}}>
                <FlatButton
                    label='Create performer'
                    disabled={this.isPerformerSubmittingInProgress() || !this.state.performerName}
                    primary={true}
                    onTouchTap={this.handlePerformerSubmit}
                />
                {this.isPerformerSubmittingInProgress() ? <LinearProgress/> : <div></div>}
            </div>
        );
    };

    render() {
        return (
            <div>
                <AutoComplete
                    floatingLabelText="Performer"
                    hintText="Start typing the name of performer"
                    filter={AutoComplete.fuzzyFilter}
                    dataSource={this.props.performers}
                    dataSourceConfig={{text: 'name'}}
                    maxSearchResults={5}
                    fullWidth={true}
                    searchText={this.state.performerName}
                    onNewRequest={this.handlePerformerInputChange}
                    onUpdateInput={this.handlePerformerInputChange}
                /><br/>
                {this.isPerformerExists() ? this.renderNextButton() : this.renderCreatePerformerButton()}
                <Snackbar
                    open={this.state.snackbarOpen}
                    message="Performer added successfully"
                    autoHideDuration={3000}
                    onRequestClose={this.handleSnackbarRequestClose}
                />
            </div>
        )
    }
}