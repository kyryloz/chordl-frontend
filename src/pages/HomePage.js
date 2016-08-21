import React from "react";
import * as $ from "jquery";
import SymbolNavigator from "../components/SymbolNavigator";
import BasePageTemplate from "./BasePageTemplate";
import ReactPaginate from 'react-paginate';
import api from "../api";

const DEFAULT_PAGE_LIMIT = 10;

const styles = {
    paginationContainer: {
        textAlign: "center"
    }
};

export default class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            performers: [],
            page: props.location.query.page || 0,
            pageTotal: 0
        };
    }

    componentDidMount() {
        this.loadAll();
    }

    componentWillReceiveProps(nextProps) {
        const page = nextProps.location.query.page || 0;

        this.setState({
            performers: [],
            page: page,
        }, () => this.loadAll());
    }

    loadAll() {
        $.ajax({
            url: `${api.performers}?size=${DEFAULT_PAGE_LIMIT}&sort=name&page=${this.state.page}`,
            dataType: 'json',
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                this.setState({
                    performers: data.content,
                    page: data.number,
                    pageTotal: data.totalPages
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    handlePageClick = (page) => {
        this.context.router.push(`index/?page=${page.selected}`);
    };

    renderHeader = () => {
        return <h3>Select performer</h3>
    };

    renderOverflowMenu = () => {
        return <div></div>
    };

    renderContent = () => {
        return (
            <div>
                <SymbolNavigator performers={this.state.performers} symbol={this.props.params.symbol}/>
                <div style={styles.paginationContainer}>
                    <ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        breakLabel={<a href="">...</a>}
                        breakClassName={"break-me"}
                        pageNum={this.state.pageTotal}
                        forceSelected={parseInt(this.state.page)}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                        clickCallback={this.handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}/>
                </div>
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
