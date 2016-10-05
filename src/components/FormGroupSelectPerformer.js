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

    render() {
        return (
            <FormGroup
                controlId="formBasicText"
                validationState={Validator.validatePerformer(this.props.performerName, this.props.performerExists)}
            >
                <ControlLabel>Performer</ControlLabel>
                <SelectPerformer
                    disabled={this.props.disabled}
                    onChange={this.props.onChange}
                    performerNames={this.state.performerNames}/>
                <FormControl.Feedback />
            </FormGroup>
        )
    }
}