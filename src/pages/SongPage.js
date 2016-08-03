import React from "react";
import * as $ from "jquery";
import FlatButton from 'material-ui/FlatButton';

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

    handleDelete() {
        $.ajax({
            url: this.urlGetSong,
            type: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                console.log("success", data);
                this.setState({song: {
                    title: "",
                    lyrics: "Deleted"
                }});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err);
            }
        });
    }

    render() {
        return (
            <div style={styles.page}>
                <h3>{this.state.song.title}</h3>
                <br/>
                <pre>{this.state.song.lyrics}</pre>
                <br/><br/>
                <FlatButton onClick={this.handleDelete.bind(this)} label="Delete" secondary={true} />
            </div>
        )
    }
}