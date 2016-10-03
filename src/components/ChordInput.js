import * as React from "react";
import {Chord} from "react-chord-parser";
import {FormGroup, FormControl} from "react-bootstrap/lib";

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
                style={{width: 160, marginRight: 16}}
            >
                <FormControl
                    disabled={false}
                    type="text"
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