import * as React from "react";
import {Chord} from "react-chord-parser";
import {FormGroup, FormControl} from "react-bootstrap/lib";
import * as validator from "../util/validator";

export default class ChordInput extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            input: "",
        };
    }

    getDiagram = () => {
        const {diagram} = this.props.chord;
        if (validator.validateChord(diagram, true)) {
            return diagram;
        } else {
            return "xxxxxx";
        }
    };

    handleInputChange = (e) => {
        var input = e.target.value;
        this.props.callback({name: this.props.chord.name, diagram: input});
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
                <Chord style={{marginTop: 4, marginLeft: 20, width: 120, height: 120}}
                       key={this.props.chord.name}
                       name={this.props.chord.name}
                       diagram={this.getDiagram()}/>
            </FormGroup>
        )
    }
}