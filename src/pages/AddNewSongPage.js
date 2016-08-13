import React from "react";
import * as $ from "jquery";
import SongAddStepper from "../components/SongAddStepper";
import api from "../api";

const styles = {
    page: {
        marginLeft: '70px',
        marginRight: '70px'
    }
};

export default class AddNewSong extends React.Component {

    constructor() {
        super();
        this.state = {
            performers: []
        };
    }

    componentDidMount() {
        this.loadAllPerformers();
    }

    loadAllPerformers() {
        $.ajax({
            url: api.performers,
            dataType: 'json',
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                this.setState({performers: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    render() {
        return (
            <div style={styles.page}>
                <h3>Add new song</h3>
                <SongAddStepper performers={this.state.performers}/>
            </div>
        )
    }
}