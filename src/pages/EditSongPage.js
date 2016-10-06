import React from "react";
import BasePageTemplate from "./BasePageTemplate";
import {
    requestEditSong,
    requestPostSong,
    requestGetPerformerIdByName,
    requestHydrateChords,
    requestGetSongById,
    requestPostChords
} from "../global/api";
import {HelpBlock} from "react-bootstrap/lib";
import FormGroupSelectPerformer from "../components/FormGroupSelectPerformer";
import FormGroupEditTitle from "../components/FormGroupEditTitle";
import FormGroupEditLyrics from "../components/FormGroupEditLyrics";
import FormGroupSongSubmitButtons from "../components/FormGroupSongSubmitButtons";
import FormGroupAdminEditSong from "../components/FormGroupAdminEditSong";
import ChordInputList from "../components/ChordInputList";
import * as Validator from "../util/validator";
import {Parser} from "react-chord-parser";
import Optional from "optional-js";
import SongTitle from "../components/SongTitle";

export default class EditSongPage extends BasePageTemplate {

    constructor(props) {
        super(props);

        this.state = {
            songTitle: "",
            songLyrics: "",
            songId: props.params.id,
            performerName: "",
            performerId: -1,
            performerExists: false,
            error: "",
            submitting: false,
            chords: []
        };
    }

    componentDidMount() {
        if (typeof this.props.params.id !== "undefined") {
            this.startLoading();
            requestGetSongById(this.props.params.id)
                .then(data => {
                    this.setState({
                        songTitle: data.title,
                        songLyrics: data.lyrics,
                        performerName: data.performerName,
                        performerId: data.performerId,
                        chords: this.parseChords(data.lyrics),
                    });
                    this.finishLoading();
                })
                .catch(this.handleError);
        }
    }

    isUserAdmin = () => {
        return this.props.user ? this.props.user.isAdmin : false;
    };

    handleSongSubmit = (e) => {
        e.preventDefault();

        this.setState({
            submitting: true
        });

        if (this.props.params.id) {
            const song = {
                id: this.props.params.id,
                title: this.state.songTitle,
                lyrics: this.state.songLyrics,
                performerId: this.state.performerId,
                performerName: this.state.performerName
            };

            requestEditSong(song)
                .then(this.handleSubmitSuccess)
                .catch(this.handleError)
        } else {
            requestGetPerformerIdByName(this.state.performerName)
                .then(this.postSong)
                .then(this.postChords)
                .then(this.handleSubmitSuccess)
                .catch(this.handleError)
        }
    };

    postSong = (performer) => {
        var song = {
            performerId: performer.id,
            title: this.state.songTitle.trim(),
            lyrics: this.state.songLyrics.trim(),
        };

        return requestPostSong(song);
    };

    postChords = (song) => {
        this.setState({songId: song.id});
        return requestPostChords(this.state.chords)
    };

    handleSubmitSuccess = () => {
        this.setState({
            submitting: false
        });
        this.context.router.replace(`/song/${this.state.songId}`);
    };

    handleError = () => {
        this.setState({
            submitting: false,
            error: "Can't process request, please try again later"
        })
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
        const uniqueChords = this.parseChords(newLyrics);

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

    parseChords(text) {
        const uniqueChords = new Parser(text)
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
        return uniqueChords;
    }

    hydrateChords = (inputChords) => {
        if (inputChords.length === 0) return;

        const input = {
            input: inputChords
        };

        requestHydrateChords(input)
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

    handleCancelClick = (e) => {
        e.preventDefault();
        this.context.router.goBack();
    };

    validateAll = () => {
        let performerValidated = true;

        if (!this.props.params.id) {
            performerValidated =
                Validator.validatePerformer(this.state.performerName, this.state.performerExists, true);
        }

        return performerValidated
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
        if (this.props.params.id) {
            return (
                <h3>
                    <SongTitle
                        song={{
                            title: this.state.songTitle,
                            id: this.props.params.id,
                            performerName: this.state.performerName,
                            performerId: this.state.performerId
                        }}
                    />
                </h3>
            )
        } else {
            return (
                <h3>Add new song</h3>
            )
        }
    }

    renderContent() {
        return (
            <form onSubmit={this.handleSongSubmit} style={{marginTop: 16}}>

                {!this.props.params.id &&
                <FormGroupSelectPerformer
                    disabled={this.state.submitting}
                    performerName={this.state.performerName}
                    performerExists={this.state.performerExists}
                    onChange={this.handlePerformerNameChange}
                />
                }

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

                {this.hasUnknownChords() &&
                <ChordInputList
                    disabled={this.state.submitting}
                    onChange={this.handleChordDiagramChange}
                    chords={this.state.chords}
                />
                }

                <HelpBlock style={{color: "red"}}>{this.state.error}</HelpBlock>

                <FormGroupSongSubmitButtons
                    disabled={this.state.submitting || !this.validateAll()}
                    submitting={this.state.submitting}
                    onCancelClick={this.handleCancelClick}
                />

                {typeof this.props.params.id !== "undefined" && this.isUserAdmin() &&
                <FormGroupAdminEditSong
                    songId={this.props.params.id}
                    performerId={this.state.performerId}
                />
                }

            </form>
        )
    }
}

EditSongPage.contextTypes = {
    router: React.PropTypes.object
};