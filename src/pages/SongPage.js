import React from "react";
import * as $ from "jquery";
import {Link} from "react-router";
import BasePageTemplate from "./BasePageTemplate";
import SongTitle from "../components/SongTitle";
import api from "../global/api";
import {Button} from "react-bootstrap/lib";
import DiffList from "../components/DiffList";

export default class SongPage extends BasePageTemplate {

    constructor(props) {
        super(props);

        this.state = {
            song: {
                id: -1,
                performerId: -1,
                performerName: "",
                title: "",
                lyrics: ""
            },
            contextMenuOpened: false,
            diffs: []
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
                this.setState({song: data});
                this.loadSongDiffs();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(xhr, status, err);
            }
        });
    }

    loadSongDiffs() {
        $.ajax({
            url: `${api.diff}/${this.state.song.id}`,
            type: 'GET',
            success: function (data) {
                this.setState({
                    diffs: data
                });
                this.finishLoading();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(xhr, status, err);
            }
        });
    }

    handleEdit = (e) => {
        e.preventDefault();
        this.context.router.push("/song/" + this.state.song.id + "/edit");
    };

    handleDiffClick = (diff) => {
        $.ajax({
            url: `${api.diff}/undo?diffId=${diff.id}&songId=${this.state.song.id}`,
            type: 'GET',
            success: function (data) {
                this.setState({
                    song: data
                });
                this.loadSongDiffs();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(xhr, status, err);
            }
        });
    };

    renderHeader() {
        return <h3 style={{display: 'flex', flexDirection: 'row'}}>
            <Link to="/">#</Link>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <SongTitle
                song={this.state.song}
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
                <pre style={{marginTop: 16}}>{this.state.song.lyrics}</pre>
                <br/>
                <h4>History:</h4>
                <DiffList callback={this.handleDiffClick} diffs={this.state.diffs}/>
            </div>
        )
    }
}

SongPage.contextTypes = {
    router: React.PropTypes.object
};