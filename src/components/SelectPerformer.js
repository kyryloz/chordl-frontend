import React from "react";
import Typeahead from "react-bootstrap-typeahead";

export default class SelectPerformer extends React.Component {

    handlePerformerInputChange = (name) => {
        this.props.onChange(typeof name === "string" ? name : name[0], this.isPerformerExists());
    };

    shouldRenderPerformerCreateLabel = () => {
        return this.props.renderCreateLabel;
    };

    renderPerformerCreateLabel = () => {
        return (
            <div style={{margin: '12px 0'}}>
                <p>
                    Performer will be created
                </p>
            </div>
        );
    };

    render() {
        return (
            <div>
                <Typeahead
                    disabled={this.props.disabled}
                    placeholder="Start typing the name of performer"
                    onInputChange={this.props.onChange}
                    value={this.props.performerName}
                    options={this.props.performerNames}
                />
                <div style={{textAlign: "right"}}>
                    {this.shouldRenderPerformerCreateLabel() && this.renderPerformerCreateLabel()}
                </div>
            </div>
        )
    }
}