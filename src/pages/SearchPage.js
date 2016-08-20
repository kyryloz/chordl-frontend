import React from "react";
import * as $ from "jquery";
import SearchResultList from "../components/SearchResultList";
import api from "../api";
import ReactPaginate from 'react-paginate';

const defaultPageLimit = 10;

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

    pagination: {
        display: "block",
        margin: "auto"
    }
};

export default class SearchPage extends React.Component {

    constructor(props) {
        super(props);

        const query = props.location.query.query;
        this.state = {
            query: query,
            result: {
                content: [],
                page: 0,
                pageTotal: 1
            }
        };
    }

    componentDidMount() {
        this.search(this.state.query, this.state.page);
    }

    search(term, page) {
        $.ajax({
            url: api.search + "?query=" + term + "&page=" + page + "&size=" + defaultPageLimit,
            dataType: 'json',
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                this.setState({
                    result: {
                        content: data.content,
                        page: data.number,
                        pageTotal: data.totalPages
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

        if (query !== this.state.query) {
            this.setState({
                query: query
            });
            this.search(query, this.state.result.page);
        }
    }

    handlePageClick = (data) => {
        const selected = data.selected;

        this.setState({page: selected}, () => {
            this.search(this.state.query, this.state.page)
        });
    };

    render() {
        return (
            <div style={styles.page}>
                <div style={styles.pageTitle}>
                    <div style={styles.title}>
                        <h3>Search results:</h3>
                    </div>
                </div>

                <SearchResultList result={this.state.result.content}/>

                <div style={styles.pagination}>
                    <ReactPaginate previousLabel={"<"}
                                   nextLabel={">"}
                                   breakLabel={<a href="">...</a>}
                                   breakClassName={"break-me"}
                                   pageNum={this.state.result.pageTotal}
                                   marginPagesDisplayed={1}
                                   pageRangeDisplayed={3}
                                   clickCallback={this.handlePageClick}
                                   containerClassName={"pagination"}
                                   subContainerClassName={"pages pagination"}
                                   activeClassName={"active"} />
                </div>
            </div>
        )
    }
}