import React from "react";
import * as $ from "jquery";
import SearchResultList from "../components/SearchResultList";
import BasePageTemplate from "./BasePageTemplate";
import api from "../global/api";
import { Badge } from "react-bootstrap/lib";

export default class HomePage extends BasePageTemplate {

    constructor(props) {
        super(props);

        this.state = {
            songs: [],
            performers: []
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
                    songs: data.songs,
                    performers: data.performers
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    renderListItem(node) {
        const performer = {
            title: node.title,
            performerId: node.performerId,
            performerName: node.performer,
            id: node.songId
        };
        return (
            <div style={styles.node}>
                <SongTitle
                    style={styles.link}
                    song={performer}
                    linkifySong={true}
                    linkifyPerformer={true}
                    hlEnabled={true}
                />
                {node.snippet && this.renderSnippet(node.snippet)}
            </div>
        )
    }

    renderPerformerList = () => {
        const resultNodes = this.state.performers.map((performer) => {
            return <li key={performer.id}>{performer.name} <Badge>{performer.songCount}</Badge></li>;
        });

        var result = null;
        if (resultNodes.length) {
            result = (
                <ul style={{listStyle: "none", margin: 0, padding: 0}}>
                    {resultNodes}
                </ul>
            );
        }

        return result;
    };

    renderHeader() {
        return <div>
        </div>
    }

    renderContent() {
        const songsAdapter = this.state.songs.map(song => {
            return {
                title: song.title,
                songId: song.id,
                performerId: song.performerId,
                performer: song.performerName
            }
        });

        return (
            <div style={{display: "flex"}}>
                <div style={{flexGrow: 1}}>
                    <h3>Performers:</h3>
                    {this.renderPerformerList()}
                </div>
                <div>
                    <h3>Last updated:</h3>
                    <SearchResultList result={songsAdapter} />
                </div>
            </div>
        )
    }
}