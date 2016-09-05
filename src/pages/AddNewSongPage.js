import React from "react";
import * as $ from "jquery";
import BasePageTemplate from "./BasePageTemplate";
import api from "../global/api";
import {HelpBlock, Button, FormGroup, ControlLabel, FormControl} from "react-bootstrap/lib";
import update from "react-addons-update";
import SelectPerformer from "../components/SelectPerformer";
import * as validator from "../util/validator";

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
            error: ""
        };
    }

    componentDidMount() {
        this.loadAllPerformers();
    }

    loadAllPerformers() {
        $.ajax({
            url: `${api.performers}/all`,
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                this.setState({performerNames: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    handleSongSubmit = (e) => {
        e.preventDefault();
        this.getPerformerId((err, result) => {
            if (!err) {
                this.submitSong(result);
            } else {
                this.setState({
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
                this.context.router.replace(`/song/${data.id}`);
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({
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
        var newState = update(this.state, {
            song: {
                title: {$set: e.target.value}
            },
            error: {$set: ""}
        });
        this.setState(newState);
    };

    handleLyricsChange = (e) => {
        var newState = update(this.state, {
            song: {
                lyrics: {$set: e.target.value}
            },
            error: {$set: ""}
        });
        this.setState(newState);
    };

    handleCancel = (e) => {
        e.preventDefault();
        this.context.router.goBack();
    };

    validateAll = () => {
        return validator.validatePerformer(this.state.performerName, this.state.performerExists, true)
            && validator.validateLyrics(this.state.song.lyrics, true)
            && validator.validateTitle(this.state.song.title, true);
    };

    renderHeader() {
        return (
            <h3>Add new song</h3>
        )
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
                        style={{fontFamily: "monospace", resize: "vertical", minHeight: 340}}
                        componentClass="textarea"
                        type="text"
                        placeholder="Lyrics"
                        value={this.state.song.lyrics}
                        onChange={this.handleLyricsChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <HelpBlock style={{color: "red"}}>{this.state.error}</HelpBlock>
                <FormGroup>
                    <Button
                        disabled={!this.validateAll()}
                        type="submit"
                        bsStyle="success"
                        style={{width: 120}}>
                        Save
                    </Button>
                    <Button style={{marginLeft: 16, width: 120}} onClick={this.handleCancel}>
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