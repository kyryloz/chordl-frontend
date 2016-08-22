import React from "react";
import * as $ from "jquery";
import SearchResultList from "../components/SearchResultList";
import BasePageTemplate from "./BasePageTemplate";
import PerformerList from "../components/PerformerList"
import Divider from 'material-ui/Divider';
import api from "../api";

const mockPopularList = [
    {
        title: "Title1",
        songId: 1,
        performerId: 1,
        performer: "Metallica"
    },
    {
        title: "Title12",
        songId: 2,
        performerId: 2,
        performer: "Metallica2"
    },
    {
        title: "Title123",
        songId: 3,
        performerId: 3,
        performer: "Metallica3"
    }
];

const styles = {
    paginationContainer: {
        textAlign: "center"
    }
};

export default class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            featured: {
                songs: []
            }
        };
    }

    componentDidMount() {
        this.loadFeatured();
    }

    loadFeatured() {
        $.ajax({
            url: `${api.songs}/featured`,
            dataType: 'json',
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                this.setState({
                    featured: data
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
        return (
            <div>
                <SearchResultList result={mockPopularList} />
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
