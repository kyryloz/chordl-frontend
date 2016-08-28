import React from "react";
import SearchBar from "./SearchBar";
import AppBar from "material-ui/AppBar";
import {hashHistory, Link} from "react-router";
import SvgIcon from "material-ui/SvgIcon";
import IconButton from "material-ui/IconButton";

const styles = {
    appBar: {
        backgroundColor: '#607D8B',
        height: 62
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

const HomeIcon = () => (
    <SvgIcon color="white">
        <g transform="translate(-480, -190)">
            <path d="M486,197.8 L486,205.598145 L485.999914,205.598093 C486.007349,206.311236 485.532942,207.115366 484.550427,207.62066 C483.185882,208.322426 481.750973,207.979941 481.225759,207.169611 C480.700546,206.359281 481.085029,205.081106 482.449573,204.37934 C483.367261,203.907386 484.316775,203.907734 485,204.205054 L485,198 L485,194 L495,192 L495,193 L495,196 L495,204.600464 L494.999937,204.600489 C495.006283,205.313042 494.531839,206.115934 493.550427,206.62066 C492.185882,207.322426 490.750973,206.979941 490.225759,206.169611 C489.700546,205.359281 490.085029,204.081106 491.449573,203.37934 C492.367261,202.907386 493.316775,202.907734 494,203.205054 L494,196.2 Z M486,197.8"/>
        </g>
    </SvgIcon>
);

export default class Header extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {
                name: ""
            }
        }
    }

    renderChildren() {
        return (
            <div>
                <SearchBar style={styles.toolbarSearchBar}/>
                <Link
                    to={"/register"}>
                    Register
                </Link>
            </div>
        )
    }

    handleHomeIconPress =(e) => {
        e.preventDefault();
        hashHistory.replace("/");
    };

    renderTitle() {
        return (
            <div style={{
                lineHeight: '100%',
                width: '100%'
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
                    iconElementLeft={<IconButton onTouchTap={this.handleHomeIconPress}><HomeIcon /></IconButton>}
                    children={this.renderChildren()}
                />
            </div>
        )
    }
}

Header.contextTypes = {
    router: React.PropTypes.object
};