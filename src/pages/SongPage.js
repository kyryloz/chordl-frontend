import React from "react";
import * as $ from "jquery";
import FlatButton from 'material-ui/FlatButton';
import {Link, hashHistory} from 'react-router';
import colors from "../colors";
import PopoverItemMenu from "../components/PopoverItemMenu";
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Divider from 'material-ui/Divider';

const urlSong = 'http://localhost:8081/api/songs/';

const styles = {
    page: {
        display: 'flex',
        flexDirection: 'column'
    },

    pageTitle: {
        marginLeft: 70,
        marginRight: 16,
        display: 'flex',
        flexDirection: 'row'
    },

    title: {
        flexGrow: 1
    },

    content: {
        marginLeft: 70,
        marginRight: 70
    },

    link: {
        color: colors.defaultPrimaryColor
    }
};

export default class SongPage extends React.Component {

    constructor(props) {
        super(props);

        this.urlGetSong = urlSong + this.props.params.id;

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
            url: this.urlGetSong,
            dataType: 'json',
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
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
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                hashHistory.replace('performer/' + this.state.song.performerId);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err);
            }
        });
    };

    handleEdit = (e) => {
        e.preventDefault();
        hashHistory.push("song/" + this.state.song.id + "/edit");
    };

    render() {
        return (
            <div style={styles.page}>
                <div style={styles.pageTitle}>
                    <div style={styles.title}>
                        <h3>
                            <Link
                                style={styles.link}
                                to={'/'}>
                                #
                            </Link>
                            &nbsp;&nbsp;|&nbsp;&nbsp;
                            <Link
                                style={styles.link}
                                to={'performer/' + this.state.song.performerId}>
                                {this.state.song.performerName}
                            </Link>
                            &nbsp;–&nbsp;
                            {this.state.song.title}
                        </h3>
                    </div>
                    <div style={{marginTop: 6}}>
                        <IconMenu
                            iconButtonElement={<IconButton>
                                <MoreVertIcon color={colors.defaultPrimaryColor}/>
                            </IconButton>}
                            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        >
                            <MenuItem primaryText="Edit" onTouchTap={this.handleEdit}/>
                            <MenuItem style={{color: "red"}} primaryText="Delete" onTouchTap={this.handleDelete}/>
                        </IconMenu>
                    </div>
                </div>
                <Divider />
                <div style={styles.content}>
                    <pre>{this.state.song.lyrics}</pre>
                </div>
            </div>
        )
    }
}