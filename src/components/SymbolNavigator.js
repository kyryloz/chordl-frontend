import * as React from "react";
import {IndexLink} from "react-router";
import colors from "../colors"
import PerformerList from "./PerformerList"

const styles = {
    active: {
        color: colors.accentColor
    },

    nonactive: {
        color: colors.defaultPrimaryColor
    }
};

export default class SymbolNavigator extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <IndexLink style={styles.nonactive} activeStyle={styles.active} to='all/a'>A</IndexLink>&nbsp;
                <IndexLink style={styles.nonactive} activeStyle={styles.active} to='all/b'>B</IndexLink>&nbsp;
                <IndexLink style={styles.nonactive} activeStyle={styles.active} to='all/c'>C</IndexLink>
                <PerformerList performers={this.props.performers} filterSymbol={this.props.symbol}/>
            </div>
        )
    }
}