import * as React from "react";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";

const styles = {
    fabAdd: {
        display: 'inline-block',
        position: 'fixed',
        bottom: '22px',
        right: '20px'
    }
};

export default class FabAdd extends React.Component {

    handleAddPress = (e) => {
        e.preventDefault();
        this.context.router.push("/add")
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

FabAdd.contextTypes = {
    router: React.PropTypes.object
};