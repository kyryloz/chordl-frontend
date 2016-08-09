import React from "react";
import * as $ from "jquery";
import SongsList from "../components/SongsList";
import {Link, hashHistory} from "react-router";
import colors from "../colors";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import BasePageTemplate from "./BasePageTemplate"

const urlGetPerformer = 'http://localhost:8081/api/performers/';

const styles = {
    link: {
        color: colors.defaultPrimaryColor
    }
};

export default class PerformerPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {performer: {
            name: "",
            songs: []
        }}
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

    deletePerformer() {
        $.ajax({
            url: urlGetPerformer + this.props.params.id,
            type: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                hashHistory.replace('/');
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
        hashHistory.push("performer/" + this.state.performer.id + "/edit");
    };

    renderHeader = () => {
        return <h3>
            <Link to={'/'} style={styles.link}>#</Link>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            {this.state.performer.name}
        </h3>
    };

    renderOverflowMenu = () => {
        return <IconMenu
            iconButtonElement={<IconButton>
                <MoreVertIcon color={colors.defaultPrimaryColor}/>
            </IconButton>}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
        >
            <MenuItem primaryText="Edit" onTouchTap={this.handleEdit}/>
            <MenuItem style={{color: "red"}} primaryText="Delete" onTouchTap={this.handleDelete}/>
        </IconMenu>
    };

    renderContent = () => {
        return <SongsList songs={this.state.performer.songs}/>
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

PerformerPage.contextTypes = {
    router: React.PropTypes.object
};