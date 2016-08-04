import React from "react";
import update from "react-addons-update";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import AutoComplete from "material-ui/AutoComplete";
import * as $ from "jquery";
import SongAddStepper from "../components/SongAddStepper"

const urlGetPerformers = 'http://localhost:8081/api/performers';

const styles = {
    page: {
        marginLeft: '70px',
        marginRight: '70px'
    }
};

export default class AddNewSong extends React.Component {

    constructor() {
        super();
        this.state = {
            song: {
                performer: {
                    name: "",
                    id: -1
                },
                title: "",
                lyrics: "",
            },
            performers: []
        };
    }

    componentDidMount() {
        this.loadAllPerformers();
    }

    loadAllPerformers() {
        $.ajax({
            url: urlGetPerformers,
            dataType: 'json',
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                this.setState({performers: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    handlePerformerChange = (performer) => {
        var newState = update(this.state, {
            song: {
                performer: {$set: {
                    name: performer.name,
                    id: performer.id
                }}
            }
        });
        this.setState(newState)
    };

    handleTitleChange = (e) => {
        var newState = update(this.state, {
            song: {
                title: {$set: e.target.value}
            }
        });
        this.setState(newState);
    };

    handleLyricsChange = (e) => {
        var newState = update(this.state, {
            song: {
                lyrics: {$set: e.target.value}
            }
        });
        this.setState(newState)
    };

    render() {
        return (
            <div style={styles.page}>
                <h3>Add new song</h3>
                <SongAddStepper performers={this.state.performers}/>
            </div>
        )
    }
}

//     <AutoComplete
//         floatingLabelText="Artist"
//         filter={AutoComplete.fuzzyFilter}
//         dataSource={this.state.performers}
//         dataSourceConfig={{text: 'name', value: 'id'}}
//         maxSearchResults={5}
//         fullWidth={true}
//         searchText={this.state.song.performer.name}
//         onNewRequest={this.handlePerformerChange}
//     /><br/>
//     <TextField
//         floatingLabelText="Title"
//         fullWidth={true}
//         value={this.state.song.title}
//         onChange={this.handleTitleChange}
//     /><br/>
//     <TextField
//         floatingLabelText="Lyrics"
//         fullWidth={true}
//         multiLine={true}
//         rows={10}
//         value={this.state.song.lyrics}
//         onChange={this.handleLyricsChange}
//     /><br/>
//     <FlatButton onClick={this.handleSubmit} label="Submit" primary={true}/>