import * as React from "react";
import {Chord, Parser} from "react-chord-parser";
import {HelpBlock, Button, FormGroup, ControlLabel, FormControl} from "react-bootstrap/lib";

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
        const pattern = /^[0-9xX]{6}$/;
        if (pattern.test(input)) {
            this.setState({diagram: input});
        }

        this.setState({input});
    };

    render() {
        return (
            <FormGroup
                controlId="formBasicText"
                validationState="error"
            >
                <FormControl
                    disabled={false}
                    type="text"
                    placeholder="xx00232"
                    style={{width: 120}}
                    value={this.state.input}
                    onChange={this.handleInputChange}
                />
                <Chord key={this.props.name} name={this.props.name} diagram={this.state.diagram}/>
            </FormGroup>

        )
    }
}