import React from 'react';
import {
    Step,
    Stepper,
    StepLabel,
    StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from "material-ui/TextField";
import update from "react-addons-update";
import AutoComplete from "material-ui/AutoComplete";
import * as $ from "jquery";
import LinearProgress from 'material-ui/LinearProgress';

const urlPostSong = 'http://localhost:8081/api/songs';
const urlPostPerformer = 'http://localhost:8081/api/performers';

const styles = {
    stepper: {
        maxWidth: 640,
        fontFamily: 'sans-serif'
    },
};

class SongAddStepper extends React.Component {

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
                lyrics: "",
            }
        }
    }


    handleNext = () => {
        const {stepIndex} = this.state;

        var newState = update(this.state, {
            stepIndex: {$set: stepIndex + 1},
            finished: {$set: stepIndex >= 2}
        });
        this.setState(newState);
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
                    label={stepIndex === 2 ? 'Finish' : 'Next'}
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

    renderCreatePerformerAction = () => {
        return (
            <div style={{margin: '12px 0'}}>
                <FlatButton
                    label='Create performer'
                    disabled={this.isPerformerSubmittingInProgress()}
                    primary={true}
                    onTouchTap={this.handlePerformerSubmit}
                />
                {this.isPerformerSubmittingInProgress() ? <LinearProgress/> : <div></div>}
            </div>
        );
    };

    isPerformerExists = () => {
        return this.state.song.performer.id !== -1;
    };

    isPerformerSubmittingInProgress = () => {
        return this.state.performerSubmitting;
    };

    handlePerformerChange = (input, dataSourceIndex) => {
        var performer;
        if (dataSourceIndex === -1) {
            performer = {
                name: input,
                id: -1
            }
        } else {
            performer = input;
        }

        var newState = update(this.state, {
            song: {
                performer: {$set: performer}
            }
        });
        this.setState(newState);
    };

    handlePerformerChangeUpdate = (input) => {
        var result = $.grep(this.props.performers, function (e) {
            return e.name === input;
        });

        const performer = {
            name: input,
            id: result.length ? result[0].id : -1
        };

        var newState = update(this.state, {
            song: {
                performer: {$set: performer}
            }
        });
        this.setState(newState);
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

    handleSongSubmit = (e) => {
        e.preventDefault();

        var data = {
            performerId: this.state.song.performer.id,
            title: this.state.song.title.trim(),
            lyrics: this.state.song.lyrics.trim(),
        };

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
            performerSubmitting: false
        });

        $.ajax({
            url: urlPostSong,
            dataType: 'json',
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function (data) {
                console.log("Submit success", data)
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    };

    handlePerformerSubmit = (e) => {
        e.preventDefault();

        var data = {
            name: this.state.song.performer.name
        };

        this.setState({
            song: {
                performer: {
                    name: this.state.song.performer.name,
                    id: -1
                },
                title: "",
                lyrics: ""
            },
            stepIndex: 0,
            finished: false,
            performerSubmitting: true
        });

        $.ajax({
            url: urlPostPerformer,
            dataType: 'json',
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function (data) {
                console.log("Submit success", data);
                this.onPerformerSubmitted(data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                this.onPerformerSubmitted();
            }.bind(this)
        });
    };

    onPerformerSubmitted(data) {
        var newState;
        if (data) {
            this.props.performers.push(data);

            newState = update(this.state, {
                performerSubmitting: {$set: false},
                song: {
                    performer: {$set: data}
                }
            });
        } else {
            var empty = {
                name: "",
                id: -1
            };
            newState = update(this.state, {
                performerSubmitting: {$set: false},
                song: {
                    performer: {$set: empty}
                }
            });
        }
        this.setState(newState);
    };

    render() {
        const {finished, stepIndex} = this.state;

        return (
            <div style={styles.stepper}>
                <Stepper activeStep={stepIndex} orientation="vertical">
                    <Step>
                        <StepLabel>Select performer</StepLabel>
                        <StepContent>
                            <AutoComplete
                                floatingLabelText="Performer"
                                hintText="Start typing the name of performer"
                                filter={AutoComplete.fuzzyFilter}
                                dataSource={this.props.performers}
                                dataSourceConfig={{text: 'name', value: 'id'}}
                                maxSearchResults={5}
                                fullWidth={true}
                                searchText={this.state.song.performer.name}
                                onNewRequest={this.handlePerformerChange}
                                onUpdateInput={this.handlePerformerChangeUpdate}
                            /><br/>
                            {this.isPerformerExists() ? this.renderStepActions(0) : this.renderCreatePerformerAction()}
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

                {finished && (
                    <p style={{margin: '20px 0', textAlign: 'center'}}>
                        All done!
                        <br/>
                        <br/>
                        <FlatButton onClick={this.handleSongSubmit} label="Submit" primary={true}/>
                    </p>
                )}
            </div>
        );
    }
}

export default SongAddStepper;