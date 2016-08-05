import React from "react";
import * as $ from "jquery";
import SongsList from "../components/SongsList";
import FlatButton from "material-ui/FlatButton";
import { hashHistory } from 'react-router';

const urlGetPerformer = 'http://localhost:8081/api/performers/';

const styles = {
    page: {
        marginLeft: '70px',
        marginRight: '70px'
    },
};

export default class PerformerPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {performer: {
            name: "",
            songs: []
        }}
    }

    componentDidMount() {
        this.loadPerformer();
    }

    loadPerformer() {
        $.ajax({
            url: urlGetPerformer + this.props.params.id,
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

    deletePerformer() {
        $.ajax({
            url: urlGetPerformer + this.props.params.id,
            type: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                hashHistory.replace('/all');
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    handleDelete = () => {
        this.deletePerformer();
    };

    render() {
        return (
            <div style={styles.page}>
                <div style={{float: 'left'}}>
                    <h3>{this.state.performer.name}</h3>
                    <SongsList songs={this.state.performer.songs}/>
                </div>
                <div style={{float: 'right', marginTop: 10}}>
                    <FlatButton
                        label="Edit"
                        primary={true}
                        href={"#/performer/" + this.state.performer.id + "/edit"}
                    />
                    <FlatButton
                        label="Delete"
                        labelStyle={{color: 'red'}}
                        onTouchTap={this.handleDelete}
                    />
                </div>
            </div>
        )
    }
}