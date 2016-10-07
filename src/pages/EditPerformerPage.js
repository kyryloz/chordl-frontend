import React from "react";
import update from "react-addons-update";
import BasePageTemplate from "./BasePageTemplate";
import {requestGetPerformerById, requestUpdatePerformer, requestDeletePerformer} from "../global/api";
import {Button, FormGroup, ControlLabel, FormControl} from "react-bootstrap/lib";
import * as validator from "../util/validator";

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
        this.startLoading();
        requestGetPerformerById(this.props.params.id)
            .then(data => {
                this.setState({performer: data});
                this.finishLoading();
            })
            .catch(console.error);
    }

    updatePerformer() {
        requestUpdatePerformer(this.state.performer)
            .then(data => {
                this.setState({performer: data});
                this.handleCancel();
            })
            .catch(console.error);
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

    deletePerformer() {
        requestDeletePerformer(this.state.performer.id)
            .then(() => {
                this.context.router.replace("/");
            })
            .catch(console.error)
    }

    handleDelete = () => {
        this.deletePerformer();
    };

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
                    validationState={validator.validatePerformer(this.state.performer.name, true)}
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
                <FormGroup>
                    <ControlLabel style={{marginTop: 32}}>Danger section</ControlLabel>
                    <br/>
                    <Button bsStyle="danger" onClick={this.handleDelete}>
                        Delete performer with all songs
                    </Button>
                </FormGroup>
            </form>
        )
    }
}

EditPerformerPage.contextTypes = {
    router: React.PropTypes.object
};