import {Button, FormGroup, ControlLabel} from "react-bootstrap/lib";
import React from "react";
import {requestDeleteSong} from "../global/api";

export default class FormGroupAdminEditSong extends React.Component {

    handleDelete = (e) => {
        e.preventDefault();

        requestDeleteSong(this.props.songId)
            .then(() => {
                this.context.router.replace('/performer/' + this.props.performerId);
            })
            .catch(console.log);
    };

    render() {
        return (
            <div>
                <FormGroup>
                    <ControlLabel style={{marginTop: 32}}>Danger section</ControlLabel>
                    <br/>
                    <Button bsStyle="danger" onClick={this.handleDelete}>
                        Delete song
                    </Button>
                </FormGroup>
            </div>
        )
    }
}

FormGroupAdminEditSong.contextTypes = {
    router: React.PropTypes.object
};