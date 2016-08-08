import * as React from "react";
import {List, ListItem} from "material-ui/List";

export default class SearchResultList extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        var resultNodes = this.props.results.map((result) => {
            return (
                <ListItem href={"#/song/" + result.id} primaryText={result.title} key={result.id}/>
            );
        });

        return (
            <List>
                {resultNodes}
            </List>
        );
    }
}