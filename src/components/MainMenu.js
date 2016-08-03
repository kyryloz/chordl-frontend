import {List, ListItem} from "material-ui/List";
import * as React from "react";

const styles = {
    active: {
        backgroundColor: '#dddddd'
    },
    inactive: {
        backgroundColor: '#ffffff'
    }
};

export default class MainMenu extends React.Component {

    constructor(props) {
        super(props)
    }

    getStyle(path) {
        const {history} = this.props;
        return history.isActive(path, true) ? styles.active : styles.inactive;
    }

    render() {
        return (
            <List>
                <ListItem style={this.getStyle("")} primaryText="Home" href="#/"/>
                <ListItem style={this.getStyle("add")} primaryText="Add song" href="#/add"/>
                <ListItem style={this.getStyle("all")} primaryText="All songs" href="#/all"/>
                <ListItem style={this.getStyle("about")} primaryText="About" href="#/about"/>
            </List>
        );
    }
}