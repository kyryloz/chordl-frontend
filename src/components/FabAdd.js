import * as React from "react";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import {hashHistory} from "react-router";

const styles = {
    fabAdd: {
        display: 'inline-block',
        position: 'fixed',
        bottom: '22px',
        right: '20px'
    }
};

export default class FabAdd extends React.Component {

    constructor(props) {
        super(props);
    }

    handleAddPress = (e) => {
        e.preventDefault();
        hashHistory.push("/add")
    };

    render() {
        return (
            <FloatingActionButton
                style={styles.fabAdd}
                onTouchTap={this.handleAddPress}>
                <ContentAdd />
            </FloatingActionButton>
        )
    }
}