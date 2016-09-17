import React from "react";
import {Button, Modal} from "react-bootstrap/lib";
import HistoryList from "./HistoryList";
import Highlight from "./Highlight";
import api from "../global/api";
import * as $ from "jquery";

export default class History extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            historyPretty: "",
            historyPrettyModalOpened: false,
            historyClickedId: -1
        }
    }

    handleHistoryClick = (history) => {
        $.ajax({
            url: `${api.history}/pretty?historyId=${history.id}`,
            type: 'GET',
            success: function (data) {
                this.setState({
                    historyPretty: data.diff,
                    historyPrettyModalOpened: true,
                    historyClickedId: history.id
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(xhr, status, err);
            }
        });
    };

    handleApplyHistoryClick = (history) => {
        $.ajax({
            url: `${api.history}/apply?historyId=${this.state.historyClickedId}&songId=${this.state.id}`,
            type: 'GET',
            success: function (data) {
                this.props.callback(data);
                this.setState({
                    historyPretty: "",
                    historyPrettyModalOpened: false,
                    historyClickedId: -1
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(xhr, status, err);
            }
        });
    };

    handleHistoryModalClose = () => {
        this.setState({
            historyPrettyModalOpened: false
        });
    };

    render() {
        return (
            <div>
                <h4>History:</h4>
                <HistoryList callback={this.handleHistoryClick} history={this.props.histories}/>
                <Modal show={this.state.historyPrettyModalOpened} onHide={this.handleHistoryModalClose}>
                    <Modal.Header>
                        <Modal.Title>History</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <pre>
                            <Highlight enabled={true} text={this.state.historyPretty}/>
                        </pre>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.handleHistoryModalClose}>Close</Button>
                        <Button onClick={this.handleApplyHistoryClick} bsStyle="primary">Rollback</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

History.contextTypes = {
    router: React.PropTypes.object
};