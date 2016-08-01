import React from 'react';
import AppBar from 'material-ui/AppBar';

export default class Header extends React.Component {
    constructor() {
        super();
        this.state = {open: false}
    }

    render() {
        return (
            <div>
                <AppBar
                    onLeftIconButtonTouchTap={this.handleTouchTapLeftIconButton}
                    title="Chords database"
                    showMenuIconButton={false}
                />
            </div>
        )
    }
}