import React from "react";

const styles = {
    page: {
        display: 'flex',
        flexDirection: 'column'
    },

    pageTitle: {
        display: 'flex',
        flexDirection: 'row'
    },

    title: {
        flexGrow: 1
    }
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
        const menuComponent = this.renderMenu();
        return (
            <div>
                <div style={styles.pageTitle}>
                    <div style={styles.title}>
                        {this.renderHeader()}
                    </div>
                    <div style={{marginTop: menuComponent ? 16 : 0}}>
                        {menuComponent}
                    </div>
                </div>
                <div style={styles.content}>
                    {this.renderContent()}
                </div>
            </div>
        )
    }
}