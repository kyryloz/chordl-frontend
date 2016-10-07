import React from "react";
import {Link} from "react-router";
import BasePageTemplate from "./BasePageTemplate";
import SongTitle from "../components/SongTitle";
import {requestHydrateChords, requestGetSongById} from "../global/api";
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
            createdByName: "",
            chords: []
        };
    }

    componentDidMount() {
        this.loadSong();
    }

    loadSong() {
        this.startLoading();
        requestGetSongById(this.props.params.id)
            .then(data => {
                this.setState({
                    ...data,
                    createdByName: data.createdBy ? data.createdBy.name : "Unknown"
                }, () => this.hydrateChords());
            })
            .catch(console.error);
    }

    hydrateChords = () => {
        const chords = new Parser(this.state.lyrics)
            .unique()
            .map(chordName => ({name: chordName}));

        const input = {
            input: chords
        };

        requestHydrateChords(input)
            .then(data => {
                const result = {};
                data.forEach(chordDto => result[chordDto.name] = chordDto.diagram || "xxxxxx");

                this.setState({
                    chords: result
                });
                this.finishLoading();
            })
            .catch(console.error);
    };

    onHistoryApplied = (song) => {
        this.setState(song);
    };

    handleEdit = (e) => {
        e.preventDefault();
        this.context.router.push("/song/" + this.state.id + "/edit");
    };

    renderUniqueChords() {
        return new Parser(this.state.lyrics)
            .unique()
            .map(chord => <Chord style={{width: 100, height: 100}}key={chord} name={chord} diagram={this.state.chords[chord] || "xxxxxx"}/>);
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
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{flexGrow: 1}}>
                        <pre>
                            <Chordify color="#aa4444" input={this.state.lyrics}/>
                        </pre>
                    </div>
                    <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
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