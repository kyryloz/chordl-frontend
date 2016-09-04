import React from "react";
import * as $ from "jquery";
import SearchResultList from "../components/SearchResultList";
import api from "../global/api";
import BasePageTemplate from "./BasePageTemplate"
import {Pagination} from "react-bootstrap/lib";

const DEFAULT_PAGE_LIMIT = 10;

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
    },

    paginationContainer: {
        textAlign: "center"
    }
};

export default class SearchPage extends BasePageTemplate {

    constructor(props) {
        super(props);

        this.state = {
            query: props.location.query.query || "",
            page: props.location.query.page || 1,
            size: DEFAULT_PAGE_LIMIT,
            content: [],
            pageTotal: 0
        };
    }

    componentDidMount() {
        this.search(this.state.query, this.state.page, this.state.size);
    }

    search(term, page, size) {
        $.ajax({
            url: api.search + "?query=" + term + "&page=" + (page - 1) + "&size=" + size,
            type: 'GET',
            success: function (data) {
                this.setState({
                    content: data.content,
                    page: data.number + 1,
                    pageTotal: data.totalPages
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        const query = nextProps.location.query.query;
        const page = nextProps.location.query.page || 1;
        const size = nextProps.location.query.size || DEFAULT_PAGE_LIMIT;

        this.setState({
            query: query,
            result: {
                content: [],
                page: page,
            }
        });
        this.search(query, page, size);
    }

    handlePageClick = (page) => {
        console.log(page);
        this.context.router.push(`/search/?query=${this.state.query}&page=${page}`);
    };

    renderHeader() {
        return (
            <div style={styles.pageTitle}>
                <div style={styles.title}>
                    <h3>Search results:</h3>
                </div>
            </div>
        )
    }

    renderContent() {
        return (
            <div>
                {this.state.content.length !== 0 &&
                <div>
                    <SearchResultList result={this.state.content}/>

                    <div style={styles.paginationContainer}>
                        <Pagination
                            first
                            last
                            ellipsis
                            boundaryLinks
                            items={this.state.pageTotal}
                            maxButtons={3}
                            activePage={parseInt(this.state.page)}
                            onSelect={this.handlePageClick} />
                    </div>
                </div>
                }

                {this.state.content.length === 0 &&
                <div style={{textAlign: "center", marginTop: 32}}><p>{`Nothing found for '${this.state.query}'`}</p></div>
                }
            </div>
        )
    }
}

SearchPage.contextTypes = {
    router: React.PropTypes.object
};