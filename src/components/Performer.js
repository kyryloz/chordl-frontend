import * as React from "react";

export default class Performer extends React.Component {
    render() {
        return (
            <div className="performer">
                <h2 className="performerName">
                    {this.props.name}
                </h2>
            </div>
        );
    }
}