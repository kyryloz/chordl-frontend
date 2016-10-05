import React from "react";
import BasePageTemplate from "./BasePageTemplate";
import * as Api from "../global/api";
import {HelpBlock} from "react-bootstrap/lib";
import FormGroupSelectPerformer from "../components/FormGroupSelectPerformer";
import FormGroupEditTitle from "../components/FormGroupEditTitle";
import FormGroupEditLyrics from "../components/FormGroupEditLyrics";
import FormGroupSongSubmitButtons from "../components/FormGroupSongSubmitButtons";
import ChordInputList from "../components/ChordInputList";
import * as Validator from "../util/validator";
import {Parser} from "react-chord-parser";
import Optional from "optional-js";

export default class AddNewSongPage extends BasePageTemplate {

    constructor() {
        super();

        this.state = {
            songTitle: "",
            songLyrics: "",
            performerName: "",
            performerId: -1,
            performerExists: false,
            error: "",
            submitting: false,
            chords: []
        };
    }

    handleSongSubmit = (e) => {
        e.preventDefault();

        this.setState({
            submitting: true
        });

        Api.getPerformerIdByName(this.state.performerName)
            .then(data => {
                this.submitSong(data.id);
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
            title: this.state.songTitle.trim(),
            lyrics: this.state.songLyrics.trim(),
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
        this.setState({
            songTitle: e.target.value,
            error: ""
        });
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

        this.setState({
            songLyrics: newLyrics,
            chords: uniqueChords,
            error: ""
        }, () => {
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
        return Validator.validatePerformer(this.state.performerName, this.state.performerExists, true)
            && Validator.validateLyrics(this.state.songLyrics, true)
            && Validator.validateTitle(this.state.songTitle, true)
            && this.validateChords();
    };

    validateChords = () => {
        var validated = this.state.chords.filter(chord => {
            return Validator.validateChord(chord.diagram, true)
        });
        return validated.length === this.state.chords.length;
    };

    hasUnknownChords = () => {
        return this.state.chords.filter(chord => !chord.diagram || chord.isNew).length > 0;
    };

    renderHeader() {
        return (
            <h3>Add new song</h3>
        )
    }

    renderContent() {
        return (
            <form onSubmit={this.handleSongSubmit} style={{marginTop: 16}}>

                <FormGroupSelectPerformer
                    disabled={this.state.submitting}
                    performerName={this.state.performerName}
                    performerExists={this.state.performerExists}
                    onChange={this.handlePerformerNameChange}
                />

                <FormGroupEditTitle
                    disabled={this.state.submitting}
                    value={this.state.songTitle}
                    onChange={this.handleTitleChange}
                />

                <FormGroupEditLyrics
                    disabled={this.state.submitting}
                    value={this.state.songLyrics}
                    onChange={this.handleLyricsChange}
                />

                <HelpBlock style={{color: "red"}}>{this.state.error}</HelpBlock>

                {this.hasUnknownChords() &&
                    <ChordInputList
                        disabled={this.state.submitting}
                        onChange={this.handleChordDiagramChange}
                        chords={this.state.chords}
                    />
                }

                <FormGroupSongSubmitButtons
                    disabled={this.state.submitting || !this.validateAll()}
                    submitting={this.state.submitting}
                />

            </form>
        )
    }
}

AddNewSongPage.contextTypes = {
    router: React.PropTypes.object
};