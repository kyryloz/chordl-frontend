import * as React from "react";
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

    render() {
        return (
            <div style={styles.main}>
                <Header {...this.props}/>
                <div style={styles.paper}>
                    {React.cloneElement(this.props.children, this.props)}
                </div>
            </div>
        )
    }
}

