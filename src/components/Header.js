import React from "react";
import SearchBar from "./SearchBar";
import RaisedButton from "material-ui/RaisedButton";
import AppBar from "material-ui/AppBar";
import {Toolbar, ToolbarGroup, ToolbarTitle} from "material-ui/Toolbar";
import {hashHistory} from 'react-router';

const styles = {
    appBar: {
        backgroundColor: '#607D8B'
    },
    toolbarTitle: {
        fontFamily: 'sans-serif',
        color: '#ffffff'
    },
    toolbarSearchBar: {
        marginTop: 6,
        marginRight: 16,
        width: 460
    }
};

export default class Header extends React.Component {

    renderChildren() {
        return (
            <div>
                <SearchBar style={styles.toolbarSearchBar}/>
                <RaisedButton label="Search" primary={false}/>
            </div>
        )
    }

    navigateToIndex() {
        hashHistory.replace("/");
    }

    renderTitle() {
        return (
            <div style={{
                lineHeight: '100%',
                width: '100%',
                cursor: 'pointer'
            }}>
                <div style={{
                    fontSize: 20,
                    height: 20,
                    marginTop: 12
                }}>
                    Chords database
                </div>
                <div style={{
                    fontSize: 12,
                    height: 30,
                    color: '#D9D9D9'
                }}>
                    Just chords, no bullshit
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="header">
                <AppBar
                    title={this.renderTitle()}
                    style={styles.appBar}
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    children={this.renderChildren()}
                    onTitleTouchTap={this.navigateToIndex}
                />
            </div>
        )
    }
}