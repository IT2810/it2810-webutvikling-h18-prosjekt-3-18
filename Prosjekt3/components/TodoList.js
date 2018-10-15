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
            <View style={{ flexDirection: 'row', flex:0.95, marginLeft:2, paddingTop:2, marginTop:2,  alignItems: 'stretch'}}>
                <TouchableOpacity title="Open" onPress={this.onPressOpen}>
                <Text style={{width:100}}> {this.props.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity title="Open" onPress={this.onPressOpen}>
                    <View style={{alignItems: 'center', marginLeft: 40, paddingTop: 5}}>
                    <ProgressBar
                        current={this.props.complete}
                        max={this.props.total}
                        height={10}
                        width={100}/>
                    </View>
                </TouchableOpacity>
            </View>

        )
    }

    onPressOpen() {
        this.props.onOpen(this.props.id);
    }
}

export default TodoList;
