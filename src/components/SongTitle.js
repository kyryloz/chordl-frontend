import * as React from "react";
import {Link} from "react-router";

export default class SongTitle extends React.Component {

    renderPerformerTitle() {
        return this.props.linkifyPerformer ?
            <Link
                style={this.props.style}
                to={"performer/" + this.props.song.performerId}>
                {this.props.song.performerName}
            </Link>
            :
            this.props.song.performerName;
    }

    renderSongTitle() {
        return this.props.linkifySong ?
            <Link
                style={this.props.style}
                to={"song/" + this.props.song.id}>
                {this.props.song.title}
            </Link>
            :
            this.props.song.title;
    }

    render() {
        return (
            <div>
                {this.renderPerformerTitle()}
                &nbsp;–&nbsp;
                {this.renderSongTitle()}
            </div>
        )
    }
}