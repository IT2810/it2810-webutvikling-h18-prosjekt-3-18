import React, { Component } from 'react';
import { View, Text, Button, TouchableOpacity} from 'react-native';
import ProgressBar from "./ProgressBar";

class TodoList extends Component {
    constructor(props) {
        super(props);
        this.onPressOpen = this.onPressOpen.bind(this);

    }

    render() {
        return (
        <TouchableOpacity title="Open" onPress={this.onPressOpen}>
            <View style={{ flexDirection: 'row', flex:0.95, marginLeft:2, paddingTop:2, marginTop:2,  alignItems: 'stretch'}}>
                <Text> {this.props.name}</Text>
                    <View style={{alignItems: 'center', marginLeft: 40, paddingTop: 5}}>
                    <ProgressBar
                        current={this.props.complete}
                        max={this.props.total}
                        height={10}
                        width={100}/>
                    </View>
            </View>
        </TouchableOpacity>
        )
    }

    onPressOpen() {
        this.props.onOpen(this.props.id);
    }
}

export default TodoList;
