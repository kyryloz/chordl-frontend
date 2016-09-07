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

const Loading = () => {
    return (
        <div></div>
    )
};

export default class BasePageTemplate extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };
    }

    startLoading() {
        this.setState({
            loading: true
        })
    }

    finishLoading() {
        this.setState({
            loading: false
        })
    }

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
        if (this.state.loading) {
            return <Loading />
        }
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