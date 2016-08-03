import React from "react";
import {IndexLink} from "react-router";
import * as $ from "jquery";

const url = 'http://localhost:8081/api/songs';
const urlGetPerformers = 'http://localhost:8081/api/performers';

const styles = {
    page: {
        marginLeft: '70px',
        marginRight: '70px'
    },

    active: {
        color: '#53acff'
    }
};

class SymbolNavigator extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <IndexLink activeStyle={styles.active} to='all/a'>A</IndexLink>&nbsp;
                <IndexLink activeStyle={styles.active} to='all/b'>B</IndexLink>&nbsp;
                <IndexLink activeStyle={styles.active} to='all/c'>C</IndexLink>
                {this.props.symbol}
            </div>
        )
    }
}

export default class AllSongsPage extends React.Component {

    constructor(props) {
        super(props);
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
                // this.setState({performers: data});
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
                <SymbolNavigator symbol={this.props.params.symbol}/>
            </div>
        )
    }
}