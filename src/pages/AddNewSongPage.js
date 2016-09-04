import React from "react";
import * as $ from "jquery";
import BasePageTemplate from "./BasePageTemplate";
import api from "../global/api";
import {Button, FormGroup, ControlLabel, FormControl} from "react-bootstrap/lib";
import update from "react-addons-update";
import SelectPerformer from "../components/SelectPerformer"

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
            performerExists: true
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
        this.getPerformerId(this.state.performer, (err, result) => {
            if (!err) {
                this.submitSong(result);
            }
        });
    };

    getPerformerId(performerName, callback) {
        $.ajax({
            url: `${api.performers}/search/${this.state.performerName}`,
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
                console.error(status, err.toString());
                // TODO handle error
            }.bind(this)
        });
    };

    handlePerformerNameChange = (name, exists) => {
        this.setState({
            performerName: name,
            performerExists: exists
        });
    };

    handleTitleChange = (e) => {
        var newState = update(this.state, {
            song: {
                title: {$set: e.target.value}
            }
        });
        this.setState(newState);
    };

    handleLyricsChange = (e) => {
        var newState = update(this.state, {
            song: {
                lyrics: {$set: e.target.value}
            }
        });
        this.setState(newState);
    };

    handleCancel = (e) => {
        e.preventDefault();
        this.context.router.goBack();
    };

    validateEmptyInput(text) {
        const length = text.length;
        if (length > 1) return 'success';
        else if (length > 0) return 'error';
    }

    validatePerformer() {
        const length = this.state.performerName.length;
        if (length > 1) {
            return this.state.performerExists ? 'success' : "warning";
        }
        else if (length > 0) return 'error';
    }

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
                    validationState={this.validatePerformer()}
                >
                    <ControlLabel>Performer</ControlLabel>
                    <SelectPerformer
                        callback={this.handlePerformerNameChange}
                        performerNames={this.state.performerNames}/>
                    <FormControl.Feedback />
                </FormGroup>

                <FormGroup
                    controlId="formBasicText"
                    validationState={this.validateEmptyInput(this.state.song.title)}
                >
                    <ControlLabel>Title</ControlLabel>
                    <FormControl
                        style={{fontFamily: "monospace"}}
                        type="text"
                        placeholder="Title"
                        value={this.state.song.title}
                        onChange={this.handleTitleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>

                <FormGroup
                    controlId="formBasicText"
                    validationState={this.validateEmptyInput(this.state.song.lyrics)}
                >
                    <ControlLabel>Lyrics</ControlLabel>
                    <FormControl
                        style={{fontFamily: "monospace", resize: "vertical", minHeight: 400}}
                        componentClass="textarea"
                        type="text"
                        placeholder="Lyrics"
                        value={this.state.song.lyrics}
                        onChange={this.handleLyricsChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <FormGroup>
                    <Button
                        disabled={
                            this.state.song.title.length < 2
                            || this.state.song.lyrics.length < 2
                            || !this.state.performerExists}
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