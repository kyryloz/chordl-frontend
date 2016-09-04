import * as React from "react";
import {Breadcrumb} from "react-bootstrap/lib";

export default class Breadcrumbs extends React.Component {
    render() {
        return (
            <Breadcrumb style={this.props.style}>
                <Breadcrumb.Item href="#">
                    Home
                </Breadcrumb.Item>
                <Breadcrumb.Item href="http://getbootstrap.com/components/#breadcrumbs">
                    Library
                </Breadcrumb.Item>
                <Breadcrumb.Item active>
                    Data
                </Breadcrumb.Item>
            </Breadcrumb>
        )
    }
}