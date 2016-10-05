import React from "react";
import BasePageTemplate from "./BasePageTemplate";
import * as Api from "../global/api";
import {HelpBlock, Button, FormGroup, ControlLabel, FormControl} from "react-bootstrap/lib";
import update from "react-addons-update";
import SelectPerformer from "../components/SelectPerformer";
import * as validator from "../util/validator";
import {Parser} from "react-chord-parser";
import ChordInput from "../components/ChordInput";
import Optional from "optional-js";

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

        Api.getAllPerformers()
            .then(data => {
                this.finishLoading();
                this.setState({
                    performerNames: data
                });
            })
            .catch(error => console.log(error))
    }

    handleSongSubmit = (e) => {
        e.preventDefault();

        this.setState({
            submitting: true
        });

        Api.getPerformerIdByName(this.state.performerName)
            .then(data => {
                this.submitSong(data);
            })
            .catch(() => {
                this.setState({
                    submitting: false,
                    error: `Performer '${this.state.performerName}' not found`
                })
            });
    };

    submitSong = (performerId) => {
        var song = {
            performerId: performerId,
            title: this.state.song.title.trim(),
            lyrics: this.state.song.lyrics.trim(),
        };

        Api.submitNewSong(song)
            .then(data => {
                this.setState({
                    submitting: false
                });
                this.context.router.replace(`/song/${data.id}`);
            })
            .catch(() => {
                this.setState({
                    submitting: false,
                    error: "Can't process request, please try again later"
                })
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
        const uniqueChords = new Parser(newLyrics)
            .unique()
            .map(chordName => ({name: chordName}));

        uniqueChords.forEach(uniqueChord => {
            var foundChord = this.state.chords.filter(chord => chord.name === uniqueChord.name)[0];
            uniqueChord.diagram = Optional
                .ofNullable(foundChord)
                .map(chord => chord.diagram)
                .orElse("");
            uniqueChord.isNew = Optional
                .ofNullable(foundChord)
                .map(chord => chord.isNew)
                .orElse(false)
        });

        const newState = update(this.state, {
            song: {
                lyrics: {$set: newLyrics}
            },
            chords: {$set: uniqueChords},
            error: {$set: ""}
        });

        this.setState(newState, () => {
            this.hydrateChords(this.state.chords.filter(chord => {
                return !chord.diagram;
            }));
        });
    };

    hydrateChords = (inputChords) => {
        if (inputChords.length === 0) return;

        const input = {
            input: inputChords
        };

        Api.hydrateChords(input)
            .then(data => {
                const {chords} = this.state;

                chords.filter(chord => inputChords.map(input => input.name).indexOf(chord.name) > 0)
                    .forEach(chord =>
                        chord.diagram = data
                            .filter(dataChord => dataChord.name === chord.name)[0].diagram);

                this.setState({chords});
            })
            .catch(error => console.error(error));
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
            return validator.validateChord(chord.diagram, true)
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

        this.state.chords.forEach(chord => {
            if (!chord.diagram || chord.isNew) {
                nodes.push(<ChordInput
                    callback={this.handleChordDiagramChange}
                    chord={chord}
                    submitting={this.state.submitting}
                    style={{marginLeft: 16}}
                    key={chord.name}
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