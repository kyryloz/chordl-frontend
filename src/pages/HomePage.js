import React from "react";
import LastUpdatedList from "../components/LastUpdatedList";
import BasePageTemplate from "./BasePageTemplate";
import {requestGetFeatured} from "../global/api";
import {Badge} from "react-bootstrap/lib";
import {Link} from "react-router";

const styles = {
    node: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingRight: 16
    }
};

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
        this.startLoading();

        requestGetFeatured()
            .then(data => {
                this.setState({
                    songs: data.songs,
                    performers: data.performers,
                });
                this.finishLoading();
            })
            .catch(console.error);
    }

    renderPerformerItem(performer) {
        return (
            <div style={styles.node}>
                <Link
                    to={"/performer/" + performer.id}>
                    {performer.name}
                </Link>
                &nbsp;
                <Badge>{performer.songCount}</Badge>
            </div>
        )
    }

    renderPerformerList = () => {
        const resultNodes = this.state.performers.map((performer) => {
            return <li key={performer.id}>{this.renderPerformerItem(performer)}</li>;
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
        return null;
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
            <div style={{display: "flex", flexWrap: "wrap"}}>
                <div style={{flexGrow: 1}}>
                    <h3>Performers:</h3>
                    {this.renderPerformerList()}
                </div>
                <div>
                    <h3>Last updated:</h3>
                    <LastUpdatedList result={songsAdapter} />
                </div>
            </div>
        )
    }
}