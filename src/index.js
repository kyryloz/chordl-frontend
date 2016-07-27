import React from "react";
import ReactDOM from "react-dom";
import Remarkable from 'remarkable';
import $ from 'jquery';
import "./index.css";

var CommentBox = React.createClass({
    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data});
                console.log(data);
            }.bind(this),
            error: function (xhr, status, error) {
                console.error(this.props.url, status, error.toString());
            }.bind(this)
        });
    },

    render: function () {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data} />
                <CommentForm />
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function () {
        var commendNodes = this.props.data.map(function (comment) {
            return (
                <Comment author={comment.name} key={comment.id}>
                    {comment.songs}
                </Comment>
            );
        });

        return (
            <div className="commentList">
                {commendNodes}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    render: function () {
        return (
            <div className="commentForm">
                Hello, world! I am a CommentForm.
            </div>
        );
    }
});

var Comment = React.createClass({
    rawMarkup: function() {
        var md = new Remarkable();
        var rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    },

    render: function () {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
});

ReactDOM.render(
    <CommentBox url="http://localhost:8081/api/performers" />,
    document.getElementById('root')
);
