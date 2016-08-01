import * as React from "react";

import Performer from "./Performer"

export default class PerformerList extends React.Component {
    render() {
        var performerNodes = this.props.data.map(function (performer) {
            return (
                <Performer name={performer.name} key={performer.id}>
                    {/*{performer.songs}*/}
                </Performer>
            );
        });

        return (
            <div className="performerList">
                {performerNodes}
            </div>
        );
    }
}