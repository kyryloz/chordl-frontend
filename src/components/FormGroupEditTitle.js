import React from "react";
import {FormGroup, ControlLabel, FormControl} from "react-bootstrap/lib";
import * as Validator from "../util/validator";

export default class FormGroupEditTitle extends React.Component {

    render() {
        return (
            <FormGroup
                controlId="formBasicText"
                validationState={Validator.validateTitle(this.props.value)}
            >
                <ControlLabel>Title</ControlLabel>
                <FormControl
                    disabled={this.props.disabled}
                    type="text"
                    placeholder="Title"
                    value={this.props.value}
                    onChange={this.props.onChange}
                />
                <FormControl.Feedback />
            </FormGroup>
        )
    }
}