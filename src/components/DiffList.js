import * as React from "react";
var diffMatchPatch = require('diff-match-patch-node');
import Highlight from "../components/Highlight";

const styles = {
    node: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingRight: 16
    },

    link: {
        cursor: "pointer"
    }
};

export default class DiffList extends React.Component {

    handleDiffSlick = (diff) => {
        this.props.callback(diff);
    };

    renderListItem(diff) {
        return (
            <div style={styles.node}>
                <a style={styles.link} onClick={this.handleDiffSlick.bind(null, diff)}>
                    {diff.timestamp}
                </a>
                <pre>
                    <Highlight enabled={true} text={diff.diff}/>
                </pre>
            </div>
        )
    }

    render() {
        const resultNodes = this.props.diffs.map((diff) => {
            return <li key={diff.id}>{this.renderListItem(diff)}</li>;
        });

        var result = null;
        if (resultNodes.length) {
            result = (
                <ul style={{listStyle: "none", padding: 0}}>
                    {resultNodes}
                </ul>
            );
        }

        return result;
    }

}