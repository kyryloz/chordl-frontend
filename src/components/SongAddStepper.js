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

const url = 'http://localhost:8081/api/songs';

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
        this.setState({
            stepIndex: stepIndex + 1,
            finished: stepIndex >= 2,
        });
    };

    handlePrev = () => {
        const {stepIndex} = this.state;
        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
        }
    };

    renderStepActions(step) {
        const {stepIndex} = this.state;

        return (
            <div style={{margin: '12px 0'}}>
                <RaisedButton
                    label={stepIndex === 2 ? 'Finish' : 'Next'}
                    disableTouchRipple={true}
                    disableFocusRipple={true}
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

    isPerformerChosen = () => {
        return this.state.song.performer.id !== -1;
    };

    handlePerformerChange = (performer) => {
        console.log("input performer: ", performer);
        var newState = update(this.state, {
            song: {
                performer: {
                    $set: {
                        name: performer.name,
                        id: performer.id
                    }
                }
            }
        });
        this.setState(newState)
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

    handleSubmit = (e) => {
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
            finished: false
        });

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function (data) {
                console.log("Submit success")
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
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
                            /><br/>
                            {this.isPerformerChosen() ? this.renderStepActions(0) : <div></div>}
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
                    <FlatButton onClick={this.handleSubmit} label="Submit" primary={true}/>
                </p>
                )}
            </div>
        );
    }
}

export default SongAddStepper;