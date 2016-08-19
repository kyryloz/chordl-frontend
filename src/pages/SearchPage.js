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

        const query = props.location.query.query;
        this.state = {
            query: query,
            result: {
                content: []
            }
        };

        this.search(query);
    }

    search(term) {
        console.log("SEARCH === " , term);

        $.ajax({
            url: api.search + "?query=" + term,
            dataType: 'json',
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                this.setState({
                    result: {
                        content: data.content
                    }
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        const query = nextProps.location.query.query;
        console.log("componentWillReceiveProps a", query);
        console.log("componentWillReceiveProps b", this.state.query);

        if (query !== this.state.query) {
            this.setState({
                query: query
            });
            this.search(query);
        }
    }

    render() {
        console.log("render", this.props.location.query.query);

        return (
            <div style={styles.page}>
                <div style={styles.pageTitle}>
                    <div style={styles.title}>
                        <h3>Search results:</h3>
                    </div>
                </div>

                <SearchResultList result={this.state.result.content}/>
            </div>
        )
    }
}