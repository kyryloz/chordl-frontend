import * as React from "react";
import FabAdd from "./FabAdd";
import Header from "./Header";

const styles = {
    breadcrumbs: {
        width: "70%",
        margin: "auto"
    },

    paper: {
        width: "70%",
        margin: "16px auto",
    }
};

export default class MainContainer extends React.Component {

    renderAddButton = () => {
        if (!this.props.history.isActive('add')) {
            if (this.props.user) {
                return <FabAdd/>;
            } else {
                return <div></div>;
            }
        } else {
            return <div></div>
        }
    };

    render() {
        return (
            <div style={styles.main}>
                <Header {...this.props}/>
                <div style={styles.paper}>
                    {React.cloneElement(this.props.children, this.props)}
                    {this.renderAddButton()}
                </div>
            </div>
        )
    }
}

