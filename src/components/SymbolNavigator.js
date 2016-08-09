import * as React from "react";
import {IndexLink} from "react-router";
import colors from "../colors"
import PerformerList from "./PerformerList"
import * as $ from "jquery";

const urlGetIndex = 'http://localhost:8081/api/index';

const styles = {
    active: {
        marginRight: 10,
        color: colors.accentColor
    },

    nonactive: {
        marginRight: 10,
        color: colors.defaultPrimaryColor
    }
};

export default class SymbolNavigator extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            index: []
        }
    }

    componentDidMount() {
        this.loadIndex();
    }

    loadIndex() {
        $.ajax({
            url: urlGetIndex,
            dataType: 'json',
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                this.setState({index: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    renderIndex = () => {
        return this.state.index.map((item) => {
            return (
                <IndexLink
                    style={styles.nonactive}
                    activeStyle={styles.active}
                    key={item.symbol}
                    to={'index/' + item.symbol}>
                    {item.symbol}
                </IndexLink>
            )
        });
    };

    render() {
        return (
            <div style={{marginTop: 16}}>
                {this.renderIndex()}
                <PerformerList performers={this.props.performers} filterSymbol={this.props.symbol}/>
            </div>
        )
    }
}