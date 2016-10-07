import React from "react";
import {requestPostPerformer} from "../global/api";
import Typeahead from "react-bootstrap-typeahead";
import {Button} from "react-bootstrap/lib";
import * as validator from "../util/validator";

export default class SelectPerformer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            performerName: "",
            performerSubmitting: false
        }
    }

    handlePerformerInputChange = (name) => {
        this.setState({
            performerName: typeof name === "string" ? name : name[0],
        }, () => {
            this.props.onChange(name, this.isPerformerExists());
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

        requestPostPerformer(data)
            .then(this.handlePerformerSubmitted)
            .catch(this.handleError);
    };

    handlePerformerSubmitted = (data) => {
        this.props.performerNames.push(data.name);

        this.setState({
            performerName: data.name,
            performerSubmitting: false,
        });
        this.props.onChange(data.name, true);
    };

    handleError = () => {
        this.setState({
            performerSubmitting: false,
        });
    };

    renderCreatePerformerButton = () => {
        return (
            <div style={{margin: '12px 0'}}>
                <Button
                    disabled={this.isPerformerSubmittingInProgress()
                    || !validator.validatePerformer(this.state.performerName, true, true)
                    || this.props.submitting}
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
                    disabled={this.props.disabled}
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