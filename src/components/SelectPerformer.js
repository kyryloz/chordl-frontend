import React from "react";
import AutoComplete from "material-ui/AutoComplete";
import * as $ from "jquery";
import update from "react-addons-update";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import LinearProgress from "material-ui/LinearProgress";
import Snackbar from "material-ui/Snackbar";

const urlPostPerformer = 'http://localhost:8081/api/performers';

export default class SelectPerformer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            performerName: this.props.performer.name,
            id: this.props.performer.id,
            performerSubmitting: false,
            snackbarOpen: false
        }
    }

    handlePerformerChange = (input, dataSourceIndex) => {
        var performer;
        if (dataSourceIndex === -1) {
            performer = {
                performerName: input,
                id: -1
            }
        } else {
            performer = input;
        }

        this.updatePerformer(performer);
    };

    handlePerformerChangeUpdate = (input) => {
        var result = $.grep(this.props.performers, function (e) {
            return e.performerName === input;
        });

        const performer = {
            performerName: input,
            id: result.length ? result[0].id : -1
        };
        this.updatePerformer(performer);
    };

    updatePerformer(performer) {
        this.setState(update(this.state, {
            performerName: {$set: performer.performerName},
            id: {$set: performer.id}
        }));
    }

    isPerformerExists = () => {
        return this.state.id !== -1;
    };

    isPerformerSubmittingInProgress = () => {
        return this.state.performerSubmitting;
    };

    handlePerformerSubmit = (e) => {
        e.preventDefault();

        const data = {
            name: this.state.performerName
        };

        this.setState(update(this.state, {
            performerSubmitting: {$set: true}
        }));

        $.ajax({
            url: urlPostPerformer,
            dataType: 'json',
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
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
            this.props.performers.push(data);

            this.setState({
                performerName: data.name,
                id: data.id,
                performerSubmitting: false,
                snackbarOpen: true
            });
        } else {
            // TODO handle error
        }
    };

    handleNextButton = () => {
        const performer = {
            performerName: this.state.name,
            id: this.state.id
        };
        this.props.performerDoneCallback(performer)
    };

    handleSnackbarRequestClose = () => {
        const newState = update(this.state, {
            snackbarOpen: {$set: false}
        });
        this.setState(newState);
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
                    dataSourceConfig={{text: 'name', value: 'id'}}
                    maxSearchResults={5}
                    fullWidth={true}
                    searchText={this.state.performerName}
                    onNewRequest={this.handlePerformerChange}
                    onUpdateInput={this.handlePerformerChangeUpdate}
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