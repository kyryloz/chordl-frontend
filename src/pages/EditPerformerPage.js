import React from "react";
import * as $ from "jquery";
import FlatButton from "material-ui/FlatButton";
import update from "react-addons-update";
import TextField from "material-ui/TextField";
import BasePageTemplate from "./BasePageTemplate";
import api from "../api";

export default class EditPerformerPage extends BasePageTemplate {

    constructor(props) {
        super(props);

        this.state = {performer: {
            name: "",
            id: -1
        }}
    }

    componentDidMount() {
        this.loadPerformer();
    }

    loadPerformer() {
        $.ajax({
            url: api.performers + this.props.params.id,
            dataType: 'json',
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                this.setState({performer: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    updatePerformer() {
        $.ajax({
            url: api.performers + this.state.performer.id,
            dataType: 'json',
            type: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(this.state.performer),
            success: function (data) {
                this.setState({performer: data});
                this.handleCancel();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    handleNameChange = (event) => {
        const newState = update(this.state, {
            performer: {
                name: {$set: event.target.value}
            }
        });
        this.setState(newState);
    };

    handleSave = () => {
        this.updatePerformer();
    };

    handleCancel = () => {
        this.context.router.replace("/performer/" + this.state.performer.id)
    };

    renderHeader() {
        return (
            <TextField
                value={this.state.performer.name}
                onChange={this.handleNameChange}
                floatingLabelText="Name"
                floatingLabelFixed={true}
            />
        )
    }

    renderContent() {
        return (
            <div>
                <div style={{float: 'right', marginTop: 10}}>
                    <FlatButton
                        label="Save"
                        primary={true}
                        disabled={!this.state.performer.name}
                        onTouchTap={this.handleSave}
                    />
                    <FlatButton
                        label="Cancel"
                        labelStyle={{color: 'red'}}
                        onTouchTap={this.handleCancel}
                    />
                </div>
            </div>
        )
    }
}

EditPerformerPage.contextTypes = {
    router: React.PropTypes.object
};