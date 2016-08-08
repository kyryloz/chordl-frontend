import React from "react";
import SearchBar from "./SearchBar";
import RaisedButton from "material-ui/RaisedButton";
import {Toolbar, ToolbarGroup, ToolbarTitle} from "material-ui/Toolbar";

const styles = {
    appBar: {
        backgroundColor: '#607D8B'
    },
    toolbarTitle: {
        fontFamily: 'sans-serif',
        color: '#ffffff'
    },
    toolbarSearchBar: {
        marginTop: '6px',
        width: '460px'
    }
};

export default class Header extends React.Component {

    render() {
        return (
            <div className="header">
                <div>
                    <Toolbar style={styles.appBar} zDepth={2}>
                        <ToolbarTitle text="Chords database" style={styles.toolbarTitle}/>
                        <ToolbarGroup lastChild={true}>
                            <SearchBar style={styles.toolbarSearchBar}/>
                            <RaisedButton label="Search" primary={false}/>
                        </ToolbarGroup>
                    </Toolbar>
                </div>
            </div>
        )
    }
}