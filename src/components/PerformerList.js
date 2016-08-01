import * as React from "react";
import {List, ListItem} from "material-ui/List";

export default class PerformerList extends React.Component {
    render() {
        var performerNodes = this.props.data.map(function (performer) {
            return (
                <ListItem primaryText={performer.name} key={performer.id}/>
            );
        });

        return (
            <List>
                {performerNodes}
            </List>
        );
    }
}