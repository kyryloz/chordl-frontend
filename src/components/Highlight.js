import * as React from "react";
import DOMPurify from "dompurify";

export default class Highlight extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            enabled: props.enabled ? props.enabled : false,
        }
    }

    highlightText(text) {
        if (text && this.state.enabled) {
            text = DOMPurify.sanitize(text);
            return <div dangerouslySetInnerHTML={{__html: text}}/>
        } else {
            return <div>{text}</div>;
        }
    }

    render() {
        return this.highlightText(this.props.text);
    }
}
