import React from "react";
import Divider from "material-ui/Divider";

const styles = {
    page: {
        display: 'flex',
        flexDirection: 'column'
    },

    pageTitle: {
        marginLeft: 70,
        marginRight: 16,
        display: 'flex',
        flexDirection: 'row'
    },

    title: {
        flexGrow: 1,
        marginBottom: 10,
        fontSize: 7,
        marginRight: 70
    },

    content: {
        marginLeft: 70,
        marginRight: 70
    },
};

export default class BasePageTemplate extends React.Component {

    renderHeader() {
        return null;
    }

    renderContent() {
        return null;
    }

    renderMenu() {
        return null;
    }

    render() {
        return (
            <div style={styles.page}>
                <div style={styles.pageTitle}>
                    <div style={styles.title}>
                        {this.renderHeader()}
                    </div>
                    <div style={{marginTop: 8}}>
                        {this.renderMenu()}
                    </div>
                </div>
                <Divider />
                <div style={styles.content}>
                    {this.renderContent()}
                </div>
            </div>
        )
    }
}