import React from "react";
import * as $ from "jquery";
import {Link} from "react-router";
import colors from "../global/colors";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import BasePageTemplate from "./BasePageTemplate";
import SongTitle from "../components/SongTitle";
import api from "../global/api";
import {Button} from "react-bootstrap/lib";

const styles = {
    link: {
        color: colors.defaultPrimaryColor
    }
};

export default class SongPage extends BasePageTemplate {

    constructor(props) {
        super(props);

        this.state = {
            song: {
                id: -1,
                performerId: -1,
                performerName: "",
                title: "",
                lyrics: ""
            },
            contextMenuOpened: false
        }
    }

    componentDidMount() {
        this.loadSong();
    }

    loadSong() {
        $.ajax({
            url: `${api.songs}/${this.props.params.id}`,
            type: 'GET',
            success: function (data) {
                this.setState({song: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    handleDelete = (e) => {
        e.preventDefault();

        $.ajax({
            url: this.urlGetSong,
            type: 'DELETE',
            success: function (data) {
                this.context.router.replace('performer/' + this.state.song.performerId);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err);
            }
        });
    };

    handleEdit = (e) => {
        e.preventDefault();
        this.context.router.push("/song/" + this.state.song.id + "/edit");
    };

    renderHeader() {
        return <h3 style={{display: 'flex', flexDirection: 'row'}}>
            <Link
                style={styles.link}
                to={'/'}>
                #
            </Link>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <SongTitle
                style={styles.link}
                song={this.state.song}
                linkifyPerformer={true}
            />
        </h3>
    }

    renderMenu() {
        if (this.props.user) {
            return <Button bsStyle="link" onClick={this.handleEdit}>EDIT</Button>
        } else {
            return null;
        }
    }

    renderContent() {
        return <pre style={{marginTop: 16}}>{this.state.song.lyrics}</pre>
    }
}

SongPage.contextTypes = {
    router: React.PropTypes.object
};