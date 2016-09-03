import * as React from "react";
import Paper from "material-ui/Paper";
import FabAdd from "./FabAdd";
import Header from "./Header";
import {StickyContainer, Sticky} from 'react-sticky';

const styles = {
    header: {
        width: '100%'
    },

    main: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        paddingBottom: 16,
        flexGrow: 1
    },

    menuLeft: {
        height: '1000px',
        width: '300px',
        borderRight: '1px solid #dedede'
    },

    paper: {
        margin: '0 auto',
        paddingBottom: 32,
        width: 800,
        flexGrow: 1
    }
};

export default class MainContainer extends React.Component {

    render() {
        return (
            <div>
                <StickyContainer style={styles.main}>
                    <Sticky isActive={false}>
                        <header>
                            <div style={styles.header}><Header/></div>
                        </header>
                    </Sticky>
                    <Paper style={styles.paper} zDepth={1}>
                        <div>
                            {React.cloneElement(this.props.children, this.props)}
                            {!this.props.history.isActive('add') && (<FabAdd/>) }
                        </div>
                    </Paper>
                </StickyContainer>
            </div>
        )
    }
}

