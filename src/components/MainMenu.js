import * as React from "react";
import {List, ListItem} from "material-ui/List";

export default class MainMenu extends React.Component {
    render() {
        return (
            <List>
                <ListItem primaryText="Add song" href="#/add"/>
                <ListItem primaryText="All songs" href="#/all"/>
                <ListItem primaryText="About" href="#/about"/>
            </List>
        );
    }
}