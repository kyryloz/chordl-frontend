import * as React from "react";
import colors from "../colors";
import SongTitle from "../components/SongTitle";
import Highlight from 'react-highlighter';

const styles = {
    link: {
        color: colors.defaultPrimaryColor
    }
};

export default class SearchResultList extends React.Component {

    renderListItem(searchNode) {
        const song = {
            title: searchNode.title,
            performerId: searchNode.performerId,
            performerName: searchNode.performer,
            id: searchNode.songId
        };
        return (
            <div>
                <SongTitle
                    style={styles.link}
                    song={song}
                    linkifySong={true}
                    linkifyPerformer={true}
                />
            </div>
        )
    }

    render() {
        var resultNodes = this.props.result.map((searchNode) => {
            return <li key={searchNode.songId}>{this.renderListItem(searchNode)}</li>;
        });

        var result;
        if (resultNodes.length) {
            result = (
                <ul style={{listStyle: "none", margin: 0, padding: 0}}>
                    {resultNodes}
                </ul>
            );
        } else {
            result = (
                <div style={{textAlign: "center"}}><p>Nothing found</p></div>
            );
        }

        return result;
    }
}