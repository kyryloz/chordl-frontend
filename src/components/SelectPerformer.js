import React from "react";
import * as $ from "jquery";
import api from "../global/api";
import Typeahead from "react-bootstrap-typeahead";
import {Button} from "react-bootstrap/lib";


export default class SelectPerformer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            performerName: "",
            performerSubmitting: false,
        }
    }

    handlePerformerInputChange = (name) => {
        this.setState({
            performerName: typeof name === "string" ? name : name[0],
        }, () => {
            this.props.callback(name, this.isPerformerExists());
        });
    };

    isPerformerExists = () => {
        return this.props.performerNames
            .some(e => this.state.performerName.toLowerCase() === e.toLowerCase());
    };

    shouldRenderCreateButton = () => {
        return this.state.performerName.length > 1 && !this.isPerformerExists();
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
            this.props.performerNames.push(data.name);

            this.setState({
                performerName: data.name,
                performerSubmitting: false,
            });
            this.props.callback(data.name, true);
        } else {
            this.setState({
                performerSubmitting: false,
            });
        }
    };

    renderCreatePerformerButton = () => {
        return (
            <div style={{margin: '12px 0'}}>
                <Button
                    disabled={this.isPerformerSubmittingInProgress() || !this.state.performerName}
                    bsStyle="link"
                    onClick={this.handlePerformerSubmit}>
                    {this.isPerformerSubmittingInProgress() ? 'Creating...' : 'CREATE NEW'}
                </Button>
            </div>
        );
    };

    render() {
        return (
            <div>
                <Typeahead
                    placeholder="Start typing the name of performer"
                    onInputChange={this.handlePerformerInputChange}
                    value={this.state.performerName}
                    options={this.props.performerNames}
                />
                <div style={{textAlign: "right"}}>
                    {this.shouldRenderCreateButton() && this.renderCreatePerformerButton()}
                </div>
            </div>
        )
    }
}