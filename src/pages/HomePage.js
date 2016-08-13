import React from "react";
import * as $ from "jquery";
import SymbolNavigator from "../components/SymbolNavigator";
import BasePageTemplate from "./BasePageTemplate";
import api from "../api";

export default class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {performers: []};
    }

    componentDidMount() {
        this.loadAll();
    }

    loadAll() {
        $.ajax({
            url: api.performers,
            dataType: 'json',
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                this.setState({performers: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    renderHeader = () => {
        return <h3>Select performer</h3>
    };

    renderOverflowMenu = () => {
        return <div></div>
    };

    renderContent = () => {
        return <SymbolNavigator performers={this.state.performers} symbol={this.props.params.symbol}/>
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
