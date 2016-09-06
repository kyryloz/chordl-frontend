import * as React from "react";
import Header from "./Header";

const styles = {
    pageContent: {
        width: "70%",
        margin: "16px auto",
    }
};

export default class MainContainer extends React.Component {

    render() {
        return (
            <div style={styles.main}>
                <Header {...this.props}/>
                <div style={styles.pageContent}>
                    {React.cloneElement(this.props.children, this.props)}
                </div>
            </div>
        )
    }
}

