import React from "react";
import SongsList from "../components/SongsList";
import {Link} from "react-router";
import BasePageTemplate from "./BasePageTemplate";
import {Button} from "react-bootstrap/lib";
import {requestGetPerformerById, requestGetPerformerSongs} from "../global/api";

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
        this.startLoading();
        requestGetPerformerById(this.props.params.id)
            .then(data => {
                this.setState({
                    performer: data
                });

                this.loadSongs(data);
            })
            .catch(console.error);
    }

    loadSongs(performer) {
        requestGetPerformerSongs(performer.id)
            .then(data => {
                this.setState({
                    songs: data
                });
                this.finishLoading();
            })
            .catch(console.error);
    }

    handleEdit = (e) => {
        e.preventDefault();
        this.router.push("/performer/" + this.state.performer.id + "/edit");
    };

    isUserAdmin = () => {
        return this.props.user && this.props.user.isAdmin;
    };

    renderHeader() {
        return <h3>
            <Link to="/">#</Link>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            {this.state.performer.name}
        </h3>
    }

    renderMenu() {
        if (this.isUserAdmin()) {
            return <Button onClick={this.handleEdit}>EDIT</Button>
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