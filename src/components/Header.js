import React from "react";
import SearchBar from "./SearchBar";
import RaisedButton from "material-ui/RaisedButton";
import {Toolbar, ToolbarGroup, ToolbarTitle} from "material-ui/Toolbar";

const styles = {
    toolbarTitle: {
        fontFamily: 'sans-serif',
        color: '#777777'
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
                    <Toolbar style={styles.appBar}>
                        <ToolbarTitle text="Chords database" style={styles.toolbarTitle}/>
                        <ToolbarGroup lastChild={true}>
                            <SearchBar style={styles.toolbarSearchBar}/>
                            <RaisedButton label="Search" primary={true}/>
                        </ToolbarGroup>
                    </Toolbar>
                </div>
            </div>
        )
    }
}