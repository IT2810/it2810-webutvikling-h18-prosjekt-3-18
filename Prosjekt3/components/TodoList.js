import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import ProgressBar from "./ProgressBar";

class TodoList extends Component {
    constructor(props) {
        super(props);
        this.onPressOpen = this.onPressOpen.bind(this);

    }

    render() {
        return (
            <View>
                <ProgressBar
                    current={this.props.complete}
                    max={this.props.total}
                    height={10}
                    width={100}/>
                <Button onPress={this.onPressOpen} title="Open"/>
            </View>
        )
    }

    onPressOpen() {
        this.props.onOpen(this.props.id);
    }
}

export default TodoList;