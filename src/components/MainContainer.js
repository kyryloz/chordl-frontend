import * as React from "react";
import Header from "./Header";

export default class MainContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            windowWidth: window.innerWidth
        }
    }

    handleResize = () => {
        console.log(window.innerWidth);
        this.setState({windowWidth: window.innerWidth});
    };

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    render() {
        return (
            <div>
                <Header {...this.props}/>
                <div style={{
                    width: this.state.windowWidth > 700 ? "70%" : "95%",
                    maxWidth: 900,
                    margin: "16px auto",
                }}>
                    {React.cloneElement(this.props.children, this.props)}
                </div>
            </div>
        )
    }
}

