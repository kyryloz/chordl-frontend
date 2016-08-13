import React from "react";
import * as $ from "jquery";
import SearchResultList from "../components/SearchResultList";
import api from "../api";

const styles = {
    page: {
        marginLeft: '70px',
        marginRight: '70px',
        display: 'flex',
        flexDirection: 'column'
    },

    pageTitle: {
        display: 'flex',
        flexDirection: 'row'
    },

    title: {
        flexGrow: 1
    }
};

export default class SearchPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            results: []
        }
    }

    componentWillReceiveProps(nextProps) {
        var query = nextProps.params.query;
        this.search(query);
    }

    search(query) {
        $.ajax({
            url: api.search + query,
            dataType: 'json',
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                this.setState({
                    results: data
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    render() {
        return (
            <div style={styles.page}>
                <div style={styles.pageTitle}>
                    <div style={styles.title}>
                        <h3>Search results:</h3>
                    </div>
                </div>

                <SearchResultList results={this.state.results}/>
            </div>
        )
    }
}