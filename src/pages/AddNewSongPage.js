import React from "react";
import * as $ from "jquery";
import SongAddStepper from "../components/SongAddStepper";
import BasePageTemplate from "./BasePageTemplate"
import api from "../api";

export default class AddNewSong extends BasePageTemplate {

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

    renderHeader() {
        return (
            <h3>Add new song</h3>
        )
    }

    renderContent() {
        return (
            <SongAddStepper performers={this.state.performers}/>
        )
    }
}