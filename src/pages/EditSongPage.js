import React from "react";
import * as $ from "jquery";
import update from "react-addons-update";
import BasePageTemplate from "./BasePageTemplate";
import api from "../global/api";
import SongTitle from "../components/SongTitle";
import {Button, FormGroup, ControlLabel, FormControl} from "react-bootstrap/lib";

export default class EditSongPage extends BasePageTemplate {

    constructor(props) {
        super(props);

        this.state = {
            song: {
                title: "",
                lyrics: "",
                performerName: ""
            }
        }
    }

    componentDidMount() {
        this.loadSong();
    }

    loadSong() {
        $.ajax({
            url: `${api.songs}/${this.props.params.id}`,
            dataType: 'json',
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                this.setState({song: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    updateSong() {
        $.ajax({
            url: `${api.songs}/${this.props.params.id}`,
            type: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(this.state.song),
            success: function (data) {
                this.context.router.replace("/song/" + this.state.song.id)
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err);
            }
        });
    }

    handleSave = (e) => {
        e.preventDefault();
        this.updateSong();
    };

    handleCancel = (e) => {
        e.preventDefault();
        this.context.router.replace("/song/" + this.state.song.id)
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

    getValidationState(text) {
        if (text.length === 0) return 'error';
    }

    renderHeader() {
        return (
            <h3>
                <SongTitle
                    song={this.state.song}
                />
            </h3>
        )
    }

    renderContent() {
        return (
            <form onSubmit={this.handleSave}>
                <FormGroup
                    controlId="formBasicText"
                    validationState={this.getValidationState(this.state.song.title)}
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
                    validationState={this.getValidationState(this.state.song.lyrics)}
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
                        disabled={this.state.song.title.length === 0 || this.state.song.lyrics.length === 0}
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

EditSongPage.contextTypes = {
    router: React.PropTypes.object
};