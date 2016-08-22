import React from "react";
import * as $ from "jquery";
import SearchResultList from "../components/SearchResultList";
import BasePageTemplate from "./BasePageTemplate";
import api from "../api";

const styles = {
    paginationContainer: {
        textAlign: "center"
    }
};

export default class HomePage extends React.Component {

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
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
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

    renderHeader = () => {
        return <div>
            <h3>Featured</h3>
        </div>
    };

    renderOverflowMenu = () => {
        return <div></div>
    };

    renderContent = () => {
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
    };

    render() {
        return (
            <BasePageTemplate
                header={this.renderHeader()}
                overflowMenu={this.renderOverflowMenu()}
                content={this.renderContent()}
            />
        )
    }
}

HomePage.contextTypes = {
    router: React.PropTypes.object
};
