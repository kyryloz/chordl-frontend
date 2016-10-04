import React from "react";
import * as $ from "jquery";
import BasePageTemplate from "./BasePageTemplate";
import api from "../global/api";
import {HelpBlock, Button, FormGroup, ControlLabel, FormControl} from "react-bootstrap/lib";
import update from "react-addons-update";
import SelectPerformer from "../components/SelectPerformer";
import * as validator from "../util/validator";
import {Parser} from "react-chord-parser";
import ChordInput from "../components/ChordInput";

export default class AddNewSongPage extends BasePageTemplate {

    constructor() {
        super();

        this.state = {
            performerNames: [],
            song: {
                title: "",
                lyrics: "",
            },
            performerName: "",
            performerId: -1,
            performerExists: false,
            error: "",
            submitting: false,
            chords: []
        };
    }

    componentDidMount() {
        this.loadAllPerformers();
    }

    loadAllPerformers() {
        this.startLoading();
        $.ajax({
            url: `${api.performers}/all`,
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                this.setState({
                    performerNames: data
                });
                this.finishLoading();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    handleSongSubmit = (e) => {
        e.preventDefault();

        this.setState({
            submitting: true
        });

        this.getPerformerId((err, result) => {
            if (!err) {
                this.submitSong(result);
            } else {
                this.setState({
                    submitting: false,
                    error: `Performer '${this.state.performerName}' not found`
                })
            }
        });
    };

    getPerformerId(callback) {
        $.ajax({
            url: `${api.performers}/v2/search/?name=${this.state.performerName}`,
            type: 'GET',
            success: function (data) {
                callback(null, data.id);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                callback(err);
            }
        });
    }

    submitSong = (performerId) => {
        var data = {
            performerId: performerId,
            title: this.state.song.title.trim(),
            lyrics: this.state.song.lyrics.trim(),
        };

        $.ajax({
            url: api.songs,
            type: 'POST',
            data: JSON.stringify(data),
            success: function (data) {
                this.setState({
                    submitting: false
                });
                this.context.router.replace(`/song/${data.id}`);
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({
                    submitting: false,
                    error: "Can't process request, please try again later"
                })
            }.bind(this)
        });
    };

    handlePerformerNameChange = (name, exists) => {
        this.setState({
            performerName: name,
            performerExists: exists,
            error: ""
        });
    };

    handleTitleChange = (e) => {
        const newState = update(this.state, {
            song: {
                title: {$set: e.target.value}
            },
            error: {$set: ""}
        });
        this.setState(newState);
    };

    handleLyricsChange = (e) => {
        const newLyrics = e.target.value;
        const uniqueChords = new Parser(newLyrics).unique();

        const newChords = uniqueChords.filter(chord => this.state.chords.map(chord => chord.name).indexOf(chord.name) < 0);

        const newState = update(this.state, {
            song: {
                lyrics: {$set: newLyrics}
            },
            error: {$set: ""}
        });

        this.setState(newState, () => {
            if (newChords.length) {
                this.hydrateChords(uniqueChords);
            }
        });
    };

    hydrateChords = (chords) => {
        const input = {
            input: chords.map(chordName => ({name: chordName}))
        };

        $.ajax({
            url: `${api.chord}/hydrate`,
            type: 'POST',
            data: JSON.stringify(input),
            success: data => {
                this.setState({
                    chords: data
                });
            },
            error: (xhr, status, err) => {
                console.error(xhr, status, err);
            }
        });
    };

    handleCancel = (e) => {
        e.preventDefault();
        this.context.router.goBack();
    };

    handleChordDiagramChange = (newChord) => {
        const {chords} = this.state;

        chords.forEach(chord => {
            if (chord.name === newChord.name) {
                chord.diagram = newChord.diagram;
                chord.isNew = true;
            }
        });

        this.setState({chords})
    };

    validateAll = () => {
        return validator.validatePerformer(this.state.performerName, this.state.performerExists, true)
            && validator.validateLyrics(this.state.song.lyrics, true)
            && validator.validateTitle(this.state.song.title, true)
            && this.validateChords();
    };

    validateChords = () => {
        var validated = this.state.chords.filter(chord => {
            var validateChord = validator.validateChord(chord.diagram, true);
            console.log("validate chord", chord, validateChord);
            return validateChord
        });
        return validated.length === this.state.chords.length;
    };

    renderHeader() {
        return (
            <h3>Add new song</h3>
        )
    }

    renderUnknownChords() {
        const nodes = [];

        this.state.chords.forEach((chord, i) => {
            if (!chord.diagram || chord.isNew) {
                nodes.push(<ChordInput
                    callback={this.handleChordDiagramChange}
                    submitting={this.state.submitting}
                    style={{marginLeft: 16}}
                    key={i}
                    name={chord.name}
                    diagram="xxxxxx"/>)
            }
        });

        return nodes;
    }

    renderContent() {
        return (
            <form onSubmit={this.handleSongSubmit} style={{marginTop: 16}}>
                <FormGroup
                    controlId="formBasicText"
                    validationState={validator.validatePerformer(this.state.performerName, this.state.performerExists)}
                >
                    <ControlLabel>Performer</ControlLabel>
                    <SelectPerformer
                        submitting={this.state.submitting}
                        callback={this.handlePerformerNameChange}
                        performerNames={this.state.performerNames}/>
                    <FormControl.Feedback />
                </FormGroup>

                <FormGroup
                    controlId="formBasicText"
                    validationState={validator.validateTitle(this.state.song.title)}
                >
                    <ControlLabel>Title</ControlLabel>
                    <FormControl
                        disabled={this.state.submitting}
                        type="text"
                        placeholder="Title"
                        value={this.state.song.title}
                        onChange={this.handleTitleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>

                <FormGroup
                    controlId="formBasicText"
                    validationState={validator.validateLyrics(this.state.song.lyrics)}
                >
                    <ControlLabel>Lyrics</ControlLabel>
                    <FormControl
                        disabled={this.state.submitting}
                        style={{fontFamily: "monospace", resize: "vertical", minHeight: 340}}
                        componentClass="textarea"
                        type="text"
                        placeholder="Lyrics"
                        value={this.state.song.lyrics}
                        onChange={this.handleLyricsChange}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>Wrap each chord into braces (e.g., [Am]) to highlight it</HelpBlock>
                </FormGroup>
                <HelpBlock style={{color: "red"}}>{this.state.error}</HelpBlock>
                {this.state.chords.filter(chord => !chord.diagram || chord.isNew).length > 0 &&
                    <div>
                        <p style={{marginTop: 16}}>
                            Some chords are unknown.
                            Please, specify a diagram for each chord (e.g., for C chord – 'x32010'):
                        </p>
                        <div style={{display: "flex", flexWrap: "wrap"}}>
                            {this.renderUnknownChords()}
                        </div>
                    </div>
                }
                <FormGroup>
                    <Button
                        disabled={!this.validateAll() || this.state.submitting}
                        type="submit"
                        bsStyle="success"
                        style={{width: 120}}>
                        {this.state.submitting ? "Saving..." : "Save"}
                    </Button>
                    <Button
                        disabled={this.state.submitting}
                        style={{marginLeft: 16, width: 120}}
                        onClick={this.handleCancel}>
                        Cancel
                    </Button>
                </FormGroup>
            </form>
        )
    }
}

AddNewSongPage.contextTypes = {
    router: React.PropTypes.object
};