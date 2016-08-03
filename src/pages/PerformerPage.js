import React from "react";
import * as $ from "jquery";

const urlGetPerformer = 'http://localhost:8081/api/performers/';

const styles = {
    page: {
        marginLeft: '70px',
        marginRight: '70px'
    },
};

export default class PerformerPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {performer: {}}
    }

    componentDidMount() {
        this.loadPerformer();
    }

    loadPerformer() {
        $.ajax({
            url: urlGetPerformer + this.props.params.id,
            dataType: 'json',
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                this.setState({performer: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    render() {
        return (
            <div style={styles.page}>
                <h3>{this.state.performer.name}</h3>

                <br/>
            </div>
        )
    }
}