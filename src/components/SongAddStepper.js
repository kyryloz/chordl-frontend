import React from "react";
import {Step, Stepper, StepLabel, StepContent} from "material-ui/Stepper";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import update from "react-addons-update";
import * as $ from "jquery";
import SelectPerformer from "../components/SelectPerformer";
import Snackbar from 'material-ui/Snackbar';
import api from "../api";

const styles = {
    stepper: {
        maxWidth: 640,
        fontFamily: 'sans-serif'
    }
};

export default class SongAddStepper extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            finished: false,
            stepIndex: 0,
            song: {
                performer: {
                    name: "",
                    id: -1
                },
                title: "",
                lyrics: ""
            },
            snackbarOpen: false
        }
    }


    handleNext = () => {
        const {stepIndex} = this.state;

        const finished = stepIndex >= 2;
        const newState = update(this.state, {
            stepIndex: {$set: stepIndex + 1},
            finished: {$set: finished}
        });
        this.setState(newState);

        if (finished) {
            this.handleSongSubmit();
        }
    };

    handlePrev = () => {
        const {stepIndex} = this.state;
        if (stepIndex > 0) {
            var newState = update(this.state, {
                stepIndex: {$set: stepIndex - 1}
            });
            this.setState(newState);
        }
    };

    renderStepActions(step) {
        const {stepIndex} = this.state;
        const {title} = this.state.song;
        const {lyrics} = this.state.song;

        return (
            <div style={{margin: '12px 0'}}>
                <RaisedButton
                    label={stepIndex === 2 ? 'Submit' : 'Next'}
                    disableTouchRipple={true}
                    disableFocusRipple={true}
                    disabled={stepIndex === 2 ? !lyrics : stepIndex === 1 ? !title : false}
                    primary={true}
                    onTouchTap={this.handleNext}
                    style={{marginRight: 12}}
                />
                {step > 0 && (
                    <FlatButton
                        label="Back"
                        disabled={stepIndex === 0}
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        onTouchTap={this.handlePrev}
                    />
                )}
            </div>
        );
    }

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

    handleSnackbarRequestClose = () => {
        const newState = update(this.state, {
            snackbarOpen: {$set: false}
        });
        this.setState(newState);
    };

    handleSongSubmit = () => {
        var data = {
            performerId: this.state.song.performer.id,
            title: this.state.song.title.trim(),
            lyrics: this.state.song.lyrics.trim(),
        };

        $.ajax({
            url: api.songs,
            dataType: 'json',
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function (data) {
                console.log("Submit success", data);
                this.onSongSubmitted(data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                this.onSongSubmitted();
            }.bind(this)
        });
    };

    onSongSubmitted(data) {
        if (data) {
            this.setState({
                song: {
                    performer: {
                        name: "",
                        id: -1
                    },
                    title: "",
                    lyrics: ""
                },
                stepIndex: 0,
                finished: false,
                snackbarOpen: true
            });
        } else {
            // TODO handle error
        }
    }

    performerDoneCallback = (data) => {
        const newState = update(this.state, {
            song: {
                performer: {$set: data}
            },
            stepIndex: {$set: 1}
        });
        this.setState(newState);
    };

    render() {
        const {stepIndex} = this.state;

        return (
            <div style={styles.stepper}>
                <Stepper activeStep={stepIndex} orientation="vertical">
                    <Step>
                        <StepLabel>Select performer</StepLabel>
                        <StepContent>
                            <SelectPerformer
                                performer={this.state.song.performer}
                                performers={this.props.performers}
                                performerDoneCallback={this.performerDoneCallback}/>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Title</StepLabel>
                        <StepContent>
                            <TextField
                                floatingLabelText="Title"
                                fullWidth={true}
                                value={this.state.song.title}
                                onChange={this.handleTitleChange}
                            /><br/>
                            {this.renderStepActions(1)}
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Lyrics</StepLabel>
                        <StepContent>
                            <TextField
                                floatingLabelText="Lyrics"
                                fullWidth={true}
                                multiLine={true}
                                rows={10}
                                value={this.state.song.lyrics}
                                onChange={this.handleLyricsChange}
                            /><br/>
                            {this.renderStepActions(2)}
                        </StepContent>
                    </Step>
                </Stepper>
                <Snackbar
                    open={this.state.snackbarOpen}
                    message="Song added successfully"
                    autoHideDuration={3000}
                    onRequestClose={this.handleSnackbarRequestClose}
                />
            </div>
        );
    }
}