import React from "react";
import SelectPerformer from "./SelectPerformer";
import {FormGroup, ControlLabel, FormControl} from "react-bootstrap/lib";
import * as Validator from "../util/validator";
import {requestGetAllPerformers} from "../global/api";

export default class FormGroupSelectPerformer extends React.Component {

    constructor() {
        super();

        this.state = {
            performerNames: [],
        };
    }

    componentDidMount() {
        requestGetAllPerformers()
            .then(data => {
                this.setState({
                    performerNames: data
                });
            })
            .catch(console.log)
    }

    isPerformerExists = (performerName) => {
        return this.state.performerNames
            .some(e => performerName.toLowerCase() === e.toLowerCase());
    };

    shouldRenderPerformerCreateLabel = () => {
        return this.props.performerName.length > 1 && !this.isPerformerExists(this.props.performerName);
    };

    onPerformerChange = (performerName) => {
        this.props.onChange(performerName, this.isPerformerExists(performerName));
    }

    render() {
        return (
            <FormGroup
                controlId="formBasicText"
                validationState={Validator.validatePerformer(
                        this.props.performerName,
                        this.isPerformerExists(this.props.performerName))}
            >
                <ControlLabel>Performer</ControlLabel>
                <SelectPerformer
                    disabled={this.props.disabled}
                    onChange={this.onPerformerChange}
                    performerNames={this.state.performerNames}
                    renderCreateLabel={this.shouldRenderPerformerCreateLabel()}/>
                <FormControl.Feedback />
            </FormGroup>
        )
    }
}