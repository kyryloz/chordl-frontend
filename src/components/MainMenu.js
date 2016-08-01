import * as React from "react";
import {List, ListItem} from "material-ui/List";

export default class MainMenu extends React.Component {
    render() {
        return (
            <List>
                <ListItem primaryText="Performers" key="0"/>
                <ListItem primaryText="Songs" key="1"/>
                <ListItem primaryText="About" key="2"/>
            </List>
        );
    }
}