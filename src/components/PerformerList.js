import * as React from "react";
import {List, ListItem} from "material-ui/List";

export default class PerformerList extends React.Component {

    render() {
        var performerNodes = this.props.performers.filter((performer) => {
            var filterSymbol = this.props.filterSymbol;

            if (!filterSymbol) {
                return true;
            }

            return performer.name.toLowerCase().startsWith(filterSymbol.toLowerCase());
        }).map((performer) => {
            return (
                <ListItem href={"#/performer/" + performer.id} primaryText={performer.name} key={performer.id}/>
            );
        });

        return (
            <List>
                {performerNodes}
            </List>
        );
    }
}