import React from "react";
import * as $ from "jquery";
import {Link} from "react-router";
import BasePageTemplate from "./BasePageTemplate";
import SongTitle from "../components/SongTitle";
import api from "../global/api";
import {Button} from "react-bootstrap/lib";
import History from "../components/History";
import ChordParser from "chord-parser-render";
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
            createdByName: ""
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
                this.setState({
                    ...data,
                    createdByName: data.createdBy ? data.createdBy.name : "Unknown"
                }, () => {
                    this.parseChords();
                });
                this.finishLoading();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(xhr, status, err);
            }
        });
    }

    parseChords() {
        const parsed = new ChordParser(this.state.lyrics);
        const wrapped = parsed.wrap(chord => "<span style=color:#2e6da4>" + chord + "</span>");
        this.setState({
            lyrics: wrapped
        });
        const uniques = parsed.unique();
        // TODO
        console.log("unique chords", uniques);
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
                <pre style={{marginTop: 16}}>
                    <Highlight enabled={true} text={this.state.lyrics}/>
                </pre>
                <br/>
                <small>Created by <i>{this.state.createdByName}</i>.</small>
                {this.state.histories.length > 0
                    ?
                    <History {...this.props} histories={this.state.histories} callback={this.onHistoryApplied}/>
                    :
                    <div></div>
                }
            </div>
        )
    }
}

SongPage.contextTypes = {
    router: React.PropTypes.object
};