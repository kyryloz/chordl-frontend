import * as React from "react";
import {List, ListItem} from "material-ui/List";

export default class SongsList extends React.Component {

    render() {
        var songNodes = this.props.songs.map((song) => {
            return (
                <ListItem href={"#/song/" + song.id} primaryText={song.title} key={song.id}/>
            );
        });

        return (
            <List>
                {songNodes}
            </List>
        );
    }
}