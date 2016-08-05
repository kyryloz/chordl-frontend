import React from "react";
import * as $ from "jquery";
import SymbolNavigator from "../components/SymbolNavigator"

const urlGetPerformers = 'http://localhost:8081/api/performers';

const styles = {
    page: {
        marginLeft: '70px',
        marginRight: '70px'
    },
};

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
            url: urlGetPerformers,
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

    render() {
        return (
            <div style={styles.page}>
                <h3>All songs</h3>
                <SymbolNavigator performers={this.state.performers} symbol={this.props.params.symbol}/>
            </div>
        )
    }
}