import React from "react";
import * as $ from "jquery";
import FlatButton from 'material-ui/FlatButton';
import { hashHistory } from 'react-router';

const urlSong = 'http://localhost:8081/api/songs/';

const styles = {
    page: {
        marginLeft: '70px',
        marginRight: '70px'
    },
};

export default class SongPage extends React.Component {

    constructor(props) {
        super(props);

        this.urlGetSong = urlSong + this.props.params.id;

        this.state = {song: {
            id: -1,
            performerId: -1,
            title: "",
            lyrics: ""
        }}
    }

    componentDidMount() {
        this.loadSong();
    }

    loadSong() {
        $.ajax({
            url: this.urlGetSong,
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

    handleDelete = () => {
        $.ajax({
            url: this.urlGetSong,
            type: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                hashHistory.replace('/performer/' + this.state.song.performerId);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err);
            }
        });
    }

    render() {
        return (
            <div style={styles.page}>
                <div style={{float: 'left'}}>
                    <h3>{this.state.song.title}</h3>
                    <br/>
                    <pre>{this.state.song.lyrics}</pre>
                </div>
                <div style={{float: 'right', marginTop: 10}}>
                    <FlatButton
                        label="Edit"
                        primary={true}
                        href={"#/song/" + this.state.song.id + "/edit"}
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