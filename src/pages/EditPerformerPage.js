import React from "react";
import * as $ from "jquery";
import update from "react-addons-update";
import BasePageTemplate from "./BasePageTemplate";
import api from "../global/api";
import {Button, FormGroup, ControlLabel, FormControl} from "react-bootstrap/lib";

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
            url: `${api.performers}/${this.props.params.id}`,
            dataType: 'json',
            type: 'GET',
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
            url: `${api.performers}/${this.state.performer.id}`,
            dataType: 'json',
            type: 'PUT',
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

    handleSave = (e) => {
        e.preventDefault();
        this.updatePerformer();
    };

    handleCancel = () => {
        this.context.router.replace("/performer/" + this.state.performer.id)
    };

    getValidationState(text) {
        if (text.length === 0) return 'error';
    }

    renderHeader() {
        return (
            <h3>
                {this.state.performer.name}
            </h3>
        )
    }

    renderContent() {
        return (
            <form onSubmit={this.handleSave}>
                <FormGroup
                    controlId="formBasicText"
                    validationState={this.getValidationState(this.state.performer.name)}
                >
                    <ControlLabel>Name</ControlLabel>
                    <FormControl
                        style={{fontFamily: "monospace"}}
                        type="text"
                        placeholder="Name"
                        value={this.state.performer.name}
                        onChange={this.handleNameChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <FormGroup>
                    <Button
                        disabled={this.state.performer.name.length === 0}
                        type="submit"
                        bsStyle="success"
                        style={{width: 120}}>
                        Save
                    </Button>
                    <Button style={{marginLeft: 16, width: 120}} onClick={this.handleCancel}>
                        Cancel
                    </Button>
                </FormGroup>
            </form>
        )
    }
}

EditPerformerPage.contextTypes = {
    router: React.PropTypes.object
};