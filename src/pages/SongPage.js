import React from "react";
import * as $ from "jquery";
import {Link} from "react-router";
import BasePageTemplate from "./BasePageTemplate";
import SongTitle from "../components/SongTitle";
import api from "../global/api";
import {Button} from "react-bootstrap/lib";
import History from "../components/History";

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

    onHistoryApplied = (song) => {
        this.setState(song);
    };

    handleEdit = (e) => {
        e.preventDefault();
        this.context.router.push("/song/" + this.state.id + "/edit");
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
                <History histories={this.state.histories} callback={this.onHistoryApplied}/>
            </div>
        )
    }
}

SongPage.contextTypes = {
    router: React.PropTypes.object
};