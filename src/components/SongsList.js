import * as React from "react";
import SongTitle from "../components/SongTitle";

const styles = {
    node: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingRight: 16
    }
};

export default class SongsList extends React.Component {

    renderListItem(song) {
        return (
            <div style={styles.node}>
                <SongTitle
                    style={styles.link}
                    song={song}
                    linkifySong={true}
                    hidePerformer={true}
                />
            </div>
        )
    }

    render() {
        const resultNodes = this.props.songs.map((song) => {
            return <li key={song.id}>{this.renderListItem(song)}</li>;
        });

        var result = null;
        if (resultNodes.length) {
            result = (
                <ul style={{listStyle: "none", padding: 0}}>
                    {resultNodes}
                </ul>
            );
        }

        return result;
    }

}