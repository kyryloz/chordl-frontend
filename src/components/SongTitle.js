import * as React from "react";
import {Link} from "react-router";
import Highlight from "./Highlight"

export default class SongTitle extends React.Component {

    renderPerformerTitle() {
        return this.props.linkifyPerformer ?
            <Link
                style={this.props.style}
                to={"performer/" + this.props.song.performerId}>
                <Highlight
                    enabled={this.props.hlEnabled}
                    text={this.props.song.performerName}/>
            </Link>
            :
            <Highlight
                enabled={this.props.hlEnabled}
                text={this.props.song.performerName}/>
    }

    renderSongTitle() {
        return this.props.linkifySong ?
            <Link
                style={this.props.style}
                to={"song/" + this.props.song.id}>
                <Highlight
                    enabled={this.props.hlEnabled}
                    text={this.props.song.title}/>
            </Link>
            :
            <Highlight
                enabled={this.props.hlEnabled}
                text={this.props.song.title}/>
    }

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'row'}}>
                {this.renderPerformerTitle()}
                &nbsp;–&nbsp;
                {this.renderSongTitle()}
            </div>
        )
    }
}