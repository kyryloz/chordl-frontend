import React from "react";
import * as $ from "jquery";
import SongsList from "../components/SongsList"

const urlGetSong = 'http://localhost:8081/api/songs/';

const styles = {
    page: {
        marginLeft: '70px',
        marginRight: '70px'
    },
};

export default class SongPage extends React.Component {

    constructor(props) {
        super(props);

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
            url: urlGetSong + this.props.params.id,
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

    render() {
        return (
            <div style={styles.page}>
                <h3>{this.state.song.title}</h3>
                <br/>
                <blockquote>{this.state.song.lyrics}</blockquote>
            </div>
        )
    }
}