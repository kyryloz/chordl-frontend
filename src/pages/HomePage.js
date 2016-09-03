import React from "react";
import * as $ from "jquery";
import SearchResultList from "../components/SearchResultList";
import BasePageTemplate from "./BasePageTemplate";
import api from "../api";

export default class HomePage extends BasePageTemplate {

    constructor(props) {
        super(props);

        this.state = {
            songs: []
        };
    }

    componentDidMount() {
        this.loadFeatured();
    }

    loadFeatured() {
        $.ajax({
            url: api.featured,
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                this.setState({
                    songs: data.songs
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    renderHeader() {
        return <div>
            <h3>Updates</h3>
        </div>
    }

    renderContent() {
        const nodes = this.state.songs.map(song => {
            return {
                title: song.title,
                songId: song.id,
                performerId: song.performerId,
                performer: song.performerName
            }
        });
        return (
            <div>
                <SearchResultList result={nodes} />
            </div>
        )
    }
}