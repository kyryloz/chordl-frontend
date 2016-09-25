import React from "react";
import * as $ from "jquery";
import {Link} from "react-router";
import BasePageTemplate from "./BasePageTemplate";
import SongTitle from "../components/SongTitle";
import api from "../global/api";
import {Button} from "react-bootstrap/lib";
import History from "../components/History";
import {Chordify, Chord, Parser} from "react-chord-parser";

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
                });
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

    diagramSupplier = (chord) => {
        switch (chord) {
            case "C":
                return "x32010";
            case "D":
                return "xx0232";
            case "Em":
                return "022000";
            case "G":
                return "320033";
            default:
                return "xxxxxx";
        }
    };

    renderUniqueChords() {
        return new Parser(this.state.lyrics)
            .unique()
            .map(chord => <Chord key={chord} name={chord} diagram={this.diagramSupplier(chord)}/>);
    }

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
            <div style={{marginTop: 16}}>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <div style={{flexGrow: 1}}>
                        <pre>
                            <Chordify color="#aa4444" input={this.state.lyrics}/>
                        </pre>
                    </div>
                    <div style={{width: 100, marginLeft: 70}}>
                        {this.renderUniqueChords()}
                    </div>
                </div>

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