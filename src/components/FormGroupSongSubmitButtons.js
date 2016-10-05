import React from "react";
import {Button, FormGroup} from "react-bootstrap/lib";

export default class FormGroupSongSubmitButtons extends React.Component {

    handleCancel = (e) => {
        e.preventDefault();
        this.context.router.goBack();
    };

    render() {
        return (
            <FormGroup>
                <Button
                    disabled={this.props.disabled}
                    type="submit"
                    bsStyle="success"
                    style={{width: 120}}>
                    {this.props.submitting ? "Saving..." : "Save"}
                </Button>
                <Button
                    disabled={this.props.submitting}
                    style={{marginLeft: 16, width: 120}}
                    onClick={this.handleCancel}>
                    Cancel
                </Button>
            </FormGroup>
        )
    }
}

FormGroupSongSubmitButtons.contextTypes = {
    router: React.PropTypes.object
};