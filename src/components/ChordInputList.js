import React from "react";
import ChordInput from "../components/ChordInput";

export default class ChordInputList extends React.Component {

    renderChords() {
        const nodes = [];

        this.props.chords.forEach(chord => {
            console.log("chord", chord)
            nodes.push(<ChordInput
                callback={this.props.onChange}
                chord={chord}
                disabled={this.props.disabled}
                style={{marginLeft: 16}}
                key={chord.name}
                diagram={chord.diagram}/>)
        });

        return nodes;
    }

    render() {
        return (
            <div>
                <p style={{marginTop: 16}}>
                    Some chords are unknown.
                    Please, specify a diagram for each chord (e.g., for C chord – 'x32010'):
                </p>
                <div style={{display: "flex", flexWrap: "wrap"}}>
                    {this.renderChords()}
                </div>
            </div>
        )
    }
}