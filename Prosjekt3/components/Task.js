import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TextInput } from 'react-native';
import CheckBox from 'react-native-check-box'

class Task extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View>
                <CheckBox
                    isChecked={this.props.checked}
                    onClick={() => {this.props.handleCheckbox(this.props.id)}}
                />
            </View>
        )
    }
}


export default Task;