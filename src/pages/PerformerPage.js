import React from "react";
import * as $ from "jquery";
import SongsList from "../components/SongsList";
import {Link} from "react-router";
import colors from "../global/colors";
import BasePageTemplate from "./BasePageTemplate";
import {Button} from "react-bootstrap/lib";
import api from "../global/api";

const styles = {
    link: {
        color: colors.defaultPrimaryColor
    }
};

export default class PerformerPage extends BasePageTemplate {

    constructor(props) {
        super(props);

        this.state = {
            performer: {},
            songs: []
        };
    }

    componentDidMount() {
        this.router = this.context.router;
        this.loadPerformer();
    }

    loadPerformer() {
        $.ajax({
            url: `${api.performers}/${this.props.params.id}`,
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                this.setState({
                    performer: data
                });

                this.loadSongs(data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    loadSongs(performer) {
        $.ajax({
            url: `${api.performers}/${performer.id}/songs`,
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                this.setState({
                    songs: data
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    deletePerformer() {
        $.ajax({
            url: `${api.performers}/${this.props.params.id}`,
            type: 'DELETE',
            success: function (data) {
                this.router.replace('/');
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    handleDelete = () => {
        this.deletePerformer();
    };

    handleEdit = (e) => {
        e.preventDefault();
        this.router.push("/performer/" + this.state.performer.id + "/edit");
    };

    isUserAdmin = () => {
        return this.props.user ? this.props.user.authorities.indexOf("ROLE_ADMIN") >= 0 : false;
    };

    renderHeader() {
        return <h3>
            <Link to={'/'} style={styles.link}>#</Link>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            {this.state.performer.name}
        </h3>
    }

    renderMenu() {
        if (this.isUserAdmin()) {
            return <Button bsStyle="link" onClick={this.handleEdit}>EDIT</Button>
        } else {
            return null;
        }
    }

    renderContent() {
        return <SongsList songs={this.state.songs}/>
    }
}

PerformerPage.contextTypes = {
    router: React.PropTypes.object
};