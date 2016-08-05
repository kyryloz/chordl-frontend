import React from "react";
import * as $ from "jquery";
import FlatButton from "material-ui/FlatButton";
import {hashHistory} from "react-router";
import update from "react-addons-update";
import TextField from "material-ui/TextField"

const urlPerformer = 'http://localhost:8081/api/performers/';

const styles = {
    page: {
        marginLeft: '70px',
        marginRight: '70px'
    },
};

export default class EditPerformerPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {performer: {
            name: "",
            id: -1
        }}
    }

    componentDidMount() {
        this.loadPerformer();
    }

    loadPerformer() {
        $.ajax({
            url: urlPerformer + this.props.params.id,
            dataType: 'json',
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                this.setState({performer: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    updatePerformer() {
        $.ajax({
            url: urlPerformer + this.state.performer.id,
            dataType: 'json',
            type: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(this.state.performer),
            success: function (data) {
                this.setState({performer: data});
                this.handleCancel();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    handleNameChange = (event) => {
        const newState = update(this.state, {
            performer: {
                name: {$set: event.target.value}
            }
        });
        this.setState(newState);
    };

    handleSave = () => {
        this.updatePerformer();
    };

    handleCancel = () => {
        hashHistory.replace("/performer/" + this.state.performer.id)
    };

    render() {
        console.log(this.state.performer);
        return (
            <div style={styles.page}>
                <div style={{float: 'left', minWidth: 460, marginTop: 70}}>
                    <TextField
                        id="text-field-controlled"
                        value={this.state.performer.name}
                        onChange={this.handleNameChange}
                        floatingLabelText="Name"
                        floatingLabelFixed={true}
                    />
                </div>
                <div style={{float: 'right', marginTop: 10}}>
                    <FlatButton
                        label="Save"
                        primary={true}
                        disabled={!this.state.performer.name}
                        onTouchTap={this.handleSave}
                    />
                    <FlatButton
                        label="Cancel"
                        labelStyle={{color: 'red'}}
                        onTouchTap={this.handleCancel}
                    />
                </div>
            </div>
        )
    }
}