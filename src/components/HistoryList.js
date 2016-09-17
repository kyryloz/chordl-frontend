import * as React from "react";
import moment from "moment";

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

export default class HistoryList extends React.Component {

    handleHistoryClick = (history) => {
        this.props.callback(history);
    };

    renderListItem(history) {
        return (
            <div style={styles.node}>
                <a style={styles.link} onClick={this.handleHistoryClick.bind(null, history)}>
                    {moment(history.timestamp).format("MMMM, D, YYYY, HH:mm")}
                </a>
            </div>
        )
    }

    render() {
        const resultNodes = this.props.history.map((history) => {
            return <li key={history.id}>{this.renderListItem(history)}</li>;
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