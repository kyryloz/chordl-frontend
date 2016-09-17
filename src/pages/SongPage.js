import React from "react";
import * as $ from "jquery";
import {Link} from "react-router";
import BasePageTemplate from "./BasePageTemplate";
import SongTitle from "../components/SongTitle";
import api from "../global/api";
import {Button, Alert} from "react-bootstrap/lib";
import HistoryList from "../components/HistoryList";
import Highlight from "../components/Highlight";

export default class SongPage extends BasePageTemplate {

    constructor(props) {
        super(props);

        this.state = {
            id: -1,
            performerId: -1,
            performerName: "",
            title: "",
            lyrics: "",
            histories: [],
            historyPretty: "",
            historyPrettyModalOpened: false,
            historyClickedId: -1
        }
    }

    componentDidMount() {
        this.loadSong();
    }

    loadSong() {
        this.startLoading();
        $.ajax({
            url: `${api.songs}/${this.props.params.id}`,
            type: 'GET',
            success: function (data) {
                this.setState(data);
                this.finishLoading();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(xhr, status, err);
            }
        });
    }

    handleEdit = (e) => {
        e.preventDefault();
        this.context.router.push("/song/" + this.state.id + "/edit");
    };

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
                this.setState({
                    ...data,
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

    renderHeader() {
        return <h3 style={{display: 'flex', flexDirection: 'row'}}>
            <Link to="/">#</Link>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <SongTitle
                song={this.state}
                linkifyPerformer={true}
            />
        </h3>
    }

    renderMenu() {
        if (this.props.user) {
            return <Button onClick={this.handleEdit}>EDIT</Button>
        } else {
            return null;
        }
    }

    renderContent() {
        return (
            <div>
                <pre style={{marginTop: 16}}>{this.state.lyrics}</pre>
                <br/>
                <h4>History:</h4>
                {this.state.historyPrettyModalOpened &&
                <Alert>
                        <pre>
                            <Highlight enabled={true} text={this.state.historyPretty}/>
                        </pre>
                    <Button onClick={this.handleApplyHistoryClick}>
                        Rollback
                    </Button>
                    <Button onClick={this.handleHistoryModalClose}>
                        Close
                    </Button>
                </Alert>
                }
                <HistoryList callback={this.handleHistoryClick} history={this.state.histories}/>
            </div>
        )
    }
}

SongPage.contextTypes = {
    router: React.PropTypes.object
};