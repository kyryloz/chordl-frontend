import * as React from "react";
import DOMPurify from "dompurify";

const defaultRegex = /<\[\[(\w+)\]\]>/g;

export default class Highlight extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            enabled: props.enabled ? props.enabled : true,
            regex: props.regex ? props.regex : defaultRegex
        }
    }

    highlightText(text) {
        if (text && this.state.enabled) {
            text = text.replace(this.state.regex, "<mark>$1</mark>");
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
