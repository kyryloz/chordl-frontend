import * as React from "react";
import moment from "moment";

export default class HistoryList extends React.Component {

    handleHistoryClick = (history) => {
        this.props.callback(history);
    };

    renderListItem(history) {
        return (
            <div>
                <a onClick={this.handleHistoryClick.bind(null, history)}>
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
                <ul>
                    {resultNodes}
                </ul>
            );
        }

        return result;
    }

}