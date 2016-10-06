import React from "react";
import SearchResultList from "../components/SearchResultList";
import {requestSearch} from "../global/api";
import BasePageTemplate from "./BasePageTemplate";
import {Pagination} from "react-bootstrap/lib";

const DEFAULT_PAGE_LIMIT = 10;

const styles = {
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
            content: [],
            pageTotal: 0,
            loading: false,
            error: ""
        };
    }

    componentDidMount() {
        this.search(this.state.query, this.state.page);
    }

    search(term, page) {
        if (!term) return;

        this.setState({
            loading: true
        });

        requestSearch(term, page - 1, DEFAULT_PAGE_LIMIT)
            .then(data => {
                this.setState({
                    content: data.content,
                    page: data.number + 1,
                    pageTotal: data.totalPages,
                    loading: false,
                    error: ""
                });
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    error: "Error has occurred, please try again later"
                });
            });
    }

    componentWillReceiveProps(nextProps) {
        const query = nextProps.location.query.query;
        const page = nextProps.location.query.page || 1;

        if (query !== this.state.query
            || page !== this.state.page) {
            this.setState({
                query: query,
                content: [],
                page: page,
                loading: false,
                error: ""
            });
            this.search(query, page);
        }
    }

    handlePageClick = (page) => {
        this.context.router.push(`/search/?query=${this.state.query}&page=${page}`);
    };

    renderMessage(message, color) {
        return <div style={{textAlign: "center", marginTop: 32, color}}><p>{message}</p></div>;
    }

    renderHeader() {
        return <h3>Search results:</h3>;
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
                            activePage={this.state.page}
                            onSelect={this.handlePageClick}/>
                    </div>
                </div>
                }

                {(() => {
                    if (this.state.content.length === 0) {
                        if (this.state.error) {
                            return this.renderMessage(this.state.error, "red");
                        } else if (this.state.loading) {
                            return this.renderMessage(`Loading...`);
                        } else {
                            return this.renderMessage(`Nothing found for '${this.state.query}'`);
                        }
                    }
                })()}
            </div>
        )
    }
}

SearchPage.contextTypes = {
    router: React.PropTypes.object
};