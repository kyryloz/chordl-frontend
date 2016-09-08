import React from "react";
import * as $ from "jquery";
import update from "react-addons-update";
import BasePageTemplate from "./BasePageTemplate";
import api from "../global/api";
import SongTitle from "../components/SongTitle";
import {HelpBlock, Button, FormGroup, ControlLabel, FormControl} from "react-bootstrap/lib";
import * as validator from "../util/validator";

export default class EditSongPage extends BasePageTemplate {

    constructor(props) {
        super(props);

        this.state = {
            song: {
                title: "",
                lyrics: "",
                performerName: ""
            },
            error: "",
            submitting: false
        }
    }

    componentDidMount() {
        this.loadSong();
    }

    loadSong() {
        this.startLoading();
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
                this.finishLoading();
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({
                    error: "Can't load song, please try again later"
                })
            }.bind(this)
        });
    }

    updateSong() {
        this.setState({
            submitting: true
        });
        $.ajax({
            url: `${api.songs}/${this.props.params.id}`,
            type: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(this.state.song),
            success: function (data) {
                this.setState({
                    submitting: false
                });
                this.context.router.replace("/song/" + data.id)
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({
                    error: "Can't process request, please try again later"
                })
            }.bind(this)
        });
    }

    isUserAdmin = () => {
        return this.props.user ? this.props.user.authorities.indexOf("ROLE_ADMIN") >= 0 : false;
    };

    handleSave = (e) => {
        e.preventDefault();
        this.updateSong();
    };

    handleCancel = (e) => {
        e.preventDefault();
        this.context.router.replace("/song/" + this.props.params.id)
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

    handleDelete = (e) => {
        e.preventDefault();

        $.ajax({
            url: `${api.songs}/${this.state.song.id}`,
            type: 'DELETE',
            success: function (data) {
                this.context.router.replace('performer/' + this.state.song.performerId);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(xhr, status, err);
            }
        });
    };

    validateAll = () => {
        return validator.validateLyrics(this.state.song.lyrics, true)
            && validator.validateTitle(this.state.song.title, true);
    };

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
            <form onSubmit={this.handleSave} style={{marginTop: 16}}>
                <FormGroup
                    controlId="formBasicText"
                    validationState={validator.validateTitle(this.state.song.title)}
                >
                    <ControlLabel>Title</ControlLabel>
                    <FormControl
                        disabled={this.state.submitting}
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
                    validationState={validator.validateLyrics(this.state.song.lyrics)}
                >
                    <ControlLabel>Lyrics</ControlLabel>
                    <FormControl
                        disabled={this.state.submitting}
                        style={{fontFamily: "monospace", resize: "vertical", minHeight: 400}}
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
                        disabled={!this.validateAll() || this.state.submitting}
                        type="submit"
                        bsStyle="success"
                        style={{width: 120}}>
                        {this.state.submitting ? "Submitting..." : "Save"}
                    </Button>
                    <Button
                        disabled={this.state.submitting}
                        style={{marginLeft: 16, width: 120}}
                        onClick={this.handleCancel}>
                        Cancel
                    </Button>
                </FormGroup>
                {this.isUserAdmin() &&
                    <FormGroup>
                        <ControlLabel style={{marginTop: 32}}>Danger section</ControlLabel>
                        <br/>
                        <Button bsStyle="danger" onClick={this.handleDelete}>
                            Delete song
                        </Button>
                    </FormGroup>
                }
            </form>
        )
    }
}

EditSongPage.contextTypes = {
    router: React.PropTypes.object
};