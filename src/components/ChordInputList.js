import React from "react";
import ChordInput from "../components/ChordInput";

export default class ChordInputList extends React.Component {

    renderUnknownChords() {
        const nodes = [];

        this.props.chords.forEach(chord => {
            if (!chord.diagram || chord.isNew) {
                nodes.push(<ChordInput
                    callback={this.props.onChange}
                    chord={chord}
                    disabled={this.props.disabled}
                    style={{marginLeft: 16}}
                    key={chord.name}
                    diagram="xxxxxx"/>)
            }
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
                    {this.renderUnknownChords()}
                </div>
            </div>
        )
    }
}