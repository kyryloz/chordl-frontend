import React from "react";
import BasePageTemplate from "./BasePageTemplate";
import {
    requestEditSong,
    requestPostSong,
    requestGetPerformerIdByName,
    requestHydrateChords,
    requestGetSongById,
    requestPostChords,
    requestPostPerformer
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
import DOMPurify from "dompurify";

const domPurifyConfig = {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true
};

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
                .then(this.hydrateSong)
                .then(this.parseChords)
                .then(this.finishLoading)
                .catch(this.handleError);
        }
    }

    hydrateSong = (song) => {
        this.setState({
            songTitle: song.title,
            songLyrics: song.lyrics,
            performerName: song.performerName,
            performerId: song.performerId
        });
    };

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
                .then(this.postChords)
                .then(this.handleSubmitSuccess)
                .catch(this.handleError)
        } else {
            if (this.state.performerExists) {
                requestGetPerformerIdByName(this.state.performerName)
                    .then(this.postSong)
                    .then(this.postChords)
                    .then(this.handleSubmitSuccess)
                    .catch(this.handleError)
            } else {
                 requestPostPerformer({name: this.state.performerName})
                    .then(this.postSong)
                    .then(this.postChords)
                    .then(this.handleSubmitSuccess)
                    .catch(this.handleError)
            }
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
        return requestPostChords(this.state.chords.filter(chord => !chord.exists));
    };

    handleSubmitSuccess = () => {
        this.setState({
            submitting: false
        });
        this.context.router.replace(`/song/${this.state.songId}`);
    };

    handleError = (error) => {
        this.setState({
            submitting: false,
            error: "Can't process request, please try again later"
        });
        throw error;
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

        this.setState({
            songLyrics: DOMPurify.sanitize(newLyrics, domPurifyConfig),
            error: ""
        }, this.parseChords);
    };

    parseChords = () => {
        const uniqueChords = new Parser(this.state.songLyrics)
            .unique()
            .map(chordName => ({
                name: chordName,
                diagram: Optional.ofNullable(
                    this.state.chords.filter(chord => chord.name === chordName)[0])
                    .map(chord => chord.diagram)
                    .orElse(""),
                exists: Optional.ofNullable(
                    this.state.chords.filter(chord => chord.name === chordName)[0])
                    .map(chord => chord.exists)
                    .orElse(false)
            }));

        this.setState({chords: uniqueChords});

        this.hydrateChords(uniqueChords.filter(chord => !chord.diagram));
    };

    hydrateChords = (inputChords) => {
        if (inputChords.length === 0) return;

        const input = {
            input: inputChords
        };

        requestHydrateChords(input)
            .then(data => {

                const {chords} = this.state;
                chords.forEach(chord => {
                    const hydratedChord = data.filter(dataChord => dataChord.name === chord.name)[0];
                    if (hydratedChord) {
                        chord.diagram = hydratedChord.diagram;
                        chord.exists = !!hydratedChord.diagram;
                    }
                })

                this.setState({chords});
            })
            .catch(this.handleError);
    };

    handleChordDiagramChange = (newChord) => {
        const {chords} = this.state;

        chords.forEach(chord => {
            if (chord.name === newChord.name) {
                chord.diagram = newChord.diagram;
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
                Validator.validatePerformer(this.state.performerName, true, true);
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
        return this.state.chords.filter(chord => !chord.exists).length > 0;
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
                    chords={this.state.chords.filter(chord => !chord.exists)}
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