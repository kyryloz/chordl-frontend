import * as React from "react";
import {Chord} from "react-chord-parser";
import {FormGroup, FormControl} from "react-bootstrap/lib";
import * as validator from "../util/validator";

export default class ChordInput extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            input: "",
            diagram: "xxxxxx"
        };
    }

    handleInputChange = (e) => {
        var input = e.target.value;
        if (validator.validateChord(input, true)) {
            this.setState({diagram: input});
        }

        this.setState({input});
    };

    render() {
        return (
            <FormGroup
                controlId="formBasicText"
                validationState={validator.validateChord(this.state.input)}
                style={{width: 160, marginRight: 16}}
            >
                <FormControl
                    disabled={this.props.submitting}
                    type="text"
                    maxLength={6}
                    placeholder="x32010"
                    value={this.state.input}
                    onChange={this.handleInputChange}
                />
                <FormControl.Feedback/>
                <Chord style={{marginTop: 4, marginLeft: 20, width: 120, height: 120}} key={this.props.name} name={this.props.name} diagram={this.state.diagram}/>
            </FormGroup>

        )
    }
}